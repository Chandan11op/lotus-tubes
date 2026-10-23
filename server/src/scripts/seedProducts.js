import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Product } from '../models/Product.js';
import { MASTER_PRODUCTS } from '../data/catalogData.js';

export const seedProductCatalog = async () => {
  try {
    console.log('📦 Seeding Product Catalogue into MongoDB...');
    let count = 0;

    for (const item of MASTER_PRODUCTS) {
      await Product.findOneAndUpdate(
        { slug: item.slug },
        {
          name: item.name,
          slug: item.slug,
          sku: item.sku || `LT-${item.id.toUpperCase()}`,
          category: item.category,
          categorySlug: item.categorySlug,
          priorityRank: item.priorityRank || 99,
          featured: !!item.featured,
          material: item.material,
          finish: item.finish,
          roughness: item.roughness || 'Ra ≤ 0.4 µm',
          manufacturingType: item.manufacturingType || 'Welded or Seamless',
          standard: item.standard || 'ASTM A270',
          connection: item.connection || 'Plain End / Tri-Clamp',
          sizes: item.sizes || 'Standard Range',
          wallThickness: item.wallThickness || '1.2 mm to 2.0 mm',
          length: item.length || '6.0 Meters Standard',
          mtc: item.mtc || 'EN 10204 3.1 Supplied',
          availability: item.availability || 'Ready Stock (Dispatch in 24-48h)',
          leadTime: item.leadTime || 'Immediate dispatch for standard sizes',
          image: item.image || '',
          images: item.images || [item.image].filter(Boolean),
          video: item.video || '',
          has360View: !!item.has360View,
          view360Folder: item.view360Folder || '',
          overview: item.overview,
          applications: item.applications || [],
          seo: item.seo || {
            title: `${item.name} | Lotus Tubes`,
            metaDescription: `${item.name} supplier in Mumbai. Certified quality and fast quotation.`
          },
          status: 'published'
        },
        { upsert: true, new: true }
      );
      count++;
    }

    console.log(`✅ Successfully seeded/synced ${count} verified products into MongoDB.`);
    return count;
  } catch (error) {
    console.error('❌ Failed to seed products:', error.message);
    throw error;
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedProducts.js')) {
  (async () => {
    await connectDB();
    await seedProductCatalog();
    await mongoose.disconnect();
    process.exit(0);
  })();
}
