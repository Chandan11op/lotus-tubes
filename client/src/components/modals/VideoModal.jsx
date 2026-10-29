import React, { useState } from 'react';

export const VideoModal = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    { num: 0, title: '1. Cold Drawing & Sizing', desc: 'Precision hydraulic draw bench cold sizing of seamless and welded mother pipes to tight ASME BPE dimensional tolerances.' },
    { num: 1, title: '2. Electro-Polishing (Ra ≤ 0.4 µm)', desc: 'Electrochemical dissolution of surface micro-roughness down to sub-micron level (Ra ≤ 0.38 µm) to prevent bacterial adhesion and biofilm formation.' },
    { num: 2, title: '3. Eddy Current & Hydro Testing', desc: '100% non-destructive electromagnetic testing and hydrostatic pressure test up to 150 bar to verify metallurgical integrity.' },
    { num: 3, title: '4. Cleanroom Capping & Packing', desc: 'Ultrasonic solvent cleaning, individual end capping with PE caps, and vacuum sleeve wrapping for pristine cleanroom installation.' }
  ];

  return (
    <div className="modal-overlay active" id="process-video-modal" role="dialog" aria-modal="true" aria-label="Hygienic Process Tour">
      <div className="modal-box modal-box--video">
        <div className="modal-header">
          <h3>Hygienic Sourcing & Surface Finishing Process</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="process-video-simulation">
            <div className="simulated-player">
              <div className="sim-badge">Lotus Tubes Quality Showcase</div>
              <div className="sim-stage" id="video-sim-stage">
                <div className="sim-step-indicator">
                  {steps.map((s, idx) => (
                    <button
                      key={s.num}
                      type="button"
                      className={`sim-dot ${activeStep === idx ? 'active' : ''}`}
                      onClick={() => setActiveStep(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
                <div className="sim-graphic-box">
                  <div className="sim-tube-animation">
                    <div className="sim-laser-beam"></div>
                    <div className="sim-tube-graphic"></div>
                  </div>
                  <div className="sim-caption">
                    <strong>{steps[activeStep].title}:</strong> {steps[activeStep].desc}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="video-modal-footer">
            <p>
              <small>* Note: Client verified sourcing and finishing sequence demonstration for international B2B buyers.</small>
            </p>
            <a href="#quality" onClick={onClose} className="btn btn--sm btn--primary">
              Review Quality Standards &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
