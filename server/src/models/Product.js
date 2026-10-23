import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    sku: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    categorySlug: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    priorityRank: {
      type: Number,
      default: 99
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    material: {
      type: String,
      required: true,
      default: 'SS 316L'
    },
    finish: {
      type: String,
      required: true,
      default: 'Electro Polished (EP)'
    },
    roughness: {
      type: String,
      default: 'Ra ≤ 0.38 µm (15 µin)'
    },
    manufacturingType: {
      type: String,
      default: 'Seamless or Welded'
    },
    standard: {
      type: String,
      default: 'ASTM A270 / ASTM A269'
    },
    connection: {
      type: String,
      default: 'Plain End / TC Ferrules on request'
    },
    sizes: {
      type: String,
      default: '1/2" to 4" OD'
    },
    wallThickness: {
      type: String,
      default: '1.2 mm to 2.0 mm'
    },
    length: {
      type: String,
      default: '6.0 Meters Standard'
    },
    mtc: {
      type: String,
      default: 'EN 10204 3.1 Material Test Certificate supplied'
    },
    availability: {
      type: String,
      enum: ['Ready Stock (Dispatch in 24-48h)', 'Available Against Order', 'Custom Sizing Available'],
      default: 'Ready Stock (Dispatch in 24-48h)'
    },
    leadTime: {
      type: String,
      default: 'Immediate dispatch for standard sizes; 7-10 days for custom fabricated runs'
    },
    image: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    video: {
      type: String,
      default: ''
    },
    has360View: {
      type: Boolean,
      default: false
    },
    view360Folder: {
      type: String,
      default: ''
    },
    overview: {
      type: String,
      required: true
    },
    applications: {
      type: [String],
      default: []
    },
    technicalSpecs: {
      type: Map,
      of: String,
      default: {}
    },
    qualityDocuments: {
      type: [String],
      default: ['EN 10204 3.1 MTC', 'Positive Material Identification (PMI) Report']
    },
    seo: {
      title: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: [String], default: [] }
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model('Product', productSchema);
