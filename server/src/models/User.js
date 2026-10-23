import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['customer', 'staff', 'admin'],
      default: 'customer'
    },
    department: {
      type: String,
      enum: ['sales', 'accounts', 'inventory', 'operations', 'management', 'client'],
      default: function () {
        return this.role === 'customer' ? 'client' : 'sales';
      }
    },
    permissions: {
      type: [String],
      default: function () {
        if (this.role === 'admin') return ['all'];
        if (this.role === 'staff') {
          if (this.department === 'sales') return ['enquiries:read', 'enquiries:write', 'quotes:read', 'quotes:write', 'customers:read', 'customers:write', 'tasks:manage'];
          if (this.department === 'accounts') return ['quotes:read', 'quotes:write', 'reports:read'];
          if (this.department === 'inventory') return ['products:manage', 'enquiries:read'];
          return ['enquiries:read', 'quotes:read'];
        }
        return ['self:access'];
      }
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    },
    isEmailVerified: {
      type: Boolean,
      default: true
    },
    accountStatus: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if user has specific permission
userSchema.methods.hasPermission = function (perm) {
  if (this.role === 'admin') return true;
  if (!this.permissions || !Array.isArray(this.permissions)) return false;
  return this.permissions.includes('all') || this.permissions.includes(perm);
};

export const User = mongoose.model('User', userSchema);
