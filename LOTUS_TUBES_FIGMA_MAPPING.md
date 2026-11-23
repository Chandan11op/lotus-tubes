# LOTUS TUBES — FIGMA-TO-CODE DESIGN MAPPING SPECIFICATION

**Figma Reference**: [Lotus Impex website prototype](https://www.figma.com/proto/7Hguyhs0CvThMwz6gWVuJg/Lotus-Impex-website?node-id=12-767&t=6lmasBblrdnu1wKf-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=11%3A3)  
**Primary Approved Screen**: Node `12-767` (Resolution: 640x3948 base, scaled to 1440px desktop breakpoint)  
**Alternative / Reference Screen**: Node `11-3` (Initial layout reference)  
**Website Identity**: Lotus Tubes (associated with Lotus Impex, Mumbai, Maharashtra, India)

---

## 1. DESIGN SYSTEM SPECIFICATIONS

### 1.1 Color Palette

| Token Name | Hex Code | Visual Application in Figma |
| :--- | :--- | :--- |
| **Navbar Background** | `#FFFFFF` | Clean white top navigation header bar |
| **Navbar Links Text** | `#1E293B` | Dark charcoal navigation links text |
| **Primary Brand Navy** | `#081D5B` / `#0C225E` | Hero section gradient, brand banner background |
| **Deep Dark Navy** | `#051026` / `#030810` | Global dark backgrounds, footer background |
| **Primary Pink Accent** | `#E93984` → `#FC63A7` | Gradient on primary buttons ("Explore our products", "Call Now", "Submit", "View All", "Request Full Catalogue") |
| **Solid Pink Accent** | `#EC4899` / `#E11D48` | Section titles ("Our Products", "INDUSTRIES WE SERVE", "Testimonials", "Hot Products", "Articles and Blogs") |
| **Secondary Button Outlines** | `#FFFFFF` / `rgba(255, 255, 255, 0.4)` | "Request A Quote" dark button with subtle white border |
| **Card Navy Fill** | `#07163B` / `#0A1E4A` | Product card background fill with subtle inner border |
| **White Card Fill** | `#FFFFFF` | Lead capture quotation form card, hot product cards, article cards |
| **Subtle Border Navy** | `rgba(255, 255, 255, 0.12)` | Card borders, dividers, subtle separators |

### 1.2 Typography Hierarchy

| Role | Font Family | Size (Desktop / Mobile) | Weight | Line Height / Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `Inter`, sans-serif | 48px / 30px | 800 (ExtraBold) | 1.15, uppercase, tight tracking |
| **Section Headings** | `Inter`, sans-serif | 32px / 24px | 700 (Bold) | 1.25, Centered with pink accent |
| **Subheadings / Subtitles** | `Inter`, sans-serif | 15px / 13px | 400 (Regular) | 1.6, clean contrast |
| **Card Product Titles** | `Inter`, sans-serif | 16px / 14px | 600 (SemiBold) | 1.3, centered white text |
| **Primary CTA Labels** | `Inter`, sans-serif | 14px / 13px | 600 (SemiBold) | 1.0, white text on pink pill |
| **Body & Form Inputs** | `Inter`, sans-serif | 14px / 13px | 400 (Regular) | 1.5, placeholder `#94A3B8` |
| **Footer Headers** | `Inter`, sans-serif | 13px / 12px | 700 (Bold) | 1.3, uppercase tracking-wider |
| **Footer Links** | `Inter`, sans-serif | 12px / 11px | 400 (Regular) | 1.6, `#94A3B8` hover `#FFFFFF` |

---

## 2. COMPONENT AND SECTION MAPPING (NODE 12-767)

| Section Sequence | Figma Component (Node 12-767) | Existing React Component | Implementation Action |
| :---: | :--- | :--- | :--- |
| **01** | **Top Navbar**<br>- Pure white background (`#FFFFFF`)<br>- Logo left: Lotus Impex/Tubes (`/banner-image.png`)<br>- Nav Links: Home, About, Products, Size Chart, Contact<br>- Right CTAs: Pink pill "Call Now ↗", WhatsApp icon button | `client/src/components/layout/Navbar.jsx`<br>`client/src/components/layout/TopBar.jsx` | Update Navbar styling to match Figma white bar with pink "Call Now" CTA & WhatsApp button, proper links and active state. |
| **02** | **Hero Section**<br>- Navy background (`#081D5B` to `#0C225E`) with dot-matrix world map<br>- Left: Bold title `STAINLESS STEEL SANITARY VALVES SOLUTIONS`<br>- Subtitle paragraph<br>- Dual buttons: Pink "Explore our products ↗" + Outlined "Request A Quote ↗"<br>- Right: Multi-tier 3D display podium with sanitary valves, fittings, SMS union, butterfly valve, elbows | `client/src/pages/HomeView.jsx` (Hero section) | Replace existing hero layout with exact Figma structure: left text column + dual buttons; right high-res podium image. |
| **03** | **Our Products Section**<br>- Title: "Our Products" in pink `#EC4899`<br>- 6 Navy rounded cards (2x3 grid) with subtle lotus watermark<br>- Centered product image + title at bottom<br>- Button: Centered pink pill "View All ↗" | `client/src/pages/HomeView.jsx` (`#categories` or `#products-showcase`) | Implement 6-card navy grid matching Figma dimensions, linking to product categories/details, with "View All" button. |
| **04** | **Stats & Value Proposition Strip**<br>- 4 Navy rounded pills in a row:<br>  1. 24x7 technical support<br>  2. 1000+ variants available<br>  3. 30+ years of experience<br>  4. 100M+ products supplied | `client/src/pages/HomeView.jsx` | Match exact 4 badges with icons and typography. |
| **05** | **Brand Showcase Banner**<br>- Wide navy card with rounded corners<br>- Left: Pink lotus logo, company overview text, "View All ↗" pink button<br>- Right: Sanitary tubes, fittings and vessel on circular podium with neon rim | `client/src/pages/HomeView.jsx` | Implement exact banner layout linking to About/Products. |
| **06** | **Industries We Serve**<br>- Heading: "INDUSTRIES WE SERVE" in pink `#EC4899`<br>- 5 Industrial cards with top photo and dark bottom label:<br>  1. Dairy Industry<br>  2. Agricultural Industry (Food & Beverage)<br>  3. Chemical Industry<br>  4. Manufacturing Industries<br>  5. Construction & Mining (Water Treatment) | `client/src/pages/HomeView.jsx` (`#industries`) | Re-style into exact Figma 5-card horizontal layout with navy title bars. |
| **07** | **Download Brochure Banner**<br>- Dark blue container with subtle circular texture<br>- Text: "Download our brochure"<br>- Download PDF button | `client/src/pages/HomeView.jsx` | Add brochure download banner linking to technical PDF catalogue. |
| **08** | **Testimonials Section**<br>- Heading: "Testimonials" in pink<br>- 3 dark navy cards with large quote icon `“`<br>- Client feedback, avatar, role ("OEM Partner", "Engineering Head", "Procurement Manager") | `client/src/pages/HomeView.jsx` | Implement exact 3-card testimonial layout. |
| **09** | **Get Your Quotation (Lead Capture)**<br>- Dark navy container<br>- Left: Office Address, Factory Address, Phone, Email<br>- Right: Clean white card form (Name, Phone, Email, Message, Pink "Submit" button) | `client/src/pages/HomeView.jsx` (`#boq-request` / Quick Enquiry) | Replace complex form with exact Figma layout: Left company details + Right clean white card form connected to existing backend API. |
| **10** | **Precision-Engineered For Every Industry**<br>- Heading: "PRECISION-ENGINEERED FOR EVERY INDUSTRY"<br>- Subtitle: "ENGINEERING EXCELLENCE"<br>- 4 large dark product cards (2x2 grid):<br>  1. Sanitary Pipes<br>  2. Sanitary Valves<br>  3. Sanitary Pipe Fittings<br>  4. Sanitary Seamless Tubes<br>- Bottom pink button: "Request Full Catalogue ↗" | `client/src/pages/HomeView.jsx` | Implement 2x2 large dark product cards with red/pink arrow action button. |
| **11** | **Project Gallery**<br>- Heading: "Project"<br>- 4 installation photographs showing pharmaceutical and industrial process lines | `client/src/pages/HomeView.jsx` | Add clean 4-photo project gallery strip. |
| **12** | **Hot Products Carousel/Grid**<br>- Heading: "Hot Products" in pink<br>- Clean white product cards with photo and title<br>- Pagination dots | `client/src/pages/HomeView.jsx` | Add Hot Products row with genuine static product photos. |
| **13** | **Articles and Blogs**<br>- Heading: "Articles and Blogs" in pink<br>- 8 Article cards (2 rows of 4) with thumbnail and title | `client/src/pages/HomeView.jsx` | Add 8 technical guides / article cards with thumbnails. |
| **14** | **Our Successful History & Expert Badge**<br>- Split card: Left dark card "Expert in Import Quality Products You Can Trust"<br>- Right: "Our Successful History" + paragraph + "Read More ->" | `client/src/pages/HomeView.jsx` | Implement split history block. |
| **15** | **From Source to Site (Process Flow)**<br>- Dark navy banner with faint "LOTUS IMPEX" watermark<br>- 4 Step circles with horizontal connecting line:<br>  1. Source<br>  2. Test<br>  3. Quality Check<br>  4. Deliver | `client/src/pages/HomeView.jsx` | Add 4-step process flow banner with clean step icons. |
| **16** | **Enterprise Supply, Enterprise Speed & Facility Media**<br>- Left: Bold headline "ENTERPRISE SUPPLY, ENTERPRISE SPEED."<br>  4 Value items: Bulk Pricing, Rapid Turnaround, Pan India Supply, Custom Orders<br>- Right: QC / Lab photo with circular pink play button | `client/src/pages/HomeView.jsx` | Implement split feature section; QC photo opens static modal or enquiry. |
| **17** | **Global Footer**<br>- Background: Deep navy (`#081D5B` / `#051026`)<br>- Top bar: Logo + Sales support copy + Pink button "ASK FOR HELP"<br>- 4 Columns:<br>  1. Recommended Products (fittings & components)<br>  2. Hot Products (valves & tubes)<br>  3. Product Categories<br>  4. Contact Us (Office address, phone, WhatsApp, email)<br>- Copyright line | `client/src/components/layout/Footer.jsx` | Restructure Footer into exact Figma layout with top support banner and 4 organized columns. |

---

## 3. INTERNAL ROUTES & SUB-PAGES DESIGN CONTINUITY

For routes not explicitly framed in the prototype (Products Catalogue, Product Detail, About Us, Contact, Quality, Customer Portal, CRM):
- **Design System Consistency**: Inherit the exact Figma typography (`Inter`), colors (White `#FFFFFF`, Deep Navy `#081D5B`, Pink Accent `#E93984` → `#FC63A7`, Card Fill `#07163B`), button styles, and border radius (12px to 16px).
- **Product Presentation**: Strictly static genuine photographs only. Absolutely no 3D or 360-degree rotation.
- **Backend & CRM Protection**: Retain all backend API endpoints, CRM routes, employee role workflows, customer authentication, and quotation submissions intact.
