export type Area = { slug: string; ar: string; en: string };

export const AREAS: Area[] = [
  // القاهرة الكبرى
  { slug: "new-cairo", ar: "التجمع الخامس", en: "New Cairo" },
  { slug: "nasr-city", ar: "مدينة نصر", en: "Nasr City" },
  { slug: "maadi", ar: "المعادي", en: "Maadi" },
  { slug: "heliopolis", ar: "مصر الجديدة", en: "Heliopolis" },
  { slug: "mokattam", ar: "المقطم", en: "Mokattam" },
  { slug: "downtown-cairo", ar: "وسط البلد", en: "Downtown Cairo" },
  { slug: "helwan", ar: "حلوان", en: "Helwan" },
  { slug: "el-obour", ar: "العبور", en: "El Obour" },
  { slug: "badr-city", ar: "بدر", en: "Badr City" },
  { slug: "el-shorouk", ar: "الشروق", en: "El Shorouk" },
  { slug: "al-rehab", ar: "الرحاب", en: "Al Rehab" },
  { slug: "madinaty", ar: "مدينتي", en: "Madinaty" },
  // العاصمة الإدارية
  { slug: "new-capital", ar: "العاصمة الإدارية الجديدة", en: "New Administrative Capital" },
  // الجيزة
  { slug: "sheikh-zayed", ar: "الشيخ زايد", en: "Sheikh Zayed" },
  { slug: "6-october", ar: "6 أكتوبر", en: "6th of October" },
  { slug: "dokki", ar: "الدقي", en: "Dokki" },
  { slug: "mohandessin", ar: "المهندسين", en: "Mohandessin" },
  { slug: "faisal", ar: "فيصل", en: "Faisal" },
  { slug: "haram", ar: "الهرم", en: "Haram" },
  // الساحل والسياحة
  { slug: "north-coast", ar: "الساحل الشمالي", en: "North Coast" },
  { slug: "new-alamein", ar: "العلمين الجديدة", en: "New Alamein" },
  { slug: "marsa-matrouh", ar: "مرسى مطروح", en: "Marsa Matrouh" },
  { slug: "hurghada", ar: "الغردقة", en: "Hurghada" },
  { slug: "sharm-el-sheikh", ar: "شرم الشيخ", en: "Sharm El Sheikh" },
  { slug: "ras-el-hekma", ar: "رأس الحكمة", en: "Ras El Hekma" },
  // باقي المحافظات
  { slug: "alexandria", ar: "الإسكندرية", en: "Alexandria" },
  { slug: "mansoura", ar: "المنصورة", en: "Mansoura" },
  { slug: "tanta", ar: "طنطا", en: "Tanta" },
  { slug: "zagazig", ar: "الزقازيق", en: "Zagazig" },
  { slug: "damietta", ar: "دمياط", en: "Damietta" },
  { slug: "port-said", ar: "بورسعيد", en: "Port Said" },
  { slug: "ismailia", ar: "الإسماعيلية", en: "Ismailia" },
  { slug: "suez", ar: "السويس", en: "Suez" },
  { slug: "aswan", ar: "أسوان", en: "Aswan" },
  { slug: "luxor", ar: "الأقصر", en: "Luxor" },
  { slug: "assiut", ar: "أسيوط", en: "Assiut" },
  { slug: "minya", ar: "المنيا", en: "Minya" },
  { slug: "sohag", ar: "سوهاج", en: "Sohag" },
  { slug: "fayoum", ar: "الفيوم", en: "Fayoum" },
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}