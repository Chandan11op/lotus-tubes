/**
 * Lotus Tubes - Technical Terminology & Industrial Standards Glossary
 * 
 * Strict B2B Rule:
 * Standards (ASTM A270, ASME BPE, EN 10204 3.1), Material Grades (SS 316L, SS 304, 1.4404, 1.4301),
 * Roughness designations (Ra ≤ 0.38 µm, SF1, SF4), and Heat Numbers MUST NOT be corrupted.
 */

export const INDUSTRIAL_GLOSSARY = {
  materialGrades: {
    'SS 316L': {
      en: 'Stainless Steel 316L (UNS S31603 / 1.4404)',
      de: 'Edelstahl 316L (Wst. 1.4404 / X2CrNiMo17-12-2)',
      ar: 'ستانلس ستيل 316L (مقاوم للتآكل مع الموليبدينوم)',
      fr: 'Acier Inoxydable 316L (1.4404 / Z3 CND 17-11-02)',
      vi: 'Thép không gỉ Inox 316L (chống ăn mòn cao cấp)',
      bn: 'স্টেইনলেস স্টিল ৩১৬এল (মলিবডেনাম সমৃদ্ধ)',
      ms: 'Keluli Tahan Karat 316L (tahan kakisan asid & klorida)'
    },
    'SS 304': {
      en: 'Stainless Steel 304 (UNS S30400 / 1.4301)',
      de: 'Edelstahl 304 (Wst. 1.4301 / X5CrNi18-10)',
      ar: 'ستانلس ستيل 304 (درجة غذائية وصناعية نقية)',
      fr: 'Acier Inoxydable 304 (1.4301 / Z7 CN 18-09)',
      vi: 'Thép không gỉ Inox 304 (tiêu chuẩn thực phẩm và vi sinh)',
      bn: 'স্টেইনলেস স্টিল ৩০৪ (ফুড গ্রেড ও স্বাস্থ্যকর)',
      ms: 'Keluli Tahan Karat 304 (gred makanan dan minuman)'
    }
  },
  surfaceFinishes: {
    electropolished: {
      en: 'Electro-Polished (EP) Internal Bore Ra ≤ 0.38 µm (15 µin)',
      de: 'Elektropoliert (EP) Innenbohrung Ra ≤ 0,38 µm (ASME BPE SF4)',
      ar: 'صقل كهربائي كهربائي داخلي Ra ≤ 0.38 ميكرومتر فائق النعومة',
      fr: 'Électropoli (EP) Alésage Interne Ra ≤ 0,38 µm (Finition SF4)',
      vi: 'Đánh bóng điện hóa (EP) bề mặt trong Ra ≤ 0.38 µm (tiêu chuẩn SF4)',
      bn: 'ইলেক্ট্রো-পলিশড (EP) অভ্যন্তরীণ বোর Ra ≤ ০.৩৮ মাইক্রোমিটার',
      ms: 'Digilap Elektro (EP) Ruang Dalaman Ra ≤ 0.38 µm (kemasan SF4)'
    },
    mechanical: {
      en: 'Mechanically Polished (MP) Mirror Finish Ra ≤ 0.51 µm (20 µin)',
      de: 'Mechanisch poliert (MP) Spiegelschliff Ra ≤ 0,51 µm (ASME BPE SF1)',
      ar: 'صقل ميكانيكي (MP) لمعان المرآة Ra ≤ 0.51 ميكرومتر',
      fr: 'Poli Mécanique (MP) Finition Miroir Ra ≤ 0,51 µm (Finition SF1)',
      vi: 'Đánh bóng cơ học (MP) bóng gương Ra ≤ 0.51 µm (tiêu chuẩn SF1)',
      bn: 'মেকানিক্যালি পলিশড (MP) মিরর ফিনিশ Ra ≤ ০.৫১ মাইক্রোমিটার',
      ms: 'Digilap Mekanikal (MP) Kemasan Cermin Ra ≤ 0.51 µm'
    }
  },
  certifications: {
    mtc: {
      en: 'EN 10204 3.1 Material Test Certificate with Full Chemical Heat Traceability',
      de: 'Abnahmeprüfzeugnis EN 10204 3.1 mit Schmelzenanalyse und Rückverfolgbarkeit',
      ar: 'شهادة اختبار المواد EN 10204 3.1 مع التتبع الكامل للحرارة الكيميائية',
      fr: 'Certificat de Contrôle EN 10204 3.1 avec Traçabilité Totale de la Coulée',
      vi: 'Chứng chỉ Thử nghiệm Vật liệu EN 10204 3.1 truy xuất đầy đủ số mẻ luyện',
      bn: 'সম্পূর্ণ রাসায়নিক হিট ট্র্যাসিবিলিটি সহ EN 10204 3.1 মেটেরিয়াল টেস্ট সার্টিফিকেট',
      ms: 'Sijil Ujian Bahan EN 10204 3.1 dengan Kebolehkesanan Penuh Nombor Haba'
    }
  }
};

