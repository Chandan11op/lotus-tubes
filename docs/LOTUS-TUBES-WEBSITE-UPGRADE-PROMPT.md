# MASTER IMPLEMENTATION PROMPT — LOTUS TUBES WEBSITE AUDIT, BUG FIXES & FIGMA-ALIGNED REDESIGN

**Project:** Lotus Tubes  
**Repository:** https://github.com/Chandan11op/lotus-tubes  
**Production website:** https://lotustubes.com/  
**Design reference (Figma prototype):** https://www.figma.com/proto/7Hguyhs0CvThMwz6gWVuJg/Lotus-Impex-website?node-id=12-767&t=aDy64M3GQw5amXgB-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=11%3A3  
**Figma reference node:** `12:767`  
**Prototype starting point:** `11:3`  
**Primary admin login email to diagnose:** `sales@lotustubes.com`  
**Date of this brief:** 13 November 2026

---

## 0. Your role and mission

Act as a **senior full-stack engineer, senior UI/UX designer, QA engineer, accessibility reviewer, security engineer and production-readiness specialist** working on the existing Lotus Tubes application.

Your task is to conduct a complete, evidence-based audit of the current website and codebase, identify the actual causes of the reported problems, redesign the specified sections to match the supplied Figma prototype, repair the staff workspace authentication issue, and verify the complete result across desktop, tablet and mobile.

Do not merely write recommendations or change CSS until the page looks different. Implement and test the necessary fixes in the existing application.

The desired outcome is a premium, trustworthy, responsive B2B industrial website for stainless-steel sanitary pipes, tubes, fittings, clamps, gaskets and hygienic valves. It must look visually polished while continuing to function as a real catalogue and enquiry platform connected to the existing backend and CRM.

**Important:** Work from the current repository, not from assumptions or an imagined rewrite. The existing website, backend, product catalogue, enquiry journeys, customer accounts and CRM must remain functional.

---

## 1. Mandatory project-context review before editing

Read these project documents first:

1. `PROJECT.md` — full project context, current architecture, constraints, business rules, deployment notes and open decisions.
2. `docs/AI-AGENT-WORKFLOWS.md` — the four-agent operating model, Super Admin approval rules and implementation gaps.
3. `README.md`, if present, plus the root, `client/` and `server/` package manifests and environment templates.

Then inspect the current `main` branch and trace the affected components, CSS, route handling, API client, backend authentication controller, Mongoose User model, database configuration, and staff provisioning code.

### Confirmed repository architecture

The repository currently uses:

- React 18 and React DOM 18.
- Vite 5.
- React Router DOM 7.
- Tailwind CSS 3 and the existing global stylesheet.
- Node.js ES modules and Express 4.
- MongoDB with Mongoose 8.
- JWT authentication and bcryptjs password hashing.
- Helmet, CORS and express-rate-limit.
- Resend integration/configuration for email.
- A Meta WhatsApp integration/configuration path that must be verified against real credentials and provider behaviour.

**Do not migrate the application to Vue, Next.js, WordPress or another framework.** Earlier planning discussed alternative stacks, but the current production repository is React/Vite + Express/MongoDB. Keep this architecture unless the owner separately approves a migration.

### Source files already identified as relevant

Start by examining these files and their imports/call sites; inspect additional files when the implementation requires it:

- `client/src/pages/HomeView.jsx`
- `client/src/pages/IndustriesView.jsx`
- `client/src/pages/ProductsView.jsx`
- `client/src/pages/ProductDetailView.jsx`
- `client/src/components/common/ProductCard.jsx`
- `client/src/components/common/FloatingWhatsApp.jsx`
- `client/src/components/chat/ChatWithUs.jsx`
- `client/src/pages/crm/CRMView.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/services/api.js`
- `client/src/data/siteData.js`
- `client/src/index.css`
- `client/src/App.jsx`
- `server/src/config/env.js`
- `server/src/scripts/provisionStaff.js`
- `server/src/controllers/authController.js`
- `server/src/models/User.js`
- `server/src/config/db.js`
- `server/src/routes/apiRoutes.js`
- `server/src/tests/productionVerification.js`

Inspect the actual repository before assuming every path or behaviour exists. Preserve established component and service patterns.

---

## 2. Design source of truth — Figma prototype

The supplied Figma prototype is the visual source of truth for the redesign:

https://www.figma.com/proto/7Hguyhs0CvThMwz6gWVuJg/Lotus-Impex-website?node-id=12-767&t=aDy64M3GQw5amXgB-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=11%3A3

Before implementing the redesign:

1. Open the prototype and inspect its relevant desktop and mobile flows/frames.
2. Record the design's actual colour palette, typography, page width, grid, section spacing, header treatment, card shapes, image treatment, borders, button styles, hover states and interaction patterns.
3. Inspect the complete page hierarchy rather than copying one screenshot or one frame.
4. Identify the exact visual treatment for the product catalogue, product cards, product-detail gallery, industries section and floating contact controls.
5. Reuse the existing Lotus Tubes brand mark and approved assets. Do not recreate or distort the logo.
6. Translate the design into reusable React components and project-level CSS/design tokens. Do not paste Figma absolute-positioned prototype code as the production implementation.
7. Preserve real functionality: navigation, search, RFQ, contact forms, login, responsive menus and CRM routes must remain interactive.

**Access rule:** If the prototype cannot be opened because of Figma sharing permissions, do not invent what it looks like and do not claim Figma parity. Record the access blocker and request that the project owner enable prototype viewing for the agent or provide desktop/mobile frame exports. Continue the source-code and functional audit that does not depend on the inaccessible visual details. Once the design is accessible, complete the Figma comparison before final visual sign-off.

### Visual direction

Follow the Figma design exactly where it provides direction. Where a design detail is not specified, use the approved Lotus Tubes industrial identity already documented in `PROJECT.md`: deep obsidian/near-black and graphite, stainless/metallic silver, white or neutral-grey surfaces, and restrained magenta/pink accents. Prioritise contrast, clarity and premium industrial presentation over decorative effects.

Avoid generic blue-gradient template styling, excessive glassmorphism, random gradients, oversized rounded cards, arbitrary animations, emoji icons and decorative elements that weaken the industrial identity.

---

## 3. First perform a complete audit — do not edit blindly

Before changing files, create a short audit report in `docs/` (for example `docs/WEBSITE-AUDIT-2026-11-13.md`) containing:

- Page/route inventory.
- Relevant components and CSS entry points.
- Reported defect, observed source-code behaviour, likely root cause and evidence.
- Design differences compared with the Figma reference (only after the prototype is accessible).
- Functional regressions or data-integrity risks discovered during the audit.
- A sequenced implementation plan.

Inspect all primary public routes and CRM entry points, including:

- `/` (homepage)
- `/products`
- product category routes
- individual `/product/:slug` pages
- `/industries` and industry detail routes, if supported
- `/about`
- `/quality`
- `/resources`
- `/contact`
- `/quote`
- customer login/account routes
- staff workspace / CRM routes

Audit desktop, tablet and mobile layouts. Look for broken images, missing fonts, console errors, failed network requests, invalid routes, unresponsive buttons, stuck loaders, overflow, unreadable text, broken forms and inconsistent backgrounds.

Do not report an issue as fixed merely because a component was edited. Verify the user journey in the browser and, where applicable, through the API/database.

---

## 4. Homepage cleanup — remove non-working sections

The owner has explicitly requested that the following homepage sections be removed because they are not working and should not remain as filler:

### 4.1 Remove the Fluid Products / End-to-End Fluid Handling section

In the current source this appears to be the `HomeView.jsx` section named **End-to-End Fluid Handling**, implemented with the `section-aseptic-flow` / `flow-pipeline-grid` / `flow-step-card` classes and the Carry, Connect and Control cards.

Remove this complete homepage section, including section-only decorative elements and CSS that becomes genuinely unused. Do not remove the actual product categories, product catalogue routes or individual product pages. The catalogue remains the primary place to discover products.

### 4.2 Remove the Immediate Stock / Immediate Availability section

In the current source this appears as the `HomeView.jsx` **Immediate Availability** section (`section-facility`, `facility-grid`, `facility-media`, `facility-content`). Remove the complete homepage block and its calls to action.

Do not leave a blank gap, empty wrapper, orphaned divider or leftover background band. Rebalance the spacing between the remaining homepage sections.

Do not replace it with another stock claim. Actual availability must be confirmed per product/enquiry and must never be fabricated.

### 4.3 Remove the AI Fleet promotional section from the homepage

Remove the AI Fleet / AI team promotional card grid from the homepage if this is the current section represented by `AI_TEAM_MEMBERS`, `lt-team-2x2-grid` and the AI representative cards.

Preserve the genuine About Us introduction and founder/leadership profile if those elements remain part of the approved Figma layout. Keep the backend agent registry, CRM AI Operations capability and `docs/AI-AGENT-WORKFLOWS.md` intact. This request is to remove the non-working homepage promotion, **not** to delete backend agent records, CRM workflows or approval rules.

Do not leave misleading profile email links or present virtual agents as human employees elsewhere.

### 4.4 Homepage final structure

After removing the three blocks, recompose the homepage according to the Figma prototype. The remaining sections must connect naturally and the page should not feel like three missing chunks were simply deleted.

Keep the homepage focused on:

- A strong hero/value proposition.
- Clear product catalogue entry points.
- A credible company/founder introduction where shown in Figma.
- A redesigned industrial applications section.
- Clear enquiry/quotation/contact actions.
- A polished footer.

Do not add new filler sections, invented statistics, fake manufacturing claims or duplicate calls to action.

---

## 5. Redesign the Industries experience from scratch

The current Industries experience is not acceptable. Redesign **both**:

1. The industries/application showcase on the homepage (`HomeView.jsx`).
2. The dedicated `/industries` experience (`IndustriesView.jsx`).

Do not merely change card colours or image sizes. Rework the composition, hierarchy, image selection, information density, interactions and responsive behaviour to match the Figma reference.

### 5.1 Homepage industries showcase

Create a visually strong, premium section that makes it immediately clear which industries Lotus Tubes supports and why sanitary components are relevant to each one.

Use the actual industries that the business supports, such as:

- Pharmaceutical.
- Biotechnology.
- Dairy processing.
- Food processing.
- Food and beverage.
- Breweries.
- Chemical processing.
- Water treatment.

The exact visible set and order should match the Figma design and verified project content. Avoid duplicate or near-duplicate cards for food processing versus food and beverage unless there is a meaningful difference in the content.

Each industry entry should have:

- A relevant, genuine, correctly matched image.
- A concise industry title.
- A short factual description of the sanitary process context.
- A small number of relevant product-category links or product examples, only when grounded in the current catalogue.
- A meaningful click target that opens that industry or selected detail, not a group of cards that all blindly navigate to the same generic page without preserving context.

Use consistent image aspect ratios, intentional cropping, readable overlays and strong spacing. Images must not be distorted or reused for unrelated industries merely to fill a grid.

### 5.2 Dedicated Industries page

Rebuild the `/industries` page as a deliberate, premium industry experience. Use the Figma prototype as the design target.

The current implementation uses a complex desktop pinned-scroll/scroll-driven sequence and a mobile tabbed mode. Replace this if it conflicts with the reference or causes a poor experience. Do not use scroll hijacking, sticky traps, forced autoplay or navigation that prevents normal page scrolling.

A suitable interaction pattern may be a clear tabbed/segmented industry selector with one active detail panel, or a well-composed responsive industry grid that opens meaningful detail. Choose the structure that best matches Figma. The result must support:

- A clear page introduction.
- Distinct industry selection/navigation.
- A relevant image and concise content for the selected industry.
- Realistic process/application context.
- Related sanitary product categories and enquiry actions.
- A clear route back to the catalogue or quotation form.
- Stable URL/slug behaviour if the current router supports industry slugs.

### 5.3 Interaction and accessibility requirements

- Desktop: mouse, keyboard and visible focus states all work.
- Mobile: touch-friendly controls; no hover-dependent content.
- Tablet: layout adapts naturally without clipped cards or text.
- Honour `prefers-reduced-motion`.
- No forced scroll locking or pinned scroll stage that traps the user.
- The selected industry must remain understandable without animation.
- Direct links/deep links to supported industry slugs must select the correct industry.

### 5.4 Business accuracy

Do not claim that Lotus Tubes owns a factory, manufactures every item, holds a particular certification or has supplied specific customer projects unless the owner has verified the claim and evidence is in the repository. Avoid invented customer logos, case studies, compliance seals and performance metrics.

---

## 6. Correct the WhatsApp logo and floating contact controls

The user reports that the WhatsApp logo shown around the floating contact/chat control is not the real WhatsApp logo.

The current repository has two separate controls:

- `FloatingWhatsApp.jsx`: a floating WhatsApp Business link containing a custom hand-written SVG path.
- `ChatWithUs.jsx`: the Arjun customer-support chat launcher, currently displaying the Arjun profile photo and “Chat with Us” text.

`App.jsx` mounts both components. Inspect the actual rendered screen and distinguish these controls correctly.

### Required fix

1. Replace the inaccurate/custom WhatsApp drawing with the genuine WhatsApp brand mark from a trusted, locally bundled official/approved vector asset or a verified icon package that is already installed/approved for this project.
2. Do not use a generic speech bubble, telephone symbol, emoji, approximate hand-drawn path or a copied low-quality raster logo.
3. Keep the brand mark crisp at all supported sizes, with correct proportions, transparent background and no distortion.
4. Keep the WhatsApp Business shortcut clearly distinct from the website’s “Chat with Us” assistant. The ChatWithUs control may use the approved Arjun portrait and should not pretend to be WhatsApp.
5. Verify that the WhatsApp link uses the configured business number, opens `wa.me` correctly, contains a sensible pre-filled message, and opens in a new tab safely with `rel="noopener noreferrer"`.
6. Verify stacking order, fixed positioning, safe-area spacing, responsive placement and absence of overlap with the ChatWithUs launcher, cookie notices, mobile navigation or enquiry dialogs.
7. Give each control an accurate accessible name and a visible focus state.

Do not change the business phone number based on guesses. Verify the intended WhatsApp number against the current approved `CONFIG` / owner-provided business contact details.

---

## 7. Redesign product catalogue and product-detail backgrounds

The product backgrounds currently look generic and visually disconnected from the premium industrial brand. The owner specifically reports that the backgrounds seen when opening products from search results and when browsing normally are not satisfactory.

Redesign the backgrounds and surfaces across the complete product discovery journey, not just one isolated image box.

### Components and surfaces to inspect

- Product catalogue page and its `PageHero`.
- Search result grid.
- `ProductCard` cards and media stages.
- Desktop filter sidebar and mobile filter drawer.
- Search input and active-filter chips.
- Empty/no-results state.
- Individual Product Detail page.
- Product thumbnail gallery.
- Main product image stage.
- Product video area (where actual approved videos exist).
- Product title/specification area.
- Technical specification panels and tabs.
- Related-products cards.
- Enquiry and quote call-to-action surfaces.

### Design requirements

1. Rebuild the visual treatment to match the Figma reference.
2. Create a consistent product-surface design system using reusable CSS variables/tokens and a controlled palette.
3. The product image stage must feel intentional and premium: appropriate neutral/graphite or light studio background according to Figma, subtle separation from the page, balanced contrast, and clean edges.
4. Use `object-fit: contain` for isolated product photography when that preserves the entire component; use `cover` only for contextual photography where cropping is intended.
5. Never stretch, squash, tint, recolour or distort the actual stainless-steel product image.
6. Improve card spacing, title hierarchy, badge density, specification grouping, borders, radius and shadows. Avoid excessive chips and floating labels.
7. Keep body text legible and ensure product information has a stable layout across different title lengths and image dimensions.
8. Search results and direct product-page navigation must use the same design system. The user should not see an abrupt background/style change after clicking a result.
9. Keep mobile thumbnails usable, swipeable where appropriate and visually consistent.
10. Ensure loading, image-error, empty and fallback states use the same design language.

Do not solve this by applying a global dark background to every child. Use hierarchy: page background, card surface, image stage, specification panel and interactive controls should have deliberate contrast and distinct roles.

### Remove obsolete 360-degree UI

The latest recorded Lotus Tubes website direction removed 3D product models and 360-degree rotation functionality. Keep that decision unless the owner explicitly reopens it.

Remove obsolete 360-degree UI and references from the current customer-facing website, including:

- 360-degree thumbnail/action controls.
- “360° Video” or “Interactive 360° View” badges.
- 360° query parameter behaviour and floating labels.
- Product-card 360° links and associated tooltip text.
- The 360° viewer component/import from product detail where no longer needed.
- Dead styles, assets and routes only after confirming they are not referenced elsewhere.

Preserve real, normal product showcase videos when valid and approved. Do not remove genuine product videos simply because they are not 360-degree assets.

---

## 8. Critical product-data integrity fixes discovered during source inspection

The source contains fallbacks that can display values as though they are confirmed product facts even when the product record is missing the data. This must be corrected as part of the website bug audit.

Examples observed in current source include:

- `ProductCard.jsx`: default material text such as `SS 316L / 304` when material is missing.
- `ProductCard.jsx`: default standards such as `ASME BPE / 3-A / ASTM A270`.
- `ProductCard.jsx`: default sizes such as `1/2" to 4" OD (Standard Stock)`.
- `ProductDetailView.jsx`: fallback availability text such as `Ready Stock in Mumbai`.
- `ProductDetailView.jsx`: fallback roughness, construction, size range, wall thickness, connection and MTC values.
- Product catalogue hero statistics and descriptions that refer to ready stock, roughness, MTC traceability or dispatch timelines.
- Fallback badges/labels that imply certification or compliance without per-product evidence.

### Required policy

For every product field:

1. Show the value only when it exists in the actual product record and has been verified for that product/supply.
2. If the value is not known, show a neutral message such as “Confirm specification on enquiry” or omit the field.
3. Never replace missing fields with plausible-looking technical values.
4. Distinguish a possible material grade from a confirmed offered grade.
5. Distinguish “supplier can source” from “currently in stock”.
6. Display applicable standards only when they are verified for that exact product.
7. Display MTC/document availability only when confirmed for the specific supply.
8. Do not fabricate prices, minimum order quantities, roughness values, wall thickness, dimensions, certificates, dispatch promises or customer references.

Ensure this data policy applies consistently to homepage cards, search results, category pages, product detail pages, structured data, SEO text, quote forms and CRM-generated content.

---

## 9. Repair Staff Workspace / Super Admin login

The staff workspace currently rejects the administrator credentials supplied by the project owner. Diagnose and repair the underlying issue in the actual production configuration. Do not hardcode credentials or simply change the frontend error message.

**Login email to verify:** `sales@lotustubes.com`  
**Password:** the owner supplied a temporary password separately. Treat it as sensitive. Do not copy it into source files, prompts, logs, screenshots, tests, GitHub commits, documentation or chat output.

### 9.1 Current source-code findings that must be investigated

The repository currently contains a likely configuration mismatch:

- `server/src/config/env.js` defaults `STAFF_INIT_EMAIL` to `chirag@lotustubes.com` when the environment variable is not set.
- `server/src/scripts/provisionStaff.js` has a fallback to `sales@lotustubes.com`, but because `config.staffInitEmail` is already populated by the `env.js` default, that fallback is not normally used.
- When the configured admin account already exists, `provisionStaffUser()` promotes its role/department/permissions but does not update or reset the existing password.
- `loginStaff` normalizes the email, connects to the database, searches only for users whose role is `staff` or `admin`, rejects inactive accounts, and compares the submitted password with the stored bcrypt hash.
- The production frontend API client resolves its backend base URL from `VITE_API_BASE_URL` (normalizing the `/api` suffix) or its production fallback.

These are source-code observations, not proof of the live MongoDB account state. Confirm the actual runtime environment and database before selecting the fix.

### 9.2 Diagnose the entire authentication path

Trace and verify all of the following in the correct environment:

1. The deployed frontend is using the intended production API URL and `/api` prefix.
2. The API health route responds successfully and reports the expected database connection state.
3. Production backend is connected to the intended MongoDB database/cluster and not a local, staging or stale database.
4. The `sales@lotustubes.com` user record exists in that production database.
5. Its email is normalized/lowercase, its role is `admin` (or the intended permitted staff role), and `accountStatus` is `active`.
6. The password is stored as a bcrypt hash and the correct password-reset path is being used; never retrieve or print the plaintext password.
7. The backend is loading the intended `STAFF_INIT_EMAIL`, `STAFF_INIT_PASSWORD`, `NODE_ENV`, `MONGODB_URI` and `JWT_SECRET` from the correct Hostinger environment scope.
8. Frontend requests reach that exact backend, and CORS allows the production domain.
9. The login request body field names match the controller (`email`, `password`).
10. The API returns the correct status/error and the frontend preserves the actual error instead of masking all errors as “Invalid staff credentials”.
11. A successful login returns a valid JWT, stores auth data, updates AuthContext and opens the intended CRM dashboard.
12. The account has the intended Super Admin permissions, not merely a UI-visible admin label.

Use secure temporary diagnostics that report account existence, role, active status, DB identity/connection state and password-comparison result as booleans/statuses only. Never log password values, password hashes, JWTs, reset tokens, database connection strings or API secrets.

### 9.3 Correct provisioning safely

Fix the admin provisioning design so that:

- The target Super Admin email is explicit and unambiguous in production configuration.
- If the intended account email is `sales@lotustubes.com`, the production `STAFF_INIT_EMAIL` is set to that address and the provisioning logic does not silently choose another identity.
- Missing production bootstrap credentials do not fall back to a hardcoded, predictable password.
- An existing account is not silently assigned a new password on every application restart.
- Initial account creation and password reset are separate, auditable operations.
- Password reset uses a secure one-time administrative process or protected CLI task that reads the new secret from an environment/interactive secret input; do not hardcode it in the repository.
- The password is hashed by the existing Mongoose password-save hook.
- The initial or reset account is forced to change its password on first login where appropriate (`mustChangePassword`).
- A failed bootstrap is visible to the operator and does not falsely report that the account is provisioned.
- Any destructive or privilege-changing database operation is scoped to the exact intended account and is audited.

Do not create a public route that lets anyone create or promote an admin. Do not make the frontend capable of granting admin rights. Do not weaken bcrypt, JWT validation, rate limits or backend role checks.

### 9.4 Authentication acceptance tests

Use a dedicated test/staging database, never an uncontrolled production dataset.

Test:

- Correct Super Admin email + valid configured secret → successful login.
- Wrong password → safe 401 response.
- Unknown email → safe 401 response.
- Inactive staff user → safe 403 response.
- Customer role attempting staff login → rejected.
- Staff role without admin privileges → cannot access admin-only features.
- Admin role with required permissions → correct CRM access.
- Expired/invalid JWT → rejected.
- Public registration cannot create admin/staff accounts.
- Admin password reset does not expose the password and is audited.
- Restarting the backend does not unexpectedly reset a provisioned account’s password.

Do not claim the production login is fixed until the owner can successfully sign in to the deployed production CRM using the securely reset account.

---

## 10. Search, navigation and complete website functionality

The product search engine already supports multi-attribute search and synonyms. Preserve its useful behaviour while testing for false positives, missing matches and broken route handling.

Verify:

- Search from the main navigation opens the right search/catalogue state.
- Queries in URL parameters are populated correctly.
- Back/forward navigation does not leave stale search state.
- Search works for product name, grade, category, finish, dimensions, connection and verified specifications.
- A search result opens the correct product detail route.
- Clear search and Reset Filters work.
- Category, material, finish and standard filters work together.
- Empty search state is readable and provides a useful reset path.
- Search and catalogue remain usable on mobile.
- All industry cards and product category cards navigate to meaningful destinations.
- No visible button is decorative or inert.

If search synonyms expand too broadly or make unrelated products match, tune the synonym map and add tests rather than weakening search precision.

---

## 11. Global responsive, accessibility and visual QA

Verify the complete website at these viewport widths (or close equivalents):

- Mobile: 360 px, 390 px and 430 px.
- Tablet: 768 px and 1024 px.
- Desktop: 1280 px and 1440 px.
- Wide desktop: 1600 px or more.

Requirements:

- No horizontal overflow on any public or CRM route.
- No cut-off headings, clipped buttons, overlapping floating widgets or broken card grids.
- Responsive navigation and mobile drawer work.
- Search/filter sidebars adapt correctly.
- Product galleries are touch-usable.
- Industry controls remain accessible.
- Text contrast meets WCAG AA where applicable.
- Keyboard navigation and focus-visible styling work.
- Buttons and links have descriptive accessible labels.
- Images have meaningful alt text; decorative images use appropriate empty alt text.
- Respect reduced-motion preferences.
- Modals have correct focus behaviour and Escape/close behaviour.
- Loading, empty, error, success and retry states are styled consistently.

Do not introduce animation that blocks content, causes layout shift, slows mobile rendering or breaks keyboard navigation.

---

## 12. SEO, performance and content regression checks

Preserve and improve existing SEO infrastructure. Do not sacrifice crawlability to achieve a visual redesign.

Verify:

- Unique, relevant title and meta description for each public route.
- Correct canonical URL on `https://lotustubes.com/` and all supported routes.
- Correct `robots` directives and `noindex` for private CRM/customer pages where appropriate.
- Valid sitemap and robots.txt.
- Correct language and `hreflang` for supported locales.
- Server/static prerendering remains functional.
- No duplicate, incorrect or fabricated JSON-LD.
- Product schema is used only when actual product data and required properties are available; do not invent price, offers, reviews, ratings or stock.
- Image dimensions, compression, lazy loading and alt text remain appropriate.
- Fonts and CSS load without errors.
- No mixed-content, missing asset, broken route or JavaScript console errors.
- No unnecessary JS/CSS growth or duplicate libraries.
- Lighthouse/Core Web Vitals should not regress materially.

Do not use SEO copy to claim a certification, standard, manufacturing capability, “ready stock”, dispatch time, roughness value or customer relationship that has not been verified.

---

## 13. Preserve core business workflows

The redesign must not break:

- Product catalogue and product detail routes.
- Customer registration and customer login.
- Staff login and role-based CRM access.
- Contact Us form submission.
- Product enquiry and quick RFQ flows.
- BOQ/quotation request submission.
- Customer-to-enquiry record linking.
- Product search and filters.
- Email notifications where credentials are configured.
- WhatsApp Business enquiry links.
- CRM customer, enquiry, quotation, task and product views.
- Super Admin approval restrictions.

The website must continue to use real API data where the application already does so. Do not replace a broken integration with local dummy data or a success toast.

The existing four AI agents are a documented operating model. Their full unattended automation must not be presented as live unless the backend, approval interface and provider dispatch path have been implemented and tested. Super Admin approval remains mandatory for customer-facing quotations, invoice dispatch and covered staff/AI responses.

---

## 14. Implementation approach and change control

Work in a dedicated feature branch, for example:

`fix/figma-aligned-site-redesign-and-auth`

Use this order:

### Phase 1 — Audit and evidence

- Read project docs.
- Inspect relevant code, CSS and data.
- Open Figma reference.
- Reproduce each reported issue.
- Record root causes and acceptance criteria.

### Phase 2 — Design system and layout

- Establish/reuse Figma-matched tokens.
- Refactor common product surfaces and card styles.
- Rebuild homepage section composition.
- Rebuild homepage and dedicated Industries experiences.
- Remove the three unwanted homepage sections without damaging retained content.

### Phase 3 — Floating controls and product pages

- Correct the real WhatsApp brand icon.
- Separate WhatsApp Business shortcut from ChatWithUs assistant.
- Redesign catalogue/search/product-detail backgrounds and layout.
- Remove obsolete 360-degree UI per project direction.
- Remove misleading specification and stock fallbacks.

### Phase 4 — Staff authentication repair

- Trace frontend API URL → backend API → MongoDB → User lookup → bcrypt comparison → JWT → AuthContext → CRM route.
- Correct environment and provisioning logic.
- Use a secure, audited one-time password reset/bootstrap for the intended Super Admin.
- Verify successful login against staging first and production only with owner authorisation.

### Phase 5 — Regression and quality assurance

- Run frontend production build.
- Run backend test suite against a dedicated test database.
- Add/update targeted unit and integration tests.
- Test key workflows manually in a browser.
- Check the specified viewport widths and main routes.
- Compare Figma target and implementation visually.

### Phase 6 — Report and handoff

Provide a final implementation report with:

- Every issue identified and its root cause.
- Every file changed and why.
- Screenshots of before/after for the redesigned sections and product surfaces.
- Tests executed and exact pass/fail outcomes.
- Any test that could not be run and why.
- Environment variables or hosting changes the owner must make.
- Anything requiring Figma access or business confirmation.
- Deployment steps and rollback notes.

Do not merge to `main`, change live production environment secrets, reset production credentials, or deploy to production without explicit owner authorization. Prepare a PR and a safe deployment checklist.

---

## 15. Definition of done — mandatory acceptance checklist

The task is complete only when all relevant items below are verified.

### Homepage

- [ ] Fluid Products / End-to-End Fluid Handling promotional block is fully removed.
- [ ] Immediate Stock / Immediate Availability block is fully removed.
- [ ] AI Fleet promotional block is removed from the homepage while legitimate CRM/backend agent functionality is preserved.
- [ ] No blank gaps, empty wrappers, orphaned styles or broken section spacing remain.
- [ ] Homepage composition matches the accessible Figma reference.

### Industries

- [ ] Homepage industries showcase has been redesigned from scratch.
- [ ] Dedicated `/industries` page has been redesigned from scratch.
- [ ] Industry imagery is relevant and correctly matched.
- [ ] Cards/controls navigate to meaningful destinations and preserve the selected industry.
- [ ] Desktop, tablet and mobile behaviour is verified.
- [ ] No scroll trap, hover-only content or inaccessible interaction remains.
- [ ] No fabricated factory, client, compliance or certification claims appear.

### WhatsApp and support chat

- [ ] Floating WhatsApp control uses a genuine, accurate WhatsApp brand mark.
- [ ] WhatsApp shortcut and Arjun ChatWithUs assistant are visually distinct.
- [ ] Correct configured business number and pre-filled message are used.
- [ ] No overlap or incorrect stacking with other floating UI exists.
- [ ] Icon is sharp, proportionate and accessible at all breakpoints.

### Product catalogue and details

- [ ] Search results and normal catalogue browsing use the new consistent product surface design.
- [ ] Product Detail gallery and information panels use the new design.
- [ ] No image is stretched, squashed, recoloured or distorted.
- [ ] Missing technical data is not replaced by invented fallbacks.
- [ ] Stock, availability, standard, roughness, size, wall thickness, finish and MTC claims are only shown when verified for that product.
- [ ] Obsolete 360-degree controls/labels are removed according to the latest project direction.
- [ ] Genuine non-360 product videos and enquiry paths still work.

### Staff Workspace / Super Admin

- [ ] Correct production API URL and database have been confirmed.
- [ ] Intended admin email resolves to the correct production user record.
- [ ] Account role and active status are correct.
- [ ] Password was securely reset/bootstrapped without hardcoding or logging it.
- [ ] Correct credentials successfully authenticate on the intended environment.
- [ ] JWT and AuthContext persist the session correctly.
- [ ] Super Admin CRM routes and permissions work.
- [ ] A non-admin cannot access Super Admin-only actions.
- [ ] The backend does not fall back to a predictable production password.
- [ ] Backend restarts do not unexpectedly reset the administrator's password.

### Whole-site quality

- [ ] All primary routes render without crashes.
- [ ] No horizontal overflow on the tested viewports.
- [ ] No broken images, missing assets or console errors on key routes.
- [ ] Navigation, buttons, filters, search, forms and modals work.
- [ ] SEO metadata, canonical, sitemap, hreflang, prerender and schema validation remain correct.
- [ ] Frontend production build passes.
- [ ] Backend tests pass against an isolated test database, or failures are documented.
- [ ] Changed behaviours have automated tests.
- [ ] Final Figma comparison screenshots are reviewed at matching breakpoints.

---

## 16. Strict rules — do not violate these

1. Do not rebuild the entire website from scratch when targeted refactoring is sufficient.
2. Do not switch frameworks or replace the existing backend/database architecture.
3. Do not delete product catalogue, customer, enquiry, quotation, invoice, staff or CRM functionality while removing homepage marketing sections.
4. Do not hardcode credentials, password values, tokens, database URLs or production secrets.
5. Do not bypass backend authentication or role checks to make the login appear to work.
6. Do not create fake admin accounts or expose admin creation publicly.
7. Do not send live customer messages or financial documents without the required Super Admin approval.
8. Do not fabricate material grades, dimensions, standards, certifications, roughness, availability, pricing, dispatch timelines or client references.
9. Do not create a fake manufacturing facility or imply ownership of a factory.
10. Do not use an approximate/emoji WhatsApp icon.
11. Do not reintroduce blog or 3D/360-degree product features unless the owner explicitly changes the current decision.
12. Do not use a visual redesign to hide broken functionality.
13. Do not report a test as passed if it was not executed.
14. Do not merge or deploy without explicit authorisation.
15. Update `PROJECT.md` and focused documentation when an architectural or workflow decision changes.

**Start now with Phase 1. Inspect the repository and reproduce the issues before editing. Then implement the complete fix set in the sequence above and verify every acceptance criterion that applies.**
