import mongoose from 'mongoose';

const whatsAppWebhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    eventType: {
      type: String,
      required: true,
      index: true
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    processed: {
      type: Boolean,
      default: false,
      index: true
    },
    processedAt: {
      type: Date,
      default: null
    },
    error: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const WhatsAppWebhookEvent = mongoose.model('WhatsAppWebhookEvent', whatsAppWebhookEventSchema);
