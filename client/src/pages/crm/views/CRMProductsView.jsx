import React, { useState, useMemo } from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const CRMProductsView = ({
  products = [],
  searchQuery = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Standard catalogue items if MongoDB collection is loading or empty
  const defaultSanitaryProducts = [
    {
      _id: 'prod-1',
      code: 'LT-PIPE-316L',
      name: 'SS 316L Electro Polished (EP) Sanitary Pipe',
      category: 'Pipes & Tubes',
      grade: 'SS 316L / DIN 1.4404',
      standard: 'ASME BPE / ASTM A270-S2',
      surfaceFinish: 'Ra < 0.4µm (15µ-in) EP',
      sizeRange: '0.5" OD to 4.0" OD',
      status: 'Active'
    },
    {
      _id: 'prod-2',
      code: 'LT-BEND-90',
      name: 'Sanitary 90° Long Radius Weld Bend',
      category: 'Fittings',
      grade: 'SS 316L / SS 304',
      standard: 'ASME BPE / 3-A Sanitary',
      surfaceFinish: 'Ra < 0.5µm Mechanical / EP',
      sizeRange: '0.5" to 4.0"',
      status: 'Active'
    },
    {
      _id: 'prod-3',
      code: 'LT-VALV-DIAPH',
      name: 'Sanitary Manual / Pneumatic Diaphragm Valve',
      category: 'Valves',
      grade: 'Forged 316L Body',
      standard: 'ASME BPE / FDA / USP Class VI',
      surfaceFinish: 'Ra < 0.38µm Internal',
      sizeRange: '0.5" to 2.5" Tri-Clamp',
      status: 'Active'
    },
    {
      _id: 'prod-4',
      code: 'LT-CLAMP-TC',
      name: 'Heavy Duty Tri-Clamp Single/Double Pin',
      category: 'Clamps & Ferrules',
      grade: 'SS 304 Investment Cast',
      standard: 'ISO 2852 / BS 4825',
      surfaceFinish: 'High Polish Bright Finish',
      sizeRange: '0.5" to 6.0"',
      status: 'Active'
    },
    {
      _id: 'prod-5',
      code: 'LT-TEE-EQ',
      name: 'Sanitary Equal Tee Butt-Weld',
      category: 'Fittings',
      grade: 'SS 316L',
      standard: 'ASME BPE / DIN 11850',
      surfaceFinish: 'Ra < 0.5µm internal',
      sizeRange: '0.5" to 4.0"',
      status: 'Active'
    }
  ];

  const allProducts = products.length > 0 ? products : defaultSanitaryProducts;

  const categories = ['All', 'Pipes & Tubes', 'Fittings', 'Valves', 'Clamps & Ferrules'];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name?.toLowerCase().includes(q) ||
          p.code?.toLowerCase().includes(q) ||
          p.grade?.toLowerCase().includes(q) ||
          p.standard?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  return (
    <div className="crm-workspace-view">
      {/* Category Filter Toolbar */}
      <div className="crm-card crm-toolbar-card">
        <div className="crm-toolbar-row">
          <div className="crm-filter-chips" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`crm-filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product List Table */}
      <div className="crm-card" style={{ marginTop: '16px' }}>
        <div className="crm-card__header">
          <div className="crm-card__header-title">
            <CRMIcon name="products" size={18} />
            <h3>Sanitary Stainless Steel Component Catalogue</h3>
            <span className="crm-badge crm-badge-blue">
              {filteredProducts.length} components
            </span>
          </div>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          <div className="crm-table-container">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Component Description</th>
                  <th>Category</th>
                  <th>Material Grade</th>
                  <th>Hygienic Standard</th>
                  <th>Surface Finish (Ra)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td className="crm-td-ref">
                      <strong>{p.code || 'LT-PROD'}</strong>
                    </td>
                    <td>
                      <div className="crm-cell-title">{p.name}</div>
                      {p.sizeRange && <div className="crm-cell-sub">Sizes: {p.sizeRange}</div>}
                    </td>
                    <td>
                      <span className="crm-badge crm-badge-gray">
                        {p.category || 'Pipes & Fittings'}
                      </span>
                    </td>
                    <td>
                      <strong>{p.grade || 'SS 316L'}</strong>
                    </td>
                    <td>
                      <span className="crm-location-chip">{p.standard || 'ASME BPE'}</span>
                    </td>
                    <td>
                      <span className="crm-cell-sub">{p.surfaceFinish || 'Ra < 0.4µm EP'}</span>
                    </td>
                    <td>
                      <span className="crm-status-pill crm-status-order-confirmed">
                        {p.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMProductsView;
