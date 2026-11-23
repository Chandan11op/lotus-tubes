# LOTUS TUBES — STEP-BY-STEP FIGMA IMPLEMENTATION PLAN

**Target Design Authority**: Figma Node `12-767` (`docs/figma_node_12_767.png`)  
**Project**: Lotus Tubes (Lotus Impex)  
**Strict Constraint**: NO visual improvisations. NO 3D / 360 rotation / video viewers. STRICT adherence to Figma hierarchy, colors, typography, and section flow.

---

## EXECUTION PHASES

### Phase 1 — Asset Extraction & Design Assets Setup
1. Extract and crop high-fidelity graphical assets from `docs/figma_node_12_767.png` into `client/public/assets/images/figma/`:
   - `hero-podium.png`: 3-tier podium displaying sanitary valves & fittings with glowing rings.
   - `brand-showcase-podium.png`: Display of sanitary tubes and tank.
   - `precision-pipes.png`, `precision-valves.png`, `precision-fittings.png`, `precision-tubes.png`: 4 large dark category card images.
   - `process-source-site.png` / step visual assets.
   - `qc-lab-inspection.png`: Quality inspection laboratory visual.
   - Project gallery and hot products assets.
2. Verify all extracted image assets are available and properly referenced.

### Phase 2 — Navbar & Navigation (`client/src/components/layout/Navbar.jsx`)
1. Implement pure white background (`#FFFFFF`) with bottom border `rgba(0, 0, 0, 0.08)`.
2. Position Lotus Impex / Lotus Tubes logo on the left.
3. Center navigation links: `Home`, `About`, `Products`, `Size Chart` (linking to resources/specs), `Contact`.
4. Right action buttons:
   - Primary Pink Pill button: `Call Now ↗` (with phone link / quick dial).
   - WhatsApp circular icon button with direct WhatsApp click-to-chat.
5. Retain responsive mobile hamburger drawer with consistent Figma styling.

### Phase 3 — Homepage Implementation (`client/src/pages/HomeView.jsx`)
Implement all 16 sections strictly in the sequence displayed in Figma Node 12-767:
1. **Hero Section**:
   - Deep royal navy background (`#081D5B` to `#0C225E`) with dot-matrix pattern.
   - Left column:
     - All-caps heading: `STAINLESS STEEL SANITARY VALVES SOLUTIONS`
     - Clean subtitle describing Lotus Tubes sanitary piping, fittings, and valves in SS 304 & SS 316L.
     - Dual buttons: Pink pill `Explore our products ↗` (links to `#products-showcase`) + Dark outlined pill `Request A Quote ↗` (opens enquiry modal / scrolls to quotation form).
   - Right column: High-resolution 3D-podium sanitary valves visual.
2. **"Our Products" Section**:
   - Centered pink heading: `Our Products` (`#EC4899`).
   - 6-card navy grid (2 rows of 3 columns):
     - Dark navy cards (`#07163B`) with rounded corners and subtle lotus watermark.
     - Centered genuine product photo.
     - Centered product title in white text at the bottom.
   - Centered pink pill button: `View All ↗` (links to `/products`).
3. **Value Proposition Strip**:
   - Horizontal strip with 4 dark navy rounded badge cards:
     1. 24x7 technical support (headset)
     2. 1000+ variants available (shapes)
     3. 30+ years of experience (calendar-star)
     4. 100M+ products supplied (trend)
4. **Brand Showcase Banner**:
   - Wide rounded card with navy background.
   - Left side: Pink lotus flower logo, Lotus Tubes company introduction, `View All ↗` pink button.
   - Right side: Display of sanitary tubes and tank on neon podium.
5. **"INDUSTRIES WE SERVE" Section**:
   - Heading: `INDUSTRIES WE SERVE` in pink.
   - 5 industrial cards with image top and navy bottom title bar:
     1. Dairy Industry
     2. Food & Beverage / Agricultural Industry
     3. Chemical Industry
     4. Manufacturing & Pharma Industries
     5. Water Treatment / Construction
6. **"Download our brochure" Banner**:
   - Dark navy banner with circular background accents and PDF download button.
7. **"Testimonials" Section**:
   - Heading: `Testimonials` in pink.
   - 3 dark navy testimonial cards with large quote icons `“`: OEM Partner, Engineering Head, Procurement Manager.
8. **"Get your Quotation" Section**:
   - Dark navy container.
   - Left column: Office address, Factory address, Phone numbers, Email.
   - Right column: Clean white card with form fields (Name, Phone, Email, Message, Pink Submit button) connected to backend API.
9. **"PRECISION-ENGINEERED FOR EVERY INDUSTRY" Section**:
   - Heading: `PRECISION-ENGINEERED FOR EVERY INDUSTRY` with subtitle `ENGINEERING EXCELLENCE`.
   - 4 large dark product cards (2x2 grid):
     1. Sanitary Pipes
     2. Sanitary Valves
     3. Sanitary Pipe Fittings
     4. Sanitary Seamless Tubes
   - Centered pink button: `Request Full Catalogue ↗`.
10. **"Project" Gallery**:
    - 4 horizontal project installation photos.
11. **"Hot Products" Carousel/Grid**:
    - Heading: `Hot Products` in pink.
    - Clean white cards showing sanitary hose couplings, adapters, clamps, ferrules.
12. **"Articles and Blogs" Section**:
    - Heading: `Articles and Blogs` in pink.
    - 8 article cards with technical guides & industry knowledge.
13. **"Our Successful History" & "Expert in Import Quality Products"**:
    - Split block: Left dark badge card + Right history story and "Read More ->".
14. **"FROM SOURCE TO SITE" (Process Flow)**:
    - Dark navy container with faint watermark.
    - 4 step indicators connected by a horizontal line: Source -> Test -> Quality Check -> Deliver.
15. **"ENTERPRISE SUPPLY, ENTERPRISE SPEED." & Facility Media**:
    - Left column: Heading + 4 capability blocks (Bulk Pricing, Rapid Turnaround, Pan India Supply, Custom Orders).
    - Right column: Quality lab & inspection facility image with play trigger.

### Phase 4 — Global Footer (`client/src/components/layout/Footer.jsx`)
1. Deep dark navy background (`#081D5B` / `#051026`).
2. Top sales consultation banner:
   - Brand logo on left + "Do not know how to choose the right products? Our professional sales engineers are here to consult..." + Pink button `ASK FOR HELP`.
3. 4 Organized columns:
   - Column 1: `RECOMMENDED PRODUCTS` (DIN 11851 fittings, unions, bends, reducers).
   - Column 2: `HOT PRODUCTS` (Sanitary butterfly valves, diaphragm valves, ball valves).
   - Column 3: `PRODUCT CATEGORIES` (Sanitary Valves, Fittings, Tubes, Tank Accessories, Gaskets).
   - Column 4: `CONTACT US` (Mumbai office address, phone numbers, WhatsApp, email).
4. Copyright bar at the bottom.

### Phase 5 — Product Catalogue & Data Integrity (`client/src/data/siteData.js`, `productsData.js`)
1. Ensure the 20 priority products from Section 6.2 are prominent.
2. Confirm entries 36-50 are omitted cleanly (never fabricated).
3. Connect all product cards to actual factual specifications (SS 304 / SS 316L, EP / MP finish, ASTM A270 / BS 4825).
4. Remove any 3D/360-degree rotation code or video viewer logic to comply with Section 5.

### Phase 6 — Verification & Quality Audit
1. Run `npm run build` in `client` to verify asset audit, Vite compilation, static pre-rendering, and schema validation.
2. Verify all links, modals, quotation submission, and WhatsApp button functionality.
3. Generate final reports:
   - `LOTUS_TUBES_IMPLEMENTATION_REPORT.md`
   - `LOTUS_TUBES_VISUAL_QA_REPORT.md`
   - `LOTUS_TUBES_PENDING_ITEMS.md`
