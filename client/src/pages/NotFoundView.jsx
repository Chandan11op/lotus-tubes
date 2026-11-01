import React from 'react';
import { CONFIG } from '../data/siteData';

export const NotFoundView = ({ onOpenEnquiry }) => {
  return (
    <div className="not-found-view bg-slate-950 text-white min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="site-container max-w-3xl mx-auto text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold tracking-wider text-sky-400 uppercase shadow-lg mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Error 404 • Component or Page Not Found</span>
        </div>

        {/* Big Graphic Heading */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-sky-200 mb-4">
          Looking for a Specific Sanitary Component or Specification?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto mb-8">
          The page or product link you requested may have been relocated or updated in our master catalogue. You can search our inventory, navigate directly to our product lines, or speak with our sales desk.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <a href="#home" className="btn btn--primary px-6 py-3 text-sm font-bold shadow-lg shadow-sky-500/20">
            Return to Homepage
          </a>

          <a href="#products" className="btn btn--outline px-6 py-3 text-sm font-semibold border-slate-600 text-white hover:bg-slate-850">
            Browse Full Product Catalogue &rarr;
          </a>

          <a
            href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20was%20looking%20for%20a%20product%20on%20your%20website%20and%20need%20assistance.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-800/80 hover:bg-emerald-900/60 transition-colors"
          >
            <span>🟢</span>
            <span>WhatsApp Sales Desk</span>
          </a>
        </div>

        {/* Quick Category Jump Matrix */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
            Or Jump Directly to Core Sanitary Lines:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="#category/sanitary-pipes"
              className="p-3 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 transition-all text-center"
            >
              <div className="text-lg mb-1">📏</div>
              <div className="text-xs font-bold text-white">Sanitary Pipes</div>
              <div className="text-[10px] text-slate-400">ASTM A270 EP / MP</div>
            </a>

            <a
              href="#category/sanitary-fittings"
              className="p-3 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 transition-all text-center"
            >
              <div className="text-lg mb-1">🔀</div>
              <div className="text-xs font-bold text-white">Pipe Fittings</div>
              <div className="text-[10px] text-slate-400">Bends, Tees, Reducers</div>
            </a>

            <a
              href="#category/tri-clamp"
              className="p-3 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 transition-all text-center"
            >
              <div className="text-lg mb-1">🔗</div>
              <div className="text-xs font-bold text-white">Tri-Clamp & Ferrules</div>
              <div className="text-[10px] text-slate-400">Clamps & Unions</div>
            </a>

            <a
              href="#category/manual-valves"
              className="p-3 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 transition-all text-center"
            >
              <div className="text-lg mb-1">🚰</div>
              <div className="text-xs font-bold text-white">Hygienic Valves</div>
              <div className="text-[10px] text-slate-400">Butterfly, Ball, Diaphragm</div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFoundView;

