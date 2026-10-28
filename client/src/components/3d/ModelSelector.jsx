import React from 'react';
import SanitaryTube from './SanitaryTube.jsx';
import SanitaryBend90 from './SanitaryBend90.jsx';
import SanitaryBend45 from './SanitaryBend45.jsx';
import SanitaryEqualTee from './SanitaryEqualTee.jsx';
import SanitaryReducingTee from './SanitaryReducingTee.jsx';
import ConcentricReducer from './ConcentricReducer.jsx';
import EccentricReducer from './EccentricReducer.jsx';
import TriClampFerrule from './TriClampFerrule.jsx';
import TriClampClamp from './TriClampClamp.jsx';
import SanitaryButterflyValve from './SanitaryButterflyValve.jsx';
import SanitaryDiaphragmValve from './SanitaryDiaphragmValve.jsx';
import SanitaryBallValve from './SanitaryBallValve.jsx';
import SanitaryCheckValve from './SanitaryCheckValve.jsx';
import SanitaryPneumaticValve from './SanitaryPneumaticValve.jsx';

/**
 * ModelSelector
 * Routes a given product definition to its matching procedural 3D model component
 */
export default function ModelSelector({ product, autoRotate = true }) {
  const modelKey = product?.model3d || '';
  const name = (product?.name || '').toLowerCase();
  const cat = (product?.categorySlug || '').toLowerCase();

  if (modelKey === 'SanitaryBend90' || name.includes('90° bend') || name.includes('90 bend')) {
    return <SanitaryBend90 autoRotate={autoRotate} />;
  }
  if (modelKey === 'SanitaryBend45' || name.includes('45° bend') || name.includes('45 bend')) {
    return <SanitaryBend45 autoRotate={autoRotate} />;
  }
  if (modelKey === 'SanitaryEqualTee' || name.includes('equal tee')) {
    return <SanitaryEqualTee autoRotate={autoRotate} />;
  }
  if (modelKey === 'SanitaryReducingTee' || name.includes('reducing tee')) {
    return <SanitaryReducingTee autoRotate={autoRotate} />;
  }
  if (modelKey === 'ConcentricReducer' || name.includes('concentric reducer')) {
    return <ConcentricReducer autoRotate={autoRotate} />;
  }
  if (modelKey === 'EccentricReducer' || name.includes('eccentric reducer')) {
    return <EccentricReducer autoRotate={autoRotate} />;
  }
  if (modelKey === 'TriClampClamp' || name.includes('heavy duty clamp') || name.includes('tc clamp')) {
    return <TriClampClamp autoRotate={autoRotate} />;
  }
  if (modelKey === 'TriClampFerrule' || name.includes('ferrule')) {
    return <TriClampFerrule autoRotate={autoRotate} />;
  }
  if (modelKey === 'SanitaryButterflyValve' || name.includes('butterfly valve')) {
    return <SanitaryButterflyValve autoRotate={autoRotate} />;
  }
  if (modelKey === 'SanitaryDiaphragmValve' || name.includes('diaphragm valve')) {
    return <SanitaryDiaphragmValve autoRotate={autoRotate} />;
  }
  if (modelKey === 'SanitaryPneumaticValve' || name.includes('pneumatic')) {
    return <SanitaryPneumaticValve autoRotate={autoRotate} />;
  }
  if (modelKey === 'SanitaryBallValve' || name.includes('ball valve')) {
    return <SanitaryBallValve autoRotate={autoRotate} />;
  }
  if (modelKey === 'SanitaryCheckValve' || name.includes('check valve') || name.includes('non-return')) {
    return <SanitaryCheckValve autoRotate={autoRotate} />;
  }

  // Default to SanitaryTube for pipes or general fittings
  return <SanitaryTube autoRotate={autoRotate} />;
}
