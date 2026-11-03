import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/8ec9bf3f-f3e8-4e45-ad1d-6dae37fb60a8';
const HERO_DIR = path.resolve('client/public/assets/images/hero');
const IND_DIR = path.resolve('client/public/assets/images/industries');
const FACTORY_DIR = path.resolve('client/public/assets/images/factory');

if (!fs.existsSync(HERO_DIR)) fs.mkdirSync(HERO_DIR, { recursive: true });
if (!fs.existsSync(IND_DIR)) fs.mkdirSync(IND_DIR, { recursive: true });
if (!fs.existsSync(FACTORY_DIR)) fs.mkdirSync(FACTORY_DIR, { recursive: true });

const mappings = [
  // Page Heroes
  {
    from: path.join(ARTIFACT_DIR, 'hero_about_commercial_factory_1793696913719.jpg'),
    to: path.join(HERO_DIR, 'hero-about-commercial-factory.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'hero_products_warehouse_logistics_1793696940353.jpg'),
    to: path.join(HERO_DIR, 'hero-products-warehouse-logistics.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'hero_industries_collage_1793696969647.jpg'),
    to: path.join(HERO_DIR, 'hero-industries-collage.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'hero_quality_documentation_desk_1793697000923.jpg'),
    to: path.join(HERO_DIR, 'hero-quality-documentation-desk.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'hero_resources_factory_raw_materials_1793697032463.jpg'),
    to: path.join(HERO_DIR, 'hero-resources-factory-raw-materials.jpg')
  },
  {
    from: path.resolve('client/public/assets/images/company/lotus-tubes-facility.jpg'),
    to: path.join(HERO_DIR, 'hero-contact-calling-team-office.jpg')
  },

  // Industries Cards
  {
    from: path.join(ARTIFACT_DIR, 'pharmaceutical_1793696939187.jpg'),
    to: path.join(IND_DIR, 'pharmaceutical.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'biotechnology_1793696958855.jpg'),
    to: path.join(IND_DIR, 'biotechnology.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'dairy_1793696990008.jpg'),
    to: path.join(IND_DIR, 'dairy.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'food_beverage_1793697023049.jpg'),
    to: path.join(IND_DIR, 'food-beverage.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'breweries_1793697071166.jpg'),
    to: path.join(IND_DIR, 'breweries.jpg')
  },
  {
    from: path.resolve('client/public/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-001.jpg'),
    to: path.join(IND_DIR, 'water-treatment.jpg')
  },
  {
    from: path.resolve('client/public/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-004.jpg'),
    to: path.join(IND_DIR, 'chemical.jpg')
  },

  // Factory Video Backgrounds
  {
    from: path.join(ARTIFACT_DIR, 'factory_pipes_manufacturing_1793696953090.jpg'),
    to: path.join(FACTORY_DIR, 'factory-pipes-manufacturing.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'factory_valves_machining_1793696988051.jpg'),
    to: path.join(FACTORY_DIR, 'factory-valves-machining.jpg')
  },
  {
    from: path.join(ARTIFACT_DIR, 'factory_clamp_fabrication_1793697038675.jpg'),
    to: path.join(FACTORY_DIR, 'factory-clamp-fabrication.jpg')
  },
  {
    from: path.resolve('client/public/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-002.jpg'),
    to: path.join(FACTORY_DIR, 'factory-pneumatic-assembly.jpg')
  }
];

console.log('Deploying generated assets into project...');
for (const m of mappings) {
  if (fs.existsSync(m.from)) {
    fs.copyFileSync(m.from, m.to);
    console.log(`✅ Deployed: ${path.relative('.', m.to)} (${(fs.statSync(m.to).size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`⚠️ Source not found: ${m.from}`);
  }
}
console.log('Asset deployment complete.');

