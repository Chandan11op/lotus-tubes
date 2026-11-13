# Lotus Tubes — Project Context & AI Development Handover

> **Purpose:** This document is the durable project brief for developers, AI coding agents, design tools, QA agents, SEO tools and future ChatGPT sessions working on Lotus Tubes. Read it before proposing or making changes.
>
> **Last consolidated:** 13 November 2026  
> **Repository:** https://github.com/Chandan11op/lotus-tubes  
> **Production website:** https://lotustubes.com/  
> **Backend host previously configured:** https://chocolate-goldfinch-515434.hostingersite.com/

---

## 1. How to use this document

This file is the project-level source of context, not a substitute for inspecting the current code. Before making a change:

1. Read this file and the relevant existing documentation under `docs/`.
2. Inspect the current `main` branch, package manifests, route/component structure, models, controllers, services, environment templates and tests. Do not assume this document describes every implementation detail.
3. Determine whether the request is a change to the **current website**, the **backend/API**, the **CRM**, **AI workflows**, **SEO/content**, **design/media**, or **deployment**.
4. Trace the full user journey and its backend/data dependencies before editing.
5. Make the smallest coherent change. Preserve working features and existing data contracts unless the task explicitly calls for changing them.
6. Run the relevant checks and report exactly what passed, failed or could not be run.
7. Update this file or the focused documentation when an architectural decision, workflow, environment variable, route, status or project milestone changes.

### Evidence labels used in this file

- **Verified in repository:** confirmed by files or repository metadata inspected on 13 November 2026.
- **Project requirement:** requested by the business/project brief; it may not yet be implemented.
- **Historical note:** appears in earlier project discussions and may have been superseded.
- **Needs verification:** must be checked against current production, client confirmation or source records before relying on it.

Do not convert a requirement into a statement of completed functionality. Do not treat a successful Git commit or deployment as proof that a business workflow works end-to-end.

---

## 2. Project mission

Lotus Tubes is a B2B product catalogue and lead-generation platform for stainless-steel sanitary pipes, tubes, fittings, clamps, gaskets, valves and related hygienic process components.

The business goal is to create a credible international supplier presence and a practical operational system that converts website visitors into traceable enquiries and quotation opportunities. The intended platform combines:

- A premium, responsive, industrial website.
- A structured, searchable product catalogue with accurate product information and genuine media.
- Enquiry, RFQ/BOQ and quotation-request journeys.
- A secure operational CRM for customers, leads, quotations, invoices, tasks and reporting.
- Controlled AI assistance for internal operations and customer communication.
- Super Admin approval for customer-facing financial documents and AI/staff responses.
- Email and WhatsApp Business communication with truthful delivery tracking.
- Technical, on-page and international SEO, analytics and ongoing optimisation.

**This is not intended to be only a brochure website.** The long-term goal is a reliable B2B acquisition and customer-management platform.

## 3. Business identity and positioning

### Current naming

- **Website/brand identity in use:** Lotus Tubes.
- **Underlying business/legal name in project material:** Lotus Impex.
- **Founder/leadership name in supplied material:** Chirag Shah.
- **Location in supplied business records:** Mumbai, Maharashtra, India.
- **Aeron:** historical brand-name proposal only. Do not use it as an adopted brand unless the owner confirms it.

The legal and commercial relationship between Lotus Impex and Lotus Tubes needs to be confirmed before publishing legal claims, invoices, contracts or formal company statements. Where appropriate, site copy may identify Lotus Tubes as the brand associated with Lotus Impex, but do not invent a corporate structure.

### Business role and credibility

Historical listings use inconsistent labels such as manufacturer, importer, trader, wholesaler, distributor and exporter. Project discussions also state that the business does not own its own factory. **The current legal/commercial supply role must be confirmed.** Until then, use accurate neutral language such as “supplier” and “product sourcing” rather than claiming factory ownership or direct manufacturing.

Never fabricate:

- An owned or operated manufacturing facility.
- Manufacturing capacity, machinery or in-house processes.
- Customer relationships, client logos, purchase orders or testimonials.
- Certifications, test reports, audits or regulatory approvals.
- Product standards or compliance.
- Stock levels, dispatch timelines or delivery guarantees.
- Product specifications, pricing or commercial terms.

Conceptual 3D or AI-generated visuals must be clearly labelled as conceptual/illustrative. Genuine supplier or manufacturing-partner footage may be used only with permission and a truthful caption. Do not create a fake factory tour to mislead buyers.

### Brand system

The later brand direction described a premium industrial aesthetic:

- Obsidian/near-black and graphite backgrounds.
- Metallic silver typography and product finishes.
- White or light neutral surfaces for legibility.
- Magenta/pink as a controlled brand accent.
- Neutral greys for secondary information.

The homepage PR used navbar background `#030810`, `banner-image.png` as the logo asset and `loader-image.png` as favicon. Verify actual assets and current branding in the repository before changing them. Use the supplied approved logo file without distorting, recreating or recolouring it unless explicitly requested.

---

## 4. Customers, industries and use cases

Primary audiences:

- Pharmaceutical and biotechnology manufacturers.
- Dairy and food-processing businesses.
- Food and beverage manufacturers.
- Breweries and beverage plants.
- Chemical and process industries.
- Water-treatment and related process plants.
- Industrial distributors, stockists and system integrators.
- EPC, engineering, maintenance and procurement teams.
- Domestic and international B2B buyers.

Buyers need accurate product configuration details, hygienic connection information, material/finish options, documentation availability and a clear route to request a quotation. Product content should make sanitary/hygienic components clearly distinguishable from ordinary industrial pipe fittings.

---

## 5. Product catalogue domain model and content rules

### Main categories

1. Stainless steel sanitary pipes and tubes.
2. Sanitary pipe fittings: bends, elbows, tees, reducers, crosses, end caps, flanges, Y-fittings and custom transitions.
3. Tri-Clamp components: ferrules, clamps and connections.
4. Hygienic gaskets and sealing components: silicone, EPDM, PTFE, FKM/Viton, NBR and compatible custom parts.
5. Manual sanitary valves: butterfly, diaphragm, ball, sampling, non-return/check and flow-control valves.
6. Pneumatic/electric sanitary valves and actuators.
7. Tank and cleaning components: spray balls, CIP accessories, cleaning nozzles, manholes and tank accessories.
8. Custom hygienic assemblies: spools, manifolds and instrument connections.

### Priority products

Give prominent catalogue and content attention to:

1. SS 316L EP Sanitary Pipe.
2. SS 304 EP Sanitary Pipe.
3. SS 316L MP Sanitary Pipe.
4. SS 304 MP Sanitary Pipe.
5. SS 316L Sanitary Pipe Fittings.
6. SS Sanitary 90° Bend.
7. SS Sanitary Equal Tee.
8. SS Sanitary Reducing Tee.
9. SS Sanitary Concentric Reducer.
10. SS Sanitary Eccentric Reducer.
11. SS Tri-Clamp Ferrule.
12. SS Tri-Clamp Clamp.
13. Silicone Tri-Clamp Gasket.
14. SS SMS Union.
15. SS Sanitary Butterfly Valve.
16. SS 316L Diaphragm Valve.
17. SS 3-Piece Ball Valve with TC End.
18. Pneumatic Sanitary Ball Valve.
19. SS Sanitary Sampling Valve.
20. SS Sanitary Spray Ball.

### Product attributes to support

Where relevant and verified for the particular SKU/product:

- Material grade (often SS 304 or SS 316L).
- Construction (welded or seamless).
- Finish (EP/electro-polished or MP/mechanically polished, as actually offered).
- Outside diameter / nominal size and connection dimensions.
- Wall thickness.
- Angle/radius for bends and branch dimensions for tees.
- Connection/end type (TC/Tri-Clamp, butt weld, SMS or other available option).
- Surface roughness only when documented.
- Applicable product standard, only when confirmed for that exact supply.
- Standard/custom length and end preparation.
- Application information.
- MTC or other documentation availability, confirmed per material/supply.
- Ready stock or procurement availability, confirmed at enquiry time.
- Quantity, delivery destination and customer notes.

Potential standards have appeared in planning notes, including ASTM A270, ASTM A269 and BS 4825. They are **not blanket company-wide claims**. Do not display compliance on any product page without evidence for that product/supply.

### Catalogue integrity

The original supplied product listing had numbered entries 1–35 and 51–100. Entries 36–50 were absent from the extracted source and need confirmation if maintaining that numbering matters. Product names and recommended specifications in the planning notes are a starting catalogue structure, not proof that every item is currently sold or available.

### Product-detail page expectations

Each product page should present a high-quality image, concise factual overview, verified specifications, use cases, documentation status, availability wording, related products and a clear enquiry form. Enquiry data should capture product, grade, dimensions, finish, quantity, unit, destination and any drawing/BOQ attachment where supported. Add a pre-filled WhatsApp enquiry path where configured.

No fixed price, minimum order, stock status, technical value, certificate or delivery promise should be made up to fill an empty field. Show “contact us to confirm” or omit unknown values.

### Product imagery and logo application

Use genuine product photographs as the source of truth. Product shape, dimensions, ports, welds, finish and construction must not be altered by retouching. Brand placement must be straight, perspective-aligned, plausible as printing/etching/marking and legible without obscuring important geometry. Historical media work discussed a batch of approximately 300–600 images; current completion is unknown.

---

## 6. Current repository and verified technology

**Repository:** `Chandan11op/lotus-tubes`  
**Default branch:** `main`  
**Visibility:** public  
**Repository metadata last observed:** updated/pushed 9 November 2026  
**Repository root package:** `package.json`  
**AI workflow document:** `docs/AI-AGENT-WORKFLOWS.md`

### Current stack verified from `main`

| Layer | Current implementation |
|---|---|
| Frontend | React 18, React DOM 18 |
| Build/dev server | Vite 5 |
| Routing | React Router DOM 7 |
| CSS | Tailwind CSS 3 + PostCSS/autoprefixer |
| Backend | Node.js ES modules + Express 4 |
| Database | MongoDB with Mongoose 8 |
| Authentication | JSON Web Tokens + bcryptjs |
| Security middleware | Helmet, CORS, express-rate-limit |
| Email service dependency | Resend 4 |
| WhatsApp | Meta WhatsApp Cloud API integration is referenced in source/docs; verify actual implementation and credentials |
| SEO rendering | Static prerender/build scripts and JSON-LD validation scripts |

The frontend uses the current React application. **Do not rewrite/migrate to Vue merely because an earlier planning note considered Vue 3.** The actual repository is the authority for current implementation. A framework migration requires a separate approved proposal with cost, risk, route/API parity, SEO and migration plan.

### Root package scripts verified

```bash
npm start                 # delegates to server:start
npm run dev               # server development mode
npm run build             # client build
npm run client:dev
npm run client:build
npm run client:preview
npm run server:dev
npm run server:start
npm run server:install
npm run client:install
npm run install:all
npm run videos:generate
npm run videos:force
```

Frontend build script (from `client/package.json`): asset audit → Vite build → prerender → schema validation. Backend package exposes `npm test`, which runs `node src/tests/productionVerification.js`.

### Server startup and API

`server/src/server.js` connects MongoDB, provisions the initial staff user, checks the product collection and seeds the catalogue if it is empty, then listens on the configured port. In production, a startup DB/provisioning error exits the process. Health route is documented in source as `/api/health`.

`server/src/app.js` applies Helmet, CORS, JSON/urlencoded body limits, static asset directories, rate limiting to `/api`, mounts API routes and central error handling. The source has an explicit CORS allow-list including the production domain, Hostinger backend domain, Vercel references and local development origins. Review this allow-list whenever domains change; do not solve CORS by allowing arbitrary production origins.

### Environment configuration

Frontend template: `client/.env.example`

- `VITE_API_BASE_URL` — configured in the example to `https://chocolate-goldfinch-515434.hostingersite.com` (without `/api`; inspect the API client to confirm whether it appends `/api`).
- `VITE_TURNSTILE_SITE_KEY` — public Cloudflare Turnstile site key.
- `VITE_WHATSAPP_NUMBER`, `VITE_PHONE_NUMBER`, `VITE_SUPPORT_EMAIL` — public contact values.
- Optional `VITE_GA_MEASUREMENT_ID` placeholder.

Backend template: `server/.env.example`

- `PORT`, `NODE_ENV`, `CLIENT_URL`.
- `MONGODB_URI`.
- `JWT_SECRET`, `JWT_EXPIRES_IN`.
- `STAFF_INIT_EMAIL`, `STAFF_INIT_PASSWORD`.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_NOTIFICATION_EMAIL`.
- `TURNSTILE_SECRET_KEY`.
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`.
- Optional `RENDER_API`, `VERCEL_API` references.

**Security:** never commit `.env` files, passwords, real API keys, MongoDB credentials, JWT secrets or provider tokens. Frontend `VITE_*` variables are public and must never contain secrets. Production JWT secret must be high entropy and at least 32 characters; source validation rejects weak/default-like secrets.

### Repository documentation and project files

- `docs/AI-AGENT-WORKFLOWS.md` — detailed four-agent operating model and gaps before activation.
- `PROJECT.md` — this project-wide context and handover.
- Continue to inspect route/controller/model code for implementation-specific contracts instead of guessing paths or schema fields.

---

## 7. Git history and merged work

Repository metadata and PR history were checked on 13 November 2026:

- PR #1, **“Redesign Lotus Tubes homepage with About and AI Team section”** — merged to `main`. Merge commit recorded in project history: `6579bbaa262e7f69b24c7db8829d7f9b091c8798`.
- PR #2, **“Add owner and AI agent profiles with workflow specification”** — now closed and merged (the older project summary incorrectly said it remained draft/open). It adds founder/agent profiles and `docs/AI-AGENT-WORKFLOWS.md`; its own description explicitly says the PR did not activate end-to-end automation.
- PR #3, title **“change”** — merged on 9 November 2026, with the AI profile feature branch as head. Its exact code changes should be inspected if investigating recent changes.

Do not assume PR metadata confirms production runtime behaviour or that all tests passed. The PR #1 and #2 descriptions noted that local client build and end-to-end checks had not been run as part of those PRs. Inspect current checks and run tests before deploying.

---

## 8. Current website design direction and constraints

### Overall visual intent

The site should look premium, modern, technically credible and suitable for international procurement teams. Use a strong hierarchy, excellent product photography, intentional whitespace, refined typography, controlled animations and responsive layouts. Avoid generic template visuals, overused gradients, clutter, gimmicky motion and slow interactions.

The historical redesign vision included cinematic transitions, product reveals, smooth scrolling, parallax and 2D/3D visuals. Later implementation decisions are more restrictive (below) and take precedence for the current production website.

### Latest recorded content/UX decisions

The later website maintenance summary records these decisions:

1. Remove the Blog completely.
2. Remove all 3D models and 360-degree rotation functionality.
3. Retain genuine product images and videos.
4. Remove 360-degree filters and floating “360° Orbit” labels.
5. Redesign Product Details with an Amazon-inspired gallery/information layout, adapted for B2B industrial products (do not copy Amazon branding/UI wholesale).
6. Redesign the homepage hero with coordinated dynamic transitions.
7. Remove the Industries dropdown and use an interactive industry showcase instead.
8. Fix horizontal overflow across the website.
9. Make search work across the catalogue and relevant product information.
10. Add a global branded loading experience across the website and CRM.
11. Fix indefinite CRM loading states, including the Customers & Directory view.
12. Preserve actual SEO requirements and verify all key assets load.

**Important reconciliation:** 360° product viewing was requested in early project discussions, but a later explicit decision removed 3D/360° features. For changes to the current site, follow the later removal decision unless the owner explicitly reopens that scope.

### Homepage structure from merged redesign

The homepage section order requested for the merged rework:

1. Hero.
2. End-to-End Fluid Handling.
3. Core Product Lines.
4. About Us & Team.
5. Immediate Availability (only verified availability; otherwise explain that it is confirmed per enquiry).
6. Industrial Applications.
7. Footer.

Other homepage instructions in the PR: remove the Material Engineering comparison and standards strip; use the requested navbar colour; retain enquiry, quotation, CRM and WhatsApp functionality; do not add an extra pre-footer CTA on the homepage. Check current code before altering layout.

### Pages / information architecture

The project brief calls for public pages/areas including:

- Home.
- About Us.
- Product catalogue and product categories.
- Individual product details.
- Industries / industrial applications.
- Quality & Documentation (only genuine evidence; request workflow if documents are not public).
- Global presence / international enquiries (when useful and properly sourced).
- AI team / virtual representatives (clearly labelled as AI).
- Contact Us.
- Request a Quote / BOQ.
- Customer login and account area.
- Protected staff CRM.

These are intended capabilities. Validate which routes are implemented and publicly reachable before describing them as live.

### Responsive and accessibility requirements

- Support current desktop, tablet and mobile breakpoints.
- No unintended horizontal scrolling at common viewport widths.
- Keyboard-accessible navigation, forms, dialogs and product galleries.
- Visible focus states and semantic headings/landmarks.
- Useful image `alt` text; decorative media should be ignored by assistive technology.
- Respect reduced-motion preferences; animation must not block content or controls.
- Ensure adequate contrast and legible text on dark and light surfaces.
- Loading, empty, error and success states must all be designed. No indefinite spinner without timeout/retry/error path.

---

## 9. SEO, indexing and analytics

SEO is a first-class requirement. Organic search is preferred as a long-term channel; no rankings or time-to-rank guarantees should be made. Early planning estimated roughly 6–12 months for meaningful organic traction, but actual results depend on market, competition, site quality and consistency.

### Technical SEO requirements

- Crawlable server/static-rendered content for important routes.
- Unique, accurate title and meta description per page.
- A single meaningful H1 and logical heading structure.
- Canonical URLs using the primary domain.
- XML sitemap containing only canonical, indexable URLs.
- Correct `robots.txt` and robots meta directives.
- Correct HTTP status codes (404 for missing content, not soft-404 pages).
- Reciprocal `hreflang` links when translated routes are truly available.
- Valid structured data matching visible page content.
- Optimised images, descriptive filenames/alt text, sensible dimensions and modern formats where supported.
- Fast response, efficient JS/CSS, lazy-load below-the-fold media and avoid layout shift.
- Strong internal linking and descriptive anchor text.
- Analytics and enquiry conversion tracking configured with real IDs and appropriate consent controls.

### Structured data rules

The latest project notes recorded Search Console/Product rich-result warnings on homepage category showcase cards because required Product rich-result properties (such as offers, review or aggregateRating) were absent. The agreed direction was:

- Do not use misleading Product rich-result markup for generic category cards.
- Use appropriate Organization, WebSite, WebPage, BreadcrumbList and ItemList markup where accurate.
- Use Product schema only on genuine individual product pages and include only factual, supported information.
- Never fabricate prices, offers, reviews, ratings or certifications just to silence a warning.

Validate structured data during the build and with current Google tools before release.

### Search Console / prior audit history

A previous Seobility homepage audit supplied in project history recorded an 89% on-page score, HTTP 200, index allowed, valid canonical and HTTPS. That was a past audit result for a tested homepage, **not a current live score or Google ranking**.

Historical Search Console issues included invalid homepage Product items and resource-loading errors for fonts, logo, facility/industry/product images, CSS, video assets and a placeholder Google Analytics measurement ID. A later Search Console discussion recorded successful fetching/indexing permission for the inspected sitemap URL, but sitemap submission and homepage indexing still needed confirmation. Re-check Search Console rather than relying on these historical states.

### SEO markets and languages

The supplied preliminary target list is:

1. India.
2. UAE.
3. Saudi Arabia.
4. USA.
5. Germany.
6. Singapore.
7. United Kingdom.
8. Australia.
9. Canada.
10. Bangladesh.
11. Vietnam.
12. Malaysia.

This is a project shortlist, **not verified market-size, search-volume or demand rankings**. Older meeting notes prioritised USA/Europe/Africa and temporarily excluded the Middle East, which conflicts with the later list containing UAE and Saudi Arabia. Confirm market strategy with the owner before campaign spending. Do not assume conflict-affected countries have higher demand without current research.

Languages discussed across project materials include English, Hindi, German, French, Spanish and Arabic. A later repository prerender script comment states 7 languages: English, German, Arabic, French, Vietnamese, Bengali and Malay. **Inspect the actual implementation and reconcile the supported-locale list** before adding language switches, hreflang or translated pages. Do not claim all planned languages are active unless they are complete and tested.

### SEO work cycle

1. Crawl/audit the actual production domain.
2. Fix crawl/indexing, canonical, sitemap, robots and rendering defects first.
3. Build keyword-to-page mapping for products, applications and approved geographies.
4. Improve product/category copy using factual product information.
5. Publish useful technical and buying-support content only when it adds value (note: the later site decision removed the Blog; do not reintroduce a blog without approval. Educational resources may be integrated into approved product/industry pages).
6. Monitor Search Console clicks, impressions, CTR, average position, indexed pages and rich-result reports.
7. Track qualified RFQ/contact conversions, not just traffic or SEO audit scores.

---

## 10. CRM and operational workflows

The CRM should be the business system of record for customer interactions and business follow-up. Public website forms, CRM, quotations and customer accounts should use the same backend and database, not disconnected mock data.

### User types and roles

Required roles in the overall brief include:

- **Super Admin:** full control of users, roles, customers, leads, products, quotations, invoices, AI tasks, approvals, integrations, reports and audit history.
- Sales Manager / sales employees: assigned leads, customer communication, RFQ qualification, quotation preparation and follow-up.
- International/export sales: overseas prospects and export enquiries, subject to role permissions.
- Accountant: invoice and billing records; accounting facts remain controlled by accounts.
- Inventory employee/manager: product data, stock/procurement confirmation and availability.
- Marketing role: approved campaigns and customer-engagement activity.
- Customer: only their own account, enquiries, quotations, invoices and conversations.

The business notes mention a team allocation of 3 sales, 4 accounting and 3 inventory staff. Treat this as a historical staffing note and confirm current staff before provisioning users.

### CRM modules requested

- Overview dashboard and KPI reports.
- Enquiry/lead management.
- Customer directory and history.
- Product/catalogue administration.
- RFQ/BOQ and quotation management.
- Invoice management.
- Order tracking (if supported by actual process/data).
- Tasks, assignments and follow-up dates.
- Email/WhatsApp conversation history.
- User accounts and role/permission management.
- AI Operations workspace and approval queue.
- Reports and employee activity.

Dashboard metrics should be calculated from actual records: total/new/assigned enquiries, pending quotations, quotations sent, follow-ups due, converted customers, confirmed orders, lost/on-hold leads, pending approvals and team activity. Do not hardcode KPI values.

### Lead status vocabulary

The original business workflow uses:

- `New`
- `Contacted`
- `Quotation Sent`
- `Follow-up`
- `Negotiation`
- `Order Confirmed`
- `Lost`
- `On Hold`

Inspect existing enums and data before changing labels or mapping historical statuses. A status migration must be backward-compatible and must not discard records.

### Customer account isolation

Customers must only see records belonging to their verified account. Do not trust client-supplied customer IDs. Enforce ownership in backend queries and authorization middleware. Guessing a MongoDB ID or reference number must not expose another customer's details. Staff access is also permission-scoped.

### Important end-to-end test path

A public enquiry/RFQ should be persisted, assigned/visible in CRM, associated with the correct customer, followed by staff action, quotation creation, approval and communication, with audit history and customer portal status. Test this from browser/client to API to database and back; opening the URLs is not sufficient.

---

## 11. AI assistant operating model

The latest maintained workflow document is `docs/AI-AGENT-WORKFLOWS.md`. It explicitly marks the operating model as an **implementation specification** and says public profile cards do not make customer-facing automation live.

### Adopted four-agent workflow in the current docs

| Agent ID | Display name | Responsibility | Planned email identifier |
|---|---|---|---|
| `ananya-quotation` | Ananya Mehta | Quotation and sales coordination | `ananyamehta@lotustubes.com` |
| `riya-invoice` | Riya Shah | Billing and invoice coordination | `riyashah@lotustubes.com` |
| `neha-enquiry` | Neha Desai | Contact Us enquiry and resolution coordination | `nehadesai@lotustubes.com` |
| `arjun-support` | Arjun Yadav | Customer support, chat and operations | `arjunyadav@lotustubes.com` |

These are virtual AI assistants, not human staff. Planned email IDs are not proof that mailboxes are provisioned or operational.

### Ananya — quotation workflow

1. Receive authenticated customer RFQ/BOQ or staff-assigned enquiry.
2. Link to the true customer, enquiry, product and requested specifications.
3. Identify missing prices, dimensions, taxes, freight, lead time, validity, payment terms and product data.
4. Route missing facts to authorised sales/inventory staff.
5. Prepare a draft from completed, verified quotation data.
6. Submit the exact document/version and recipient/channel for Super Admin approval.
7. Send only after approval; record provider response and delivery state.

Never invent price, tax, quantity, product dimensions, standard, stock, delivery promise or commercial terms.

### Riya — invoice workflow

1. Retrieve an invoice record created/finalised by accounts.
2. Verify customer, order reference, invoice number, amount, currency, document version and recipient.
3. Present the exact document for Super Admin approval (unless a separately approved policy explicitly changes this control).
4. Deliver through configured channels only after approval.
5. Record provider message IDs, timestamps and actual delivery/failure states.

Riya must not invent or alter accounting values, tax, payment status or invoice details. Quotation and invoice are separate document types; do not treat a quote as an invoice.

### Neha — Contact Us workflow

1. Save Contact Us form data as a CRM contact/enquiry/ticket with unique reference.
2. Link to a customer only when identity is verified.
3. Categorise and assign to the correct staff member/team.
4. Capture the staff answer as a draft.
5. Super Admin reviews/edits/approves the exact response and recipient.
6. Send and log provider response; Neha may issue a configured receipt acknowledgement/reference where approved.

### Arjun — chat and customer support

1. Identify customer via authenticated account session where possible.
2. Verify ownership before looking up a quotation, invoice or enquiry.
3. Retrieve current records; request missing status from staff/agent queue.
4. Draft a response referencing source records.
5. Submit exact reply for Super Admin review.
6. Send only the approved reply and log outcome.

Approved holding response from the workflow spec:

> Thank you for your patience. I’m checking the latest status of your request with our team. I’ll get back to you shortly.

Never disclose other customers' data, infer payment/dispatch, promise a timeline, or claim delivery without a confirmed provider status.

### Mandatory approval gate

This is a non-negotiable project rule for customer-facing quotations, invoice dispatch, staff responses prepared through Neha and Arjun chat/status replies:

- No unapproved AI-generated financial document or customer-facing answer may be sent.
- Approval is by an authorised Super Admin, not an AI agent.
- Approval attaches to an immutable content/document version, exact recipient, channel and business record.
- Any post-approval edit invalidates approval and requires re-approval.
- The backend must enforce permission/state at dispatch time; hiding frontend buttons is not security.
- Use idempotency keys and persist provider message IDs to avoid duplicate sends.
- Keep an audit trail: draft creator, changes, approver, timestamp, content hash/version, recipient, channel, provider response and delivery state.
- Distinguish `draft`, `pending_approval`, `approved`, `dispatching`, `sent/provider_accepted`, `delivered` (only when confirmed), `failed`, `rejected`, `changes_requested` and `cancelled` according to actual integration semantics.

### Existing gaps called out in the workflow spec

The `docs/AI-AGENT-WORKFLOWS.md` file identifies these requirements before activation:

1. Replace the legacy seven-agent registry with the four named operational agents while retaining compatibility for historical tasks.
2. Refactor legacy quotation automation containing fallback catalogue selection, estimated prices and default technical/commercial values.
3. Add a first-class Invoice model and accounting workflow.
4. Add customer conversation/message persistence and chat APIs with ownership checks, moderation and rate limits.
5. Add task types and approval endpoints for invoice delivery, enquiry responses and chat replies.
6. Add backend dispatch workers for approved documents/messages using real Resend and Meta WhatsApp providers.
7. Add AI Operations review UI, audit records and automated security tests.
8. Provision and verify mailboxes, Resend sender/domain configuration, Meta WhatsApp credentials and approved templates.

**Important legacy conflict:** the current production-verification test source still expects a seven-agent registry with IDs such as `dom-sales-1`, `intl-sales-1` and `mktg-comm-1`, while the adopted profile/workflow spec defines four agents. Do not blindly change the test to pass or silently restore seven profiles. Reconcile the backend registry, UI, old task records, tests and approved product requirement. Preserve history and record the agreed migration.

### Earlier seven-assistant concept

An earlier concept listed seven bots: Aarav, Meera, Kabir (domestic sales); Elena and Adrian (international sales); Nova and Orion (marketing/market intelligence). This is historical, not the current four-agent specification. Do not implement both models at once. If the business owner revisits it, treat it as a deliberate scope change with roles, permissions and migration plan.

---

## 12. Email, WhatsApp and external integrations

### Email

The repository has Resend as a dependency and configuration for API key, sender and notification email. Planned workflows include internal notifications, customer acknowledgements, approved quotations/invoices, customer service responses and alerts. Confirm sender domain verification and production credentials. Mailbox names listed for AI profiles remain planned identities until provisioned and tested.

### WhatsApp

The project plans Meta WhatsApp Business Cloud API for inbound enquiry capture, customer conversations, product enquiry, approved quotation/invoice delivery, status updates, follow-ups and delivery webhooks. Do not use a simulated success response. Configure valid Meta Business credentials, business phone number ID, templates and consent rules. Record inbound/outbound events against the correct CRM customer/enquiry.

### Integration reliability

- Missing credentials must produce visible configuration errors, not false success.
- Provider acceptance is not necessarily delivery; represent each status accurately.
- Persist provider reference IDs and error details safely.
- Add retry/backoff and idempotency where appropriate.
- Never log secrets or full sensitive payloads.
- Respect customer consent, opt-out and applicable provider terms/policies.

---

## 13. Deployment, domains and environment connection

### Known URLs

- Production frontend / preferred canonical: `https://lotustubes.com/`.
- Backend host previously supplied: `https://chocolate-goldfinch-515434.hostingersite.com/`.
- Historical Vercel frontend: `https://lotus-tubes-react-design.vercel.app/`.
- Historical Render API reference in server config: `https://lotus-tubes.onrender.com`.

The current repository `.env.example` points the frontend API base URL to the Hostinger hostname and backend CORS includes `lotustubes.com`, `www.lotustubes.com` and the Hostinger hostname. This indicates intended configuration, not proof that all production requests work today.

### Required integration checks

1. Open backend root and `/api/health` (confirm exact health response contract).
2. Confirm MongoDB connection and production database environment.
3. Confirm frontend production bundle uses the intended API base URL and correct `/api` prefix.
4. Check browser network requests from `https://lotustubes.com` for CORS, TLS, 4xx/5xx and mixed-content failures.
5. Submit a test enquiry/RFQ and confirm it is persisted in MongoDB and visible in CRM.
6. Test customer registration/login and staff login separately.
7. Confirm customer record isolation and role permissions.
8. Check email/WhatsApp provider test sends only with explicit approval and test recipients.
9. Check deployment logs, memory/CPU limits, backups and health monitoring.
10. Verify DNS, HTTPS, canonical and redirect behaviour for `www` vs apex domain.

Do not say frontend and backend are connected merely because both URLs load.

---

## 14. QA and release checklist

### Before every pull request

- [ ] Inspect existing implementation and confirm scope.
- [ ] No hardcoded secrets, fake business facts, fake metrics or mock production data.
- [ ] Validate desktop/tablet/mobile layouts; no horizontal overflow.
- [ ] Check keyboard focus, accessible labels, heading order and reduced-motion behaviour.
- [ ] Check loading, empty, error, retry and success states.
- [ ] Verify all buttons, links, search, forms and navigation perform their named action.
- [ ] Product image/media failures have a graceful fallback.
- [ ] SEO title, description, canonical, robots and structured data are correct for changed routes.
- [ ] API validation, authorization, error handling and rate limits are preserved.
- [ ] Add/update tests for the changed behaviour.
- [ ] Update focused documentation and this file when system direction changes.

### Suggested commands

Run from repo root after dependencies are installed:

```bash
npm run install:all
npm run build
npm --prefix server test
```

Also run the relevant client preview and manual/browser end-to-end tests. Backend tests may require a valid test MongoDB, environment variables and test staff credentials. Do not run tests against production unless specifically designed and approved; the current production verification test source creates and cleans up database records and expects configured data/services.

### Security cases to test

- Unauthenticated API access.
- Customer A attempting to access Customer B's records.
- Public role escalation to staff/admin.
- Employee attempting Super Admin-only approval.
- Dispatch of unapproved quote/invoice/reply.
- Edit after approval and stale approval reuse.
- Duplicate dispatch on retries.
- Missing/invalid provider credentials.
- Provider failure vs accepted vs delivered state.
- Rate limiting, form spam, XSS payloads and unsafe file uploads.

---

## 15. Roadmap and priority order

The following sequence balances user-facing quality with operational reliability. Reassess against actual current code before planning implementation.

### P0 — Production stability and truthfulness

- Inspect production deployment and repository state.
- Verify frontend/backend/MongoDB connectivity.
- Verify contact/RFQ forms persist in CRM.
- Fix broken assets, console/network errors and indefinite loading states.
- Verify customer/employee login, authorization and record isolation.
- Remove invented product/commercial data and false capability claims.

### P1 — Website UX and catalogue

- Finalise current visual design system and responsive layout.
- Rework homepage hero and interactive industry showcase.
- Complete catalogue-wide search and filtering.
- Product detail gallery/information layout.
- Remove legacy blog and 3D/360° features per latest recorded decision.
- Consistent branded loader and robust empty/error states.

### P2 — CRM foundation

- Lead/enquiry capture, ownership, assignments and history.
- Customer directory and role-based access.
- Product administration with verified product data.
- Formal quotation creation and lifecycle.
- Invoice records and accounting ownership.
- Tasks/follow-ups and reports.

### P3 — Governance and four AI workflows

- Resolve the four-vs-seven-agent registry conflict.
- Implement Super Admin approval state machine and audit log.
- Remove unsafe quote fallback logic.
- Add invoice data model/workflow.
- Add Neha enquiry assignment/reply workflow.
- Add Arjun customer chat storage, identity and status lookup.
- Add exact-version approvals and safe dispatch workers.

### P4 — Communication integrations

- Provision email identities and verify Resend sender/domain.
- Complete Meta WhatsApp Business setup, templates and webhooks.
- Customer consent and communication preference handling.
- Delivery status callbacks, retry and idempotency.

### P5 — SEO and international growth

- Technical SEO crawl and Search Console validation.
- Keyword/page map and factual product content.
- Confirm target markets and languages.
- Localised product/category pages and correct hreflang.
- Analytics and qualified lead conversion tracking.
- Competitor and search-demand research before campaign budget commitments.

### P6 — Media and brand operations

- Product photo/video inventory and quality checks.
- Correct product branding on approved images.
- Supplier/partner footage with permissions and accurate labels.
- Social media plan (LinkedIn/Instagram) if separately approved and resourced.

---

## 16. Open questions and owner confirmations

Do not guess these. Record decisions as they are confirmed:

1. Exact legal entity name and how Lotus Impex and Lotus Tubes should appear in legal/footer/schema documents.
2. Current supplier role (trader/distributor/stockist/importer/exporter/manufacturer) and whether any partner manufacturing relationship may be described.
3. Current official postal address, telephone, email, GST/IEC and public contact data; older directory records may be stale.
4. Verified product list, sizes, grades, finishes, standards, MTCs, stock, procurement process, prices and delivery commitments.
5. Current status of approved logo, current product images and completion of bulk product branding.
6. Current production host, frontend API URL, MongoDB environment and deployment pipeline.
7. Current live website page/feature status, including whether old domain redirects and canonical settings are correct.
8. Four-agent vs seven-agent operating model; the current detailed workflow doc says four, but existing verification test code still expects seven.
9. Whether the four AI email addresses have been provisioned and verified.
10. Whether Meta WhatsApp Business credentials, approved templates and webhooks are configured.
11. Whether the CRM invoice model, customer chat and Super Admin approval inbox are implemented and tested.
12. Final priority markets: the initial “exclude Middle East / include Africa” discussion conflicts with the later country shortlist including UAE and Saudi Arabia.
13. Supported production languages: source notes mention different locale sets; inspect code and confirm translation quality.
14. Whether Blog and 3D/360° features remain removed (latest recorded decision: yes, removed).
15. Product photography/social media/SEO budgets and scope, if work is to be commercialised separately.

---

## 17. Rules for AI coding agents and other assistants

Every AI tool working in this repository must follow these rules:

1. **Inspect before editing.** Do not create a new architecture from assumptions; inspect actual files and reuse established patterns.
2. **Respect the current stack.** Use React/Vite on the frontend and Express/MongoDB on the backend unless the owner explicitly approves a migration.
3. **Do not silently broaden scope.** Do not add a blog, 3D/360° viewer, seven-agent model, language set, payment flow or ecommerce checkout without explicit approval.
4. **Do not fabricate business information.** Missing facts remain missing; mark them for staff confirmation.
5. **Protect financial operations.** AI can prepare drafts, not invent or finalise prices, taxes, invoices or payment status. Super Admin approval is mandatory for covered external communications.
6. **Enforce rules server-side.** Frontend hiding/disabled buttons do not replace backend authorization.
7. **Protect customer data.** Always enforce record ownership and role permissions in backend queries.
8. **Preserve backwards compatibility.** Do not delete or orphan historical CRM, lead, task, quote or customer records during model changes.
9. **Keep external integrations honest.** Never fake email/WhatsApp delivery or claim success when credentials/provider response are absent.
10. **Keep secrets out of source control and frontend code.** Use documented environment variables and `.env.example` placeholders only.
11. **Maintain SEO.** Changes to routes, titles, rendering, canonical tags, sitemap, hreflang and JSON-LD require explicit review.
12. **Build for responsive and accessible use.** Respect reduced motion and ensure core interactions work without hover.
13. **Test the complete data path.** Form → API → DB → CRM → staff action → approval → provider → customer view/status.
14. **Do not deploy or merge destructively without authority.** Use feature branches/PRs and request review where appropriate.
15. **Report evidence.** In the completion summary list changed files, commands/tests run, actual results, outstanding risks and any required credentials/owner decisions.
16. **Update documentation.** Keep `PROJECT.md` and focused docs aligned with implementation; date significant status updates.

### Recommended AI task brief format

When another AI is asked to change the project, give it a task containing:

- Goal and user impact.
- Exact page/module/workflow.
- Current observed behaviour and expected behaviour.
- Constraints from this document.
- Files/components/API contracts it should inspect.
- Acceptance criteria and tests.
- Whether code-only, PR, deployment or production release is authorised.

AI must ask one concise clarification only when an unresolved owner decision blocks safe implementation. Otherwise make a conservative best effort, documenting assumptions and leaving risky production behaviour disabled.

---

## 18. Key project links

- Website: https://lotustubes.com/
- GitHub: https://github.com/Chandan11op/lotus-tubes
- AI workflow specification: https://github.com/Chandan11op/lotus-tubes/blob/main/docs/AI-AGENT-WORKFLOWS.md
- Historical frontend deployment: https://lotus-tubes-react-design.vercel.app/
- Backend host previously supplied: https://chocolate-goldfinch-515434.hostingersite.com/
- Homepage redesign PR #1: https://github.com/Chandan11op/lotus-tubes/pull/1
- AI profiles/workflows PR #2: https://github.com/Chandan11op/lotus-tubes/pull/2
- Follow-up PR #3: https://github.com/Chandan11op/lotus-tubes/pull/3

---

## 19. Change log

| Date | Update |
|---|---|
| 13 Nov 2026 | Consolidated project handover against uploaded project history, `main` branch package/config files, AI workflow doc and PR history. Recorded current React/Express stack, merged PR status, latest SEO/UX decisions and unresolved four-vs-seven-agent mismatch. |
| 13 Nov 2026 | Implemented the Obsidian Precision Engineering UI/UX redesign referenced from Figma prototype (Node 12-767). Modernized global typography (Space Grotesk, Geist, JetBrains Mono), glassmorphic shell (TopBar, Navbar, Footer, MobileDrawer, Breadcrumbs, Modals), and full 9-section HomeView transformation with live category switcher, real-time catalogue search/filtering, interactive sector showcase, Founder & 4-Agent fleet, inventory telemetry, and embedded BOQ quotation engine. Full client build passed (322 prerendered routes across 7 languages, 0 asset errors, 100% valid JSON-LD schemas) and backend production verification suite passed (14/14 tests). |
| 13 Nov 2026 | Completed comprehensive UI/UX redesign incorporating all forwarded client notes: (1) Deep Navy (#071A52), Electric Blue (#2D8CFF), Stainless Silver, White, and Minimal Magenta (#FF007A) CTA buttons; (2) Alternating backgrounds (White ↓ Light Grey #F7F8FA ↓ Transparent Electric Blue ↓ White); (3) Scroll-linked hero valve rotation & subtle blue light reflection; (4) Instant live product search with autocomplete chips (SMS Union, Tri Clamp, Butterfly Valve, Ferrule, EP Tube); (5) Animated upward-counting statistics (1000+ Variants, 100+ Countries, 30+ Years, 24x7 Support); (6) "Netflix-style" large horizontal category cards (Valves, Tubes, Tri-Clamp, Cleaning); (7) Floating glass product cards with hover lift, blue glow (0 20px 45px rgba(45,140,255,0.22)), and sliding spec drawer; (8) Interactive industry showcase with dynamic atmospheric themes (Pharma, Dairy, Brewery, Biotech, Chemical); (9) "Trusted Worldwide" certifications on premium glass cards (ISO, FDA, 3-A, CE, ASME BPE, EN 10204 3.1); (10) "Why Lotus?" milestone story timeline (1989 ↓ 1998 ↓ 2008 ↓ 2026); (11) Deep Navy footer with world map texture, embedded RFQ, WhatsApp desk & newsletter. Full client build passed (0 missing assets, 191 verified media files, 322 prerendered HTML routes across 7 languages, 100% valid JSON-LD) and server test suite passed (14/14 tests). |

**End of project context.** Always re-check the live repository and production environment before treating any status in this document as current implementation truth.
