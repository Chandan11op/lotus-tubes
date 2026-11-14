import React from 'react';
import PageHero from '../components/common/PageHero';
import { CONFIG, LEADERSHIP, AI_TEAM_MEMBERS } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';

export const AboutView = ({ onOpenEnquiry }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const rawPhone = (CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '');

  return (
    <div className="about-page-view">
      {/* 1. Cinematic Architectural Hero */}
      <PageHero
        image="/assets/images/hero/hero-about-commercial-factory.jpg"
        badge="Lotus Impex Division • Mumbai Central Stockhub"
        title="Engineered for Sterile Purity. Built for Industrial Trust."
        subtitle="Premier Stockist, Fabricator & Global Exporter of Stainless Steel Sanitary Piping Systems"
        description="Operating from Girgaon, Mumbai, Lotus Tubes delivers high-integrity SS 304 and SS 316L sanitary tubes, orbital fittings, and hygienic valves to pharmaceutical manufacturers, biotech skids, and sanitary food plants across India and global export destinations."
        stats={[
          { value: 'Girgaon, Mumbai', label: 'Central Distribution Hub' },
          { value: 'SS 316L / 304', label: 'Certified Metallurgy' },
          { value: 'EN 10204 3.1', label: '100% Heat Traceability' },
          { value: '24-48h', label: 'Rapid Dispatch Lead Time' }
        ]}
        actions={[
          <button
            key="rfq"
            type="button"
            onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Lotus Tubes Corporate Sourcing Consultation')}
            className="btn btn--primary"
          >
            Consult Engineering Team &rarr;
          </button>,
          <a key="cat" href={localizePath('/products', currentLang)} className="btn btn--outline">
            Explore 30+ Component Range
          </a>
        ]}
      />

      {/* 2. Executive Corporate Overview & Verified Accreditations */}
      <section className="site-container py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-semibold uppercase tracking-wider">
              <span>🏛️ Sourcing Lineage &amp; Philosophy</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Specialized Hygienic Supply Sourced for Zero-Defect Process Architecture
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Established as an engineering division of <strong>Lotus Impex</strong> (registered in Mumbai, 2019), 
              <strong> Lotus Tubes</strong> was created to eliminate the chronic sourcing bottlenecks faced by biotech skid fabricators, 
              WFI plant engineers, and pharmaceutical cleanroom project teams.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              Where conventional commercial pipe suppliers treat stainless steel as a generic commodity, we understand that hygienic processes 
              demand absolute microbiological safety. Every tube, elbow, ferrule, and valve we stock is strictly inspected for 
              <strong> internal surface roughness (Ra ≤ 0.38 µm)</strong>, true concentricity, orbital weldability, and full EN 10204 3.1 MTC chemistry compliance.
            </p>

            {/* Corporate Verification Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">GSTIN Registration</div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-1 break-all">{CONFIG.gstin}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">IEC Export Code</div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-1">{CONFIG.iec}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Stockhub Hub</div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-1">Girgaon, Mumbai</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Dispatch Speed</div>
                <div className="text-xs font-mono font-bold text-emerald-600 mt-1">24-48 Hours</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="/quote" className="btn btn--primary">
                Submit Bill of Quantities (BOQ) &rarr;
              </a>
              <a href={`tel:${rawPhone}`} className="btn btn--outline-dark">
                📞 Call Direct Sales Desk
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
              <img
                src="/assets/images/company/lotus-tubes-facility.jpg"
                alt="Lotus Tubes Mumbai Distribution and Warehousing Facility"
                className="w-full h-80 sm:h-96 object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 block mb-1">
                  Mumbai Central Inventory Center
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Precision Temperature-Controlled Stocking of Sanitary Tubes &amp; Valves
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Protected end-cap packaging, batch-segregated shelving, and ready dispatch staging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Engineering Pillars of Lotus Tubes */}
      <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200">
        <div className="site-container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-600 uppercase">
              Operational Assurance
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              The Four Pillars of Sterile Engineering
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              How our Mumbai sales engineering team guarantees complete reliability from raw melt to skid installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl font-bold mb-4">
                🔬
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Metallurgy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Positive Material Identification (PMI) spectrometer checks confirm precise Chromium (16-18%), Nickel (10-14%), and Molybdenum (2.0-3.0%) content in every SS 316L heat.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-sky-700 font-semibold">
                ASTM A270 • ASME BPE
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-4">
                ✨
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Ra Profilometry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contact stylus profilometer testing verifies internal roughness Ra ≤ 0.38 µm (15 µin) for EP mirror lines, eliminating microscopic crevices where biofilms could incubate.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-emerald-700 font-semibold">
                Clean-In-Place (CIP) Ready
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold mb-4">
                📋
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Heat Traceability</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every length of tube and forged fitting carries distinct laser-etched heat codes matched 1:1 with manufacturer EN 10204 3.1 chemical and tensile test certificates.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-amber-700 font-semibold">
                Audit-Ready Documentation
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold mb-4">
                🚀
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Rapid Dispatch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralized stocking in South Mumbai enables rapid ground dispatch across major manufacturing clusters (Gujarat, Maharashtra, Telangana, Karnataka) and international sea ports.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-purple-700 font-semibold">
                Pan-India &amp; Global Air/Sea
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Strategic Milestone Timeline - Authentic Family Business Heritage */}
      <section className="site-container py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-600 uppercase">
            Evolution &amp; Family Heritage
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            The Journey of Lotus Tubes
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Built on Family Values. Driven by Engineering Excellence since 1989.
          </p>
        </div>

        <div className="relative border-l-2 border-sky-200 ml-4 md:ml-32 space-y-12">
          {/* Milestone 1 */}
          <div className="relative pl-8">
            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-sky-600"></span>
            <div className="inline-block px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-xs font-bold mb-1">
              1989 • Family Business Founded in Mumbai
            </div>
            <h3 className="text-lg font-bold text-slate-900">Establishment of Lotus Impex / Family Origins</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Founded by our family in Girgaon, Mumbai—the historic center of Indian metal trading—supplying quality stainless steel tubes, pipes, and raw materials to local pharmaceutical and processing plants.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="relative pl-8">
            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-sky-600"></span>
            <div className="inline-block px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-xs font-bold mb-1">
              2000s • Sanitary &amp; Dairy Specialization
            </div>
            <h3 className="text-lg font-bold text-slate-900">Expansion into Hygienic Dairy &amp; Food Lines</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Recognizing the stringent cleanability needs of India's dairy, food, and beverage boom, the business expanded into certified SMS 1145, DIN 11850, and 3-A sanitary fittings and butterfly valves.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="relative pl-8">
            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-sky-600"></span>
            <div className="inline-block px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-xs font-bold mb-1">
              2010s • High-Purity Biopharma Expansion
            </div>
            <h3 className="text-lg font-bold text-slate-900">ASME BPE SF4 Electropolished Range</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Introduced specialized ultra-pure ASME BPE SF4 electropolished tubing with Ra ≤ 0.38µm, zero dead-leg diaphragm valves, and precision Tri-Clamp systems for sterile parenteral biopharma loops.
            </p>
          </div>

          {/* Milestone 4 */}
          <div className="relative pl-8">
            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-sky-600"></span>
            <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold mb-1">
              Present Day • Next-Gen Leadership &amp; Modern RFQ Desk
            </div>
            <h3 className="text-lg font-bold text-slate-900">Continuing the Multi-Generational Legacy</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Managing Director Chirag Shah advances the family enterprise, uniting 35+ years of family trade relationships with modern digital quotation speed, rigorous EN 10204 3.1 MTC inspection, and direct WhatsApp sales support.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Business Leadership & Autonomous Operations Team */}
      <section className="site-container py-12 border-t border-slate-200">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-600 uppercase">
            Corporate Leadership &amp; AI Team
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Executive Direction &amp; Autonomous Operations
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Meet the leadership and specialized AI workflow agents delivering rapid quotations, billing precision, and verified support to signed-in customers.
          </p>
        </div>

        {/* Owner Profile Card */}
        <div className="lt-owner-card-panel">
          <div className="lt-owner-media">
            <img
              src={LEADERSHIP.photo || '/assets/images/team/owner.jpeg'}
              alt={`${LEADERSHIP.name} - ${LEADERSHIP.title || LEADERSHIP.designation}`}
              className="lt-owner-img"
              width="140"
              height="140"
              loading="lazy"
            />
            <span className="lt-owner-status-badge">
              <span className="lt-status-dot"></span> Executive Leadership
            </span>
          </div>
          <div className="lt-owner-copy">
            <div className="lt-owner-header-row">
              <div>
                <span className="lt-person-label">{LEADERSHIP.title || 'Managing Director'}</span>
                <h3 className="lt-owner-name">{LEADERSHIP.name}</h3>
              </div>
              <div className="lt-owner-location-pill">
                <span className="lt-loc-icon">📍</span>
                <span>{LEADERSHIP.location}</span>
              </div>
            </div>
            <p className="lt-owner-summary">{LEADERSHIP.summary}</p>
            <div className="lt-owner-pillars">
              <span className="lt-pill-tag">✓ Multi-Generational Family Enterprise (Est. 1989)</span>
              <span className="lt-pill-tag">✓ ASTM A270 &amp; ASME BPE Quality Oversight</span>
              <span className="lt-pill-tag">✓ Mandatory Super Admin Dispatch Review</span>
            </div>
          </div>
        </div>

        {/* Our Team Subsection */}
        <div className="lt-team-heading">
          <div>
            <span className="editorial-kicker">Our Team</span>
            <h3>Dedicated Operations Specialists Supporting Every Client Account</h3>
          </div>
          <p>
            Our experienced team of procurement, billing, engineering, and client operations professionals works in close coordination with Managing Director Chirag Shah to guarantee rapid technical quotations, exact ASME/ASTM compliance, and seamless customer service.
          </p>
        </div>

        {/* Team Members in Responsive Grid */}
        <div className="lt-team-2x2-grid">
          {AI_TEAM_MEMBERS.map((member) => (
            <article className="lt-team-card" key={member.id}>
              <div className="lt-team-card__image-container">
                <img
                  src={member.photo}
                  alt={`${member.name} - ${member.role}`}
                  className="lt-team-card__img"
                  width="400"
                  height="400"
                  loading="lazy"
                />
                <div className="lt-team-card__dept-pill">
                  {member.department || 'Operations'}
                </div>
              </div>

              <div className="lt-team-card__sheet">
                <div className="lt-team-card__top">
                  <div className="lt-team-card__name-row">
                    <h4 className="lt-team-card__name">{member.name}</h4>
                    <span className="lt-team-card__status">
                      <span className="lt-pulse-dot" /> {member.status || 'Available'}
                    </span>
                  </div>
                  <span className="lt-team-card__role">{member.role}</span>
                  <a href={`mailto:${member.email}`} className="lt-team-card__email" title={`Email ${member.name}`}>
                    ✉️ {member.email}
                  </a>
                </div>

                <div className="lt-team-card__body">
                  <p className="lt-team-card__summary">{member.summary}</p>
                  {member.value && (
                    <div className="lt-team-card__value">
                      <strong>Client Value:</strong> {member.value}
                    </div>
                  )}
                </div>

                <div className="lt-team-card__footer">
                  <div className="lt-team-card__channels">
                    {member.channels?.map((ch, idx) => (
                      <span key={idx} className="lt-team-card__tag">{ch}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Authentic Sourcing Guarantee Notice */}
      <section className="site-container pb-16 sm:pb-20">
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              Authentic Sourcing Guarantee
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
              No Counterfeit Alloys. No Compromised Roughness. Ever.
            </h3>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              We operate with uncompromising transparency. We partner with tier-1 precision drawing mills and certified CNC machining foundries. All MTC 3.1 certificates provided by Lotus Tubes correspond to verifiable heats and tested batches. If an alloy does not match our guaranteed specification, we replace it immediately without question.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <a href={localizePath('/quality', currentLang)} className="btn btn--primary">
                Review MTC 3.1 &amp; Quality Benchmarks &rarr;
              </a>
              <a href={localizePath('/contact', currentLang)} className="btn btn--outline">
                Visit Our Girgaon Office
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutView;
