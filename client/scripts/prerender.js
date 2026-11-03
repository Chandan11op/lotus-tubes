/**
 * Lotus Tubes - Static Route Pre-renderer for Vite & Vercel
 * 
 * Generates SEO-optimized, crawlable static HTML files for all core public routes
 * in client/dist/ so search engine crawlers (Seobility, Googlebot, Bingbot)
 * receive 100% semantic HTML, meaningful H1s, rich paragraphs, and crawlable links.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_HTML_FILE = path.join(DIST_DIR, 'index.html');

const CANONICAL_BASE = 'https://lotus-tubes-react-design.vercel.app';

if (!fs.existsSync(BASE_HTML_FILE)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(BASE_HTML_FILE, 'utf8');

// Public routes with authentic B2B content
const routes = [
  {
    path: 'products',
    title: 'Sanitary Stainless Steel Catalogue | Pipes, Valves & Fittings | Lotus Tubes',
    description: 'Explore Lotus Tubes comprehensive range of SS 304 and SS 316L sanitary pipes, electropolished tubing, Tri-Clamp fittings, and hygienic valves.',
    h1: 'Stainless Steel Sanitary Product Catalogue',
    content: `
      <section style="padding: 32px 0;">
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #10263D; margin-bottom: 16px;">Stainless Steel Sanitary Product Catalogue</h1>
        <p style="font-size: 1.1rem; color: #475569; max-width: 900px; margin-bottom: 24px;">
          Comprehensive catalogue of hygienic fluid transfer components manufactured in premium SS 304 and SS 316L stainless steel. Every item is inspected for dimensional tolerances, surface smoothness down to Ra ≤ 0.4 µm, and certified with EN 10204 3.1 Mill Test Reports.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
            <h2 style="font-size: 1.3rem; color: #10263D; margin-bottom: 8px;">Sanitary Pipes &amp; Tubes</h2>
            <p style="font-size: 14px; color: #64748B;">ASTM A270 and ASME BPE compliant SS 304 and SS 316L tubes with electropolished (EP) and mechanical (MP) mirror finishes.</p>
            <a href="/category/sanitary-pipes" style="color: #0284C7; font-weight: 600; text-decoration: none;">View Sanitary Tubes &rarr;</a>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
            <h2 style="font-size: 1.3rem; color: #10263D; margin-bottom: 8px;">Sanitary Pipe Fittings</h2>
            <p style="font-size: 14px; color: #64748B;">90° bends, equal tees, reducing tees, concentric and eccentric reducers in butt-weld and clamp ends.</p>
            <a href="/category/sanitary-fittings" style="color: #0284C7; font-weight: 600; text-decoration: none;">View Pipe Fittings &rarr;</a>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
            <h2 style="font-size: 1.3rem; color: #10263D; margin-bottom: 8px;">Tri-Clamp Ferrule Systems</h2>
            <p style="font-size: 14px; color: #64748B;">Heavy-duty 13MHH clamps, precision weld ferrules, and pharmaceutical-grade silicone and PTFE gaskets.</p>
            <a href="/category/tri-clamp" style="color: #0284C7; font-weight: 600; text-decoration: none;">View Tri-Clamp Components &rarr;</a>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
            <h2 style="font-size: 1.3rem; color: #10263D; margin-bottom: 8px;">Hygienic Process Valves</h2>
            <p style="font-size: 14px; color: #64748B;">Sanitary butterfly valves, diaphragm valves, ball valves, and non-return check valves for sterile flow control.</p>
            <a href="/category/manual-valves" style="color: #0284C7; font-weight: 600; text-decoration: none;">View Process Valves &rarr;</a>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'about',
    title: 'About Lotus Tubes | Stainless Steel Sanitary Specialists Mumbai',
    description: 'Lotus Tubes delivers high-precision stainless steel sanitary tubes and components from Girgaon, Mumbai to pharmaceutical and food process leaders worldwide.',
    h1: 'About Lotus Tubes — Precision Sanitary Flow Solutions',
    content: `
      <section style="padding: 32px 0;">
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #10263D; margin-bottom: 16px;">About Lotus Tubes — Precision Sanitary Flow Solutions</h1>
        <p style="font-size: 1.1rem; color: #475569; max-width: 900px; margin-bottom: 24px;">
          Lotus Tubes (Lotus Impex) is a premier stockist, distributor, and exporter of high-purity stainless steel sanitary pipes, fittings, tri-clamp components, and process valves. Operating from our central facility in Girgaon, Mumbai, we serve critical pharmaceutical, biotechnology, dairy, food, and beverage process leaders across India and global export markets.
        </p>
        <h2 style="font-size: 1.5rem; color: #10263D; margin-top: 24px; margin-bottom: 12px;">Material Integrity &amp; Sourcing Standards</h2>
        <p style="color: #475569; max-width: 850px; line-height: 1.7;">
          Every length of tubing and each fitting is strictly sourced in SS 304 and SS 316L chemistry. Our rigorous vendor qualification protocols ensure complete metallurgical traceability, backed by EN 10204 3.1 Mill Test Certificates (MTC) stating exact chemical composition, tensile strength, and hydrostatic pressure ratings.
        </p>
        <div style="margin-top: 24px;">
          <a href="/products" style="color: #0284C7; font-weight: 600; text-decoration: none; margin-right: 20px;">Explore Our Product Catalogue &rarr;</a>
          <a href="/contact" style="color: #10263D; font-weight: 600; text-decoration: none;">Contact Sales Office &rarr;</a>
        </div>
      </section>
    `
  },
  {
    path: 'quality',
    title: 'Quality Assurance & Mill Test Certification | Lotus Tubes',
    description: 'Every Lotus Tubes sanitary product complies with ASTM A270, ASME BPE, and 3-A standards. Verified with EN 10204 3.1 MTR inspection certification.',
    h1: 'Quality Assurance & MTC 3.1 Inspection Standards',
    content: `
      <section style="padding: 32px 0;">
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #10263D; margin-bottom: 16px;">Quality Assurance &amp; MTC 3.1 Inspection Standards</h1>
        <p style="font-size: 1.1rem; color: #475569; max-width: 900px; margin-bottom: 24px;">
          Sanitary process systems demand flawless cleanliness, uniform metallurgical composition, and absolute compliance with sanitary engineering standards. Every sanitary component supplied by Lotus Tubes conforms to internationally recognized codes.
        </p>
        <h2 style="font-size: 1.4rem; color: #10263D; margin-bottom: 12px;">Standard Specifications Compliance</h2>
        <ul style="color: #475569; line-height: 1.8; margin-left: 20px; margin-bottom: 24px;">
          <li><strong>ASTM A270 / ASTM A269:</strong> Standard specification for seamless and welded austenitic stainless steel sanitary tubing.</li>
          <li><strong>ASME BPE (BioProcessing Equipment):</strong> Strict dimensional tolerances, hygienic weld preparation, and Ra &le; 0.38 &micro;m internal finish.</li>
          <li><strong>3-A Sanitary Standards:</strong> Designed for dairy and food contact safety with clean-in-place (CIP) geometry.</li>
          <li><strong>EN 10204 3.1 MTC:</strong> Full chemical composition (C, Cr, Ni, Mo, S, P) and mechanical testing reports with original mill heat numbers.</li>
        </ul>
        <a href="/quote" style="display: inline-block; background: #0284C7; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; font-weight: 600; text-decoration: none;">Request Verified MTC with Quote</a>
      </section>
    `
  },
  {
    path: 'industries',
    title: 'Process Industries We Serve | Lotus Tubes Sanitary Solutions',
    description: 'Hygienic stainless steel piping, fittings, and valves engineered for pharmaceutical, biotech, dairy, food & beverage, and high-purity water systems.',
    h1: 'Hygienic Process Industries Served by Lotus Tubes',
    content: `
      <section style="padding: 32px 0;">
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #10263D; margin-bottom: 16px;">Hygienic Process Industries Served by Lotus Tubes</h1>
        <p style="font-size: 1.1rem; color: #475569; max-width: 900px; margin-bottom: 24px;">
          We supply high-purity sanitary fluid control solutions across critical industries where product purity, microbiological safety, and corrosion resistance are mandatory.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
            <h2 style="font-size: 1.25rem; color: #10263D; margin-bottom: 8px;">Pharmaceutical &amp; Biotechnology</h2>
            <p style="font-size: 14px; color: #64748B;">Sterile injectable skids, WFI distribution loops, active pharmaceutical ingredient (API) piping, and bioreactor harvest manifolds.</p>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
            <h2 style="font-size: 1.25rem; color: #10263D; margin-bottom: 8px;">Dairy &amp; Ice Cream Processing</h2>
            <p style="font-size: 14px; color: #64748B;">Pasteurizer hold tubes, milk silo reception lines, cheese vats, and automated CIP chemical circulation loops.</p>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
            <h2 style="font-size: 1.25rem; color: #10263D; margin-bottom: 8px;">Breweries &amp; Distilleries</h2>
            <p style="font-size: 14px; color: #64748B;">Fermentation cellar piping, bright beer tank manifolds, yeast propagation, and aseptic bottling lines.</p>
          </div>
        </div>
      </section>
    `
  },
  {
    path: 'resources',
    title: 'Engineering Resources & Technical Datasheets | Lotus Tubes',
    description: 'Download sanitary stainless steel dimensional charts, ASTM A270 specifications, and electropolished surface roughness conversion tables.',
    h1: 'Engineering Technical Resources & Dimensional Charts',
    content: `
      <section style="padding: 32px 0;">
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #10263D; margin-bottom: 16px;">Engineering Technical Resources &amp; Dimensional Charts</h1>
        <p style="font-size: 1.1rem; color: #475569; max-width: 900px; margin-bottom: 24px;">
          Reference technical charts, wall thickness schedules, Tri-Clamp flange dimension tables, and surface finish Ra microinch-to-micrometer conversion guides for mechanical engineers and plant designers.
        </p>
        <h2 style="font-size: 1.4rem; color: #10263D; margin-bottom: 12px;">Available Engineering Documentation</h2>
        <p style="color: #475569; font-size: 14px;">Contact our engineering team to request customized 2D/3D CAD dimensional models and official technical submittals for tender compliance.</p>
        <a href="/contact" style="color: #0284C7; font-weight: 600; text-decoration: none;">Request Technical Datasheets &rarr;</a>
      </section>
    `
  },
  {
    path: 'contact',
    title: 'Contact Lotus Tubes | Girgaon Mumbai Sales Office',
    description: 'Connect with Lotus Tubes engineering sales team in Mumbai for sanitary tubes, customized fittings, and valve requirements. Call +91 98205 25200.',
    h1: 'Contact Lotus Tubes — Sales & Engineering Inquiries',
    content: `
      <section style="padding: 32px 0;">
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #10263D; margin-bottom: 16px;">Contact Lotus Tubes — Sales &amp; Engineering Inquiries</h1>
        <p style="font-size: 1.1rem; color: #475569; max-width: 900px; margin-bottom: 24px;">
          Reach out to our sales and technical team in Mumbai for project quotations, ready stock verification, material test reports, and dispatch lead times.
        </p>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 24px; border-radius: 8px; max-width: 600px;">
          <h2 style="font-size: 1.3rem; color: #10263D; margin-bottom: 12px;">Lotus Tubes Sales Office</h2>
          <p style="margin: 0 0 8px 0; color: #475569;"><strong>Address:</strong> Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon, Mumbai - 400004, Maharashtra, India.</p>
          <p style="margin: 0 0 8px 0; color: #475569;"><strong>Telephone:</strong> <a href="tel:+919820525200" style="color: #0284C7; font-weight: 600; text-decoration: none;">+91 98205 25200</a></p>
          <p style="margin: 0 0 16px 0; color: #475569;"><strong>Email:</strong> <a href="mailto:sales@lotustubes.com" style="color: #0284C7; font-weight: 600; text-decoration: none;">sales@lotustubes.com</a></p>
          <a href="/quote" style="display: inline-block; background: #0284C7; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; font-weight: 600; text-decoration: none;">Submit Online RFQ &rarr;</a>
        </div>
      </section>
    `
  },
  {
    path: 'quote',
    title: 'Request a Formal B2B Quotation | Lotus Tubes',
    description: 'Submit your Bill of Quantities (BOQ) for instant review and competitive quotation on SS 304 and SS 316L sanitary pipes, fittings, and valves.',
    h1: 'Request Official Commercial Quotation & BOQ Pricing',
    content: `
      <section style="padding: 32px 0;">
        <h1 style="font-size: 2.2rem; font-weight: 800; color: #10263D; margin-bottom: 16px;">Request Official Commercial Quotation &amp; BOQ Pricing</h1>
        <p style="font-size: 1.1rem; color: #475569; max-width: 900px; margin-bottom: 24px;">
          Submit your required pipe schedules, fitting dimensions, clamp quantities, or valve specifications. Our sales team prepares detailed commercial quotations complete with technical parameters, payment terms, and delivery schedules.
        </p>
        <h2 style="font-size: 1.3rem; color: #10263D; margin-bottom: 8px;">Direct RFQ Support</h2>
        <p style="color: #475569; margin-bottom: 16px;">Call our commercial desk at <strong>+91 98205 25200</strong> or email your BOQ spreadsheet directly to <strong>sales&#64;lotustubes&#46;com</strong>.</p>
        <a href="/products" style="color: #0284C7; font-weight: 600; text-decoration: none;">Browse Catalogue to Select Items &rarr;</a>
      </section>
    `
  }
];

let generatedCount = 0;

for (const r of routes) {
  const canonicalUrl = `${CANONICAL_BASE}/${r.path}`;
  const targetDir = path.join(DIST_DIR, r.path);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Replace Title, Meta Description, Canonical, and OpenGraph in template
  let html = baseHtml;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${r.title}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${r.description}">`);
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}">`);
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${r.title}">`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${r.description}">`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}">`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${r.title}">`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${r.description}">`);

  // Replace the <main> block inside #root with page-specific content while keeping header and footer
  const mainRegex = /<main[\s\S]*?<\/main>/i;
  if (mainRegex.test(html)) {
    html = html.replace(mainRegex, `<main class="ssr-main">${r.content}</main>`);
  }

  const outFilePath = path.join(targetDir, 'index.html');
  fs.writeFileSync(outFilePath, html, 'utf8');
  generatedCount++;
  console.log(`Pre-rendered route: /${r.path} -> ${path.relative(DIST_DIR, outFilePath)}`);
}

console.log(`Pre-rendering complete. ${generatedCount} static routes generated in dist/.`);

