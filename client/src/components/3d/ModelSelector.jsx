import React from 'react';
import { getProductModelStatus } from '../../data/modelRegistry.js';
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
 * Routes a given product to its authentic procedural 3D model component
 * strictly governed by the centralized modelRegistry.
 * 
 * Critical rule: If no verified model exists for the product, returns null.
 * NEVER renders an unrelated fallback model.
 */
export default function ModelSelector({ product, autoRotate = true }) {
  const modelInfo = getProductModelStatus(product);

  if (modelInfo.status === 'unavailable' || !modelInfo.component) {
    return null;
  }

  const component = modelInfo.component;

  switch (component) {
    case 'SanitaryBend90':
      return <SanitaryBend90 autoRotate={autoRotate} />;
    case 'SanitaryBend45':
      return <SanitaryBend45 autoRotate={autoRotate} />;
    case 'SanitaryTube':
      return <SanitaryTube autoRotate={autoRotate} />;
    case 'SanitaryEqualTee':
      return <SanitaryEqualTee autoRotate={autoRotate} />;
    case 'SanitaryReducingTee':
      return <SanitaryReducingTee autoRotate={autoRotate} />;
    case 'ConcentricReducer':
      return <ConcentricReducer autoRotate={autoRotate} />;
    case 'EccentricReducer':
      return <EccentricReducer autoRotate={autoRotate} />;
    case 'TriClampFerrule':
      return <TriClampFerrule autoRotate={autoRotate} />;
    case 'TriClampClamp':
      return <TriClampClamp autoRotate={autoRotate} />;
    case 'SanitaryButterflyValve':
      return <SanitaryButterflyValve autoRotate={autoRotate} />;
    case 'SanitaryBallValve':
      return <SanitaryBallValve autoRotate={autoRotate} />;
    case 'SanitaryPneumaticValve':
      return <SanitaryPneumaticValve autoRotate={autoRotate} />;
    case 'SanitaryDiaphragmValve':
      return <SanitaryDiaphragmValve autoRotate={autoRotate} />;
    case 'SanitaryCheckValve':
      return <SanitaryCheckValve autoRotate={autoRotate} />;
    default:
      return null;
  }
}
