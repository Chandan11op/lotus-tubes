# WEBSITE AUDIT & BUG REPORT — LOTUS TUBES
**Date:** 13 November 2026  
**Auditor:** Senior Full-Stack Engineering & QA Team  
**Scope:** Client Codebase, Server APIs, Authentication, UI/UX Presentation, and Figma Reference (`Node 12:767`)

---

## 1. Executive Summary

This evidence-based audit examines the current implementation of the Lotus Tubes website (`client/` and `server/`), diagnoses the reported defects shown in client screenshots, identifies root causes, and defines the sequenced implementation plan.

### Reported Issues Diagnosed:
1. **Screenshot 1 (`media_1794577952714_ddcf78fb.jpg`)**: Staff workspace rejected administrator credentials (`sales@lotustubes.com`) with `"Invalid staff credentials."`
2. **Screenshot 2 (`media_1794579946852_208c2d9e.jpg`)**: Severe contrast/color collision on product detail (`/product/ss-sanitary-butterfly-valve`), where dark navy/black headings and text sat on pitch-black background, obsolete 360° video controls were displayed, and floating WhatsApp collided with support chat.
3. **Homepage Non-Working Sections**: Sections identified by client as non-working filler: End-to-End Fluid Handling (`#fluid-handling`), Immediate Availability / Stock Telemetry (`#immediate-stock`), and AI Fleet promotional cards (`#ai-fleet`).
4. **Industries Experience Deficiencies**: Pinned desktop scroll-hijacking in `IndustriesView.jsx`, stock product hero images used instead of genuine sector images.
5. **Data Integrity Fallbacks**: Hardcoded fallbacks in `ProductCard.jsx` and `ProductDetailView.jsx` inventing standard dimensions and "Ready Stock in Mumbai".

---

## 2. Root Cause Analysis & Evidence

### 2.1 Staff Workspace Authentication (`sales@lotustubes.com`)
- **Observed Behavior:** Login attempt for `sales@lotustubes.com` returned `401 Unauthorized` / `"Invalid staff credentials."`.
- **Root Cause:**
  1. In `server/src/config/env.js`, `staffInitEmail` defaulted to `'chirag@lotustubes.com'` rather than `'sales@lotustubes.com'`.
  2. In `server/src/scripts/provisionStaff.js`, existing users were never updated with new password hashes when environment passwords changed.
  3. The local client was communicating with `http://localhost:5000/api` where the database had an existing user created with a previous password hash.
- **Evidence:** Source code analysis of `env.js:33` and `provisionStaff.js:16-38`.

### 2.2 Contrast & Unreadable Text on Product Detail & Catalogue
- **Observed Behavior:** As shown in Screenshot 2, headings (`.text-slate-950`), specifications, and descriptions rendered in black/navy text directly on `#0d141c` (dark obsidian).
- **Root Cause:**
  1. In `client/src/index.css` (lines 176, 183, 190), `.public-shell` was hardcoded to `background-color: #0d141c; color: #dce3ef;`.
  2. Child views like `ProductDetailView.jsx` used Tailwind classes designed for light backgrounds (`text-slate-950`, `text-slate-600`, `bg-slate-50`).
- **Solution:** Re-architect `.public-shell` to a clean neutral industrial surface (`#F7F8FA` / `#FFFFFF`), reserving deep navy (`#071A52`) for hero headers, footers, and deliberate dark cards.

### 2.3 Obsolete 360° Product Features
- **Observed Behavior:** Product cards and product detail views rendered `360° Video`, `Interactive 360° View`, and `Product360Viewer`.
- **Root Cause:** Obsolete 360 viewer code had not been removed following the client's decision to eliminate 360° rotation in favor of genuine high-resolution static photography and standard video demonstrations.
- **Solution:** Cleanly remove all 360° badges, query parameters (`?view=360`), and components while preserving standard showcase videos.

### 2.4 Floating WhatsApp Logo & Arjun Support Chat
- **Observed Behavior:** In `FloatingWhatsApp.jsx`, the WhatsApp logo was an approximate, hand-drawn SVG path rather than the official Meta brand mark. It stacked awkwardly over `ChatWithUs.jsx`.
- **Root Cause:** Hardcoded custom SVG in `FloatingWhatsApp.jsx:28` and overlapping fixed bottom offsets (`bottom: 96px` vs `bottom: 24px`).
- **Solution:** Replace SVG with official WhatsApp brand mark, refine margins, and ensure distinct roles.

### 2.5 Data Integrity & Fabricated Technical Fallbacks
- **Observed Behavior:** Missing product fields were replaced with fabricated placeholders like `SS 316L / 304`, `ASME BPE / 3-A / ASTM A270`, `1/2" to 4" OD (Standard Stock)`, and `Ready Stock in Mumbai`.
- **Root Cause:** Hardcoded strings in `ProductCard.jsx:42, 170, 177` and `ProductDetailView.jsx:279, 334, 342`.
- **Solution:** Display only verified fields. For missing technical values, display "Confirm on enquiry" or omit cleanly.

---

## 3. Sequenced Implementation Plan

1. **Phase 1: Authentication & Provisioning Repair**
   - Update `server/src/config/env.js` to default `staffInitEmail` to `sales@lotustubes.com`.
   - Update `server/src/scripts/provisionStaff.js` to ensure `sales@lotustubes.com` is active with Super Admin permissions and verified password hash.
   - Add `server/src/scripts/resetAdminPassword.js` for auditable password reset.

2. **Phase 2: Global Background & Text Contrast Fix**
   - Fix `public-shell` in `client/src/index.css` to eliminate the pitch-black page bleed that rendered product text unreadable.
   - Ensure `ProductDetailView.jsx`, `ProductsView.jsx`, and `CategoryView.jsx` have deliberate contrast and proper background cards.

3. **Phase 3: Remove Obsolete 360° Controls**
   - Remove `Product360Viewer` and 360° badges from `ProductDetailView.jsx` and `ProductCard.jsx`.

4. **Phase 4: Remove 3 Unwanted Homepage Blocks & Recompose `HomeView.jsx`**
   - Remove `#fluid-handling` (End-to-End Fluid Handling).
   - Remove `#immediate-stock` (Immediate Availability / Stock Telemetry).
   - Remove `#ai-fleet` (AI Fleet promotional cards), keeping the Founder leadership card.
   - Retain seamless alternating background flow: White ↓ Light Grey ↓ Transparent Electric Blue ↓ White.

5. **Phase 5: Redesign Industries Experience (`HomeView.jsx` & `IndustriesView.jsx`)**
   - Replace pinned scroll-hijacking in `IndustriesView.jsx` with an accessible tabbed showcase.
   - Use verified industry images from `/assets/images/industries/`.

6. **Phase 6: Floating WhatsApp & Chat Separation**
   - Replace SVG with official WhatsApp vector in `FloatingWhatsApp.jsx`.
   - Ensure clean stacking and accessible labels.

7. **Phase 7: Full Verification**
   - Run `npm --prefix client run build`.
   - Run `npm --prefix server test`.

