// The five brand pillars (see ../../_docs and brand guidelines) and their
// translations, used by the hero WordRotator and the ParticleField backdrop.
//
// ⚠️ Translations are best-effort and pending native-speaker review — edit
// freely; each entry is independent. Notes:
//  - Quechua is included first among translations because "Ayni" itself is a
//    Quechua concept. "Pachamama" (Mother Earth) stands in for "planet" as the
//    culturally resonant choice rather than a literal loanword.
//  - Where a literal translation would duplicate another language's spelling
//    (es/pt "futuro", zh/ja shared characters), a valid alternate form is used
//    so the animation never shows the same glyphs twice.

export const PILLARS = [
  "planet",
  "humanity",
  "future",
  "wonder",
  "truth",
] as const;

export type Pillar = (typeof PILLARS)[number];

type Translation = { lang: string; word: string };

export const PILLAR_WORDS: Record<Pillar, Translation[]> = {
  planet: [
    { lang: "en", word: "planet" },
    { lang: "qu", word: "Pachamama" },
    { lang: "es", word: "planeta" },
    { lang: "pt", word: "Terra" },
    { lang: "fr", word: "planète" },
    { lang: "ar", word: "الكوكب" },
    { lang: "zh", word: "地球" },
    { lang: "ja", word: "ちきゅう" },
    { lang: "hi", word: "धरती" },
    { lang: "sw", word: "dunia" },
    { lang: "ru", word: "планета" },
    { lang: "de", word: "Erde" },
    { lang: "ko", word: "지구" },
    { lang: "id", word: "bumi" },
  ],
  humanity: [
    { lang: "en", word: "humanity" },
    { lang: "qu", word: "runakay" },
    { lang: "es", word: "humanidad" },
    { lang: "pt", word: "humanidade" },
    { lang: "fr", word: "humanité" },
    { lang: "ar", word: "الإنسانية" },
    { lang: "zh", word: "人类" },
    { lang: "ja", word: "人類" },
    { lang: "hi", word: "मानवता" },
    { lang: "sw", word: "ubinadamu" },
    { lang: "ru", word: "человечество" },
    { lang: "de", word: "Menschheit" },
    { lang: "ko", word: "인류" },
    { lang: "id", word: "kemanusiaan" },
  ],
  future: [
    { lang: "en", word: "future" },
    { lang: "qu", word: "hamuq pacha" },
    { lang: "es", word: "porvenir" },
    { lang: "pt", word: "futuro" },
    { lang: "fr", word: "avenir" },
    { lang: "ar", word: "المستقبل" },
    { lang: "zh", word: "未来" },
    { lang: "ja", word: "みらい" },
    { lang: "hi", word: "भविष्य" },
    { lang: "sw", word: "mustakabali" },
    { lang: "ru", word: "будущее" },
    { lang: "de", word: "Zukunft" },
    { lang: "ko", word: "미래" },
    { lang: "id", word: "masa depan" },
  ],
  wonder: [
    { lang: "en", word: "wonder" },
    { lang: "qu", word: "musphay" },
    { lang: "es", word: "asombro" },
    { lang: "pt", word: "maravilha" },
    { lang: "fr", word: "émerveillement" },
    { lang: "ar", word: "دهشة" },
    { lang: "zh", word: "惊奇" },
    { lang: "ja", word: "不思議" },
    { lang: "hi", word: "विस्मय" },
    { lang: "sw", word: "maajabu" },
    { lang: "ru", word: "чудо" },
    { lang: "de", word: "Staunen" },
    { lang: "ko", word: "경이" },
    { lang: "id", word: "keajaiban" },
  ],
  truth: [
    { lang: "en", word: "truth" },
    { lang: "qu", word: "chiqap" },
    { lang: "es", word: "verdad" },
    { lang: "pt", word: "verdade" },
    { lang: "fr", word: "vérité" },
    { lang: "ar", word: "الحقيقة" },
    { lang: "zh", word: "真相" },
    { lang: "ja", word: "真実" },
    { lang: "hi", word: "सत्य" },
    { lang: "sw", word: "ukweli" },
    { lang: "ru", word: "правда" },
    { lang: "de", word: "Wahrheit" },
    { lang: "ko", word: "진실" },
    { lang: "id", word: "kebenaran" },
  ],
};

// Flat list used by the particle backdrop.
export const ALL_PILLAR_WORDS: { pillar: Pillar; lang: string; word: string }[] =
  PILLARS.flatMap((pillar) =>
    PILLAR_WORDS[pillar].map((t) => ({ pillar, ...t }))
  );
