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
import TriClampGasket from './TriClampGasket.jsx';
import SanitarySMSUnion from './SanitarySMSUnion.jsx';
import SanitaryButterflyValve from './SanitaryButterflyValve.jsx';
import SanitaryDiaphragmValve from './SanitaryDiaphragmValve.jsx';
import SanitaryBallValve from './SanitaryBallValve.jsx';
import SanitaryCheckValve from './SanitaryCheckValve.jsx';
import SanitaryPneumaticValve from './SanitaryPneumaticValve.jsx';
import SanitarySamplingValve from './SanitarySamplingValve.jsx';
import SanitarySprayBall from './SanitarySprayBall.jsx';
import SanitaryPipeSpool from './SanitaryPipeSpool.jsx';

/**
 * ModelSelector
 * Routes a given product to its authentic procedural 3D model component
 * strictly governed by the centralized modelRegistry.
 * 
 * Critical rule: If no verified model exists for the product, returns null.
 * NEVER renders an unrelated fallback model.
 */
export default function ModelSelector({ product, autoRotate = false }) {
  const modelInfo = getProductModelStatus(product);

  if (modelInfo.status === 'unavailable' || !modelInfo.component) {
    return null;
  }

  const component = modelInfo.component;
  const isEP = product?.finish?.includes('EP') || product?.finish?.includes('Electro') || product?.finish?.includes('Mirror');

  switch (component) {
    case 'SanitaryBend90':
      return <SanitaryBend90 autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryBend45':
      return <SanitaryBend45 autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryTube':
      return <SanitaryTube autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryEqualTee':
      return <SanitaryEqualTee autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryReducingTee':
      return <SanitaryReducingTee autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'ConcentricReducer':
      return <ConcentricReducer autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'EccentricReducer':
      return <EccentricReducer autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'TriClampFerrule':
      return <TriClampFerrule autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'TriClampClamp':
      return <TriClampClamp autoRotate={autoRotate} />;
    case 'TriClampGasket': {
      const matType = product?.id?.includes('epdm') || product?.slug?.includes('epdm')
        ? 'epdm'
        : product?.id?.includes('ptfe') || product?.slug?.includes('ptfe')
        ? 'ptfe'
        : product?.id?.includes('viton') || product?.slug?.includes('viton')
        ? 'viton'
        : 'silicone';
      return <TriClampGasket autoRotate={autoRotate} materialType={matType} />;
    }
    case 'SanitarySMSUnion':
      return <SanitarySMSUnion autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryButterflyValve':
      return <SanitaryButterflyValve autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryBallValve':
      return <SanitaryBallValve autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryPneumaticValve':
      return <SanitaryPneumaticValve autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryDiaphragmValve':
      return <SanitaryDiaphragmValve autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryCheckValve':
      return <SanitaryCheckValve autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitarySamplingValve':
      return <SanitarySamplingValve autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitarySprayBall':
      return <SanitarySprayBall autoRotate={autoRotate} isElectroPolished={isEP} />;
    case 'SanitaryPipeSpool':
      return <SanitaryPipeSpool autoRotate={autoRotate} isElectroPolished={isEP} />;
    default:
      return null;
  }
}
