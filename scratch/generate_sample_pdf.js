import fs from 'fs';
import path from 'path';

function createSampleQuotationPDF() {
  // A clean, valid minimal PDF document with text and lines
  const lines = [
    "%PDF-1.4",
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj",
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    "6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj"
  ];

  const streamContent = `
0.06 0.15 0.24 rg
0 710 612 82 re f
1 1 1 rg
BT /F2 20 Tf 50 750 Td (LOTUS TUBES) Tj ET
BT /F1 10 Tf 50 735 Td (Stainless Steel Sanitary Pipes, Fittings & Valves | Lotus Impex) Tj ET
BT /F1 9 Tf 380 750 Td (Date: October 2026) Tj ET
BT /F1 9 Tf 380 735 Td (Ref: LT-SAMPLE-QUOTE-2026) Tj ET

0.94 0 0.47 rg
0 706 612 4 re f

0.06 0.15 0.24 rg
BT /F2 14 Tf 50 670 Td (SAMPLE QUOTATION DEMONSTRATION DOCUMENT) Tj ET
BT /F1 10 Tf 50 652 Td (Notice: This document is an indicative sample generated for technical specification review.) Tj ET
BT /F1 10 Tf 50 638 Td (Final commercial prices, batch MTCs, and dispatch schedules require official confirmation.) Tj ET

0.89 0.91 0.94 rg
50 490 512 130 re f
0.13 0.26 0.39 RG
1 w
50 490 512 130 re S

0.06 0.15 0.24 rg
BT /F2 11 Tf 65 595 Td (Product Item:) Tj ET
BT /F1 11 Tf 180 595 Td (SS 316L Electro-Polished Sanitary Pipe / Tri-Clamp Components) Tj ET

BT /F2 11 Tf 65 570 Td (Material Grade:) Tj ET
BT /F1 11 Tf 180 570 Td (ASTM A270 / SS 316L (Molybdenum 2.0 - 2.5%)) Tj ET

BT /F2 11 Tf 65 545 Td (Surface Finish:) Tj ET
BT /F1 11 Tf 180 545 Td (Electro-Polished (EP) Ra <= 0.38 um (15 uin) ID / Ra <= 0.8 um OD) Tj ET

BT /F2 11 Tf 65 520 Td (Sample Quantity:) Tj ET
BT /F1 11 Tf 180 520 Td (Indicative Lot: 100 Meters / 25 Fittings (Sample Unit)) Tj ET

BT /F2 12 Tf 50 450 Td (Sample Quotation Terms & Sourcing Criteria) Tj ET
BT /F1 10 Tf 50 430 Td (1. Pricing Basis: Ex-works Mumbai Warehouse / CIF Export upon final packing list.) Tj ET
BT /F1 10 Tf 50 412 Td (2. Material Certification: EN 10204 3.1 Material Test Certificate provided with heat trace.) Tj ET
BT /F1 10 Tf 50 394 Td (3. Tolerances: Outside diameter and wall gauge conforming strictly to ASTM A270 standards.) Tj ET
BT /F1 10 Tf 50 376 Td (4. Packing: Cleanroom polythene sleeved, end-capped, crated for secure transit.) Tj ET
BT /F1 10 Tf 50 358 Td (5. Validity: 14 business days from date of issuance by sales desk.) Tj ET

1 0.94 0.96 rg
50 250 512 80 re f
0.94 0 0.47 RG
1 w
50 250 512 80 re S

0.51 0.09 0.26 rg
BT /F2 11 Tf 65 305 Td (DEMONSTRATION & ESTIMATION DISCLAIMER:) Tj ET
BT /F1 9 Tf 65 285 Td (This document is produced as part of the Lotus Tubes interactive catalogue quotation workflow.) Tj ET
BT /F1 9 Tf 65 270 Td (Do not use this document as a binding commercial proforma invoice or contractual commitment.) Tj ET

0.4 0.44 0.52 rg
BT /F2 10 Tf 50 180 Td (Lotus Tubes - Registered Sourcing Desk) Tj ET
BT /F1 9 Tf 50 162 Td (Legal Name: Lotus Impex | GSTIN: 27AIIPS0303A1ZU | IEC: 0316902471) Tj ET
BT /F1 9 Tf 50 146 Td (Address: Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon, Mumbai 400004) Tj ET
BT /F1 9 Tf 50 130 Td (Official Direct Desk: +91 99304 30789 | Email: sales@lotustubes.com) Tj ET
`;

  const streamLength = Buffer.byteLength(streamContent, 'utf-8');
  lines.push(`4 0 obj << /Length ${streamLength} >> stream${streamContent}\nendstream endobj`);

  // Build xref table
  let currentOffset = 0;
  const offsets = [0];
  const pdfBody = lines.join('\n') + '\n';
  
  // Calculate offsets accurately
  let cumulative = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] + '\n';
    if (i > 0 && lines[i].match(/^\d+ 0 obj/)) {
      offsets.push(cumulative);
    }
    cumulative += Buffer.byteLength(line, 'utf-8');
  }

  const xrefOffset = cumulative;
  let xref = `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xref += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  const trailer = `trailer << /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdfBody + xref + trailer;
}

const pdfContent = createSampleQuotationPDF();

// Write to client/public/sample-quotation.pdf
const clientPublic = path.resolve('client/public');
if (!fs.existsSync(clientPublic)) fs.mkdirSync(clientPublic, { recursive: true });
fs.writeFileSync(path.join(clientPublic, 'sample-quotation.pdf'), pdfContent);
console.log('Wrote client sample-quotation.pdf');

// Write to server/public/sample-quotation.pdf
const serverPublic = path.resolve('server/public');
if (!fs.existsSync(serverPublic)) fs.mkdirSync(serverPublic, { recursive: true });
fs.writeFileSync(path.join(serverPublic, 'sample-quotation.pdf'), pdfContent);
console.log('Wrote server sample-quotation.pdf');
