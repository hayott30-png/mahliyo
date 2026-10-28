import { CefrLevel, LessonUnit, SpeakingPrompt, WritingTask } from '../types';

export interface CefrLevelInfo {
  level: CefrLevel;
  titleUz: string;
  titleTr: string;
  descriptionUz: string;
  targetVocab: number;
  grammarFocusUz: string[];
  isAvailable: boolean;
  totalUnits: number;
}

export const CEFR_LEVELS_INFO: CefrLevelInfo[] = [
  {
    level: 'A1',
    titleUz: 'Boshlang\'ich (A1)',
    titleTr: 'Başlangıç Seviyesi',
    descriptionUz: 'Kundalik eng oddiy iboralar, salomlashish, o\'zini tanishtirish, asosiy sonlar va hozirgi zamon gaplari.',
    targetVocab: 600,
    grammarFocusUz: ['Turk alifbosi va unlilar uyg\'unligi', 'Kishilik olmoshlari', 'Hozirgi zamon (-iyor)', 'Kundalik savol so\'zlari'],
    isAvailable: true,
    totalUnits: 6,
  },
  {
    level: 'A2',
    titleUz: 'Elementar (A2)',
    titleTr: 'Temel Seviye',
    descriptionUz: 'O\'tgan zamon (-di, -miş), kelasi zamon (-ecek), kundalik do\'konda va sayohatda erkin muloqot.',
    targetVocab: 1200,
    grammarFocusUz: ['Ko\'rilgan o\'tgan zamon (-di)', 'Eshitilgan o\'tgan zamon (-miş)', 'Kelasi zamon (-ecek)', 'Qiyoslash va darajalar (-den daha)'],
    isAvailable: false,
    totalUnits: 8,
  },
  {
    level: 'B1',
    titleUz: 'O\'rta (B1)',
    titleTr: 'Orta Seviye',
    descriptionUz: 'Murakkab bog\'langan gaplar, shart mayli (-se/-sa), orzu-istak ifodalari, matn va kitob o\'qish.',
    targetVocab: 2500,
    grammarFocusUz: ['Shart mayli (-se/-sa)', 'Majhul nisbat (-il/-in)', 'Sifatdoshlar (-en, -dik, -ecek)', 'Sabab-oqibat bog\'lovchilari'],
    isAvailable: false,
    totalUnits: 10,
  },
  {
    level: 'B2',
    titleUz: 'Yuqori O\'rta (B2)',
    titleTr: 'Orta Üstü Seviye',
    descriptionUz: 'Rasmiy muloqot, publitsistik matnlar, maqolalar va munozaralarda ravon fikr bildirish.',
    targetVocab: 4000,
    grammarFocusUz: ['Zarf-fiillar (-arak, -dıkça, -alı)', 'Murakkab nisbatlar', 'Turk xalq maqollari va iboralari', 'Rasmiy xatlar uslubi'],
    isAvailable: false,
    totalUnits: 12,
  },
  {
    level: 'C1',
    titleUz: 'Professional (C1)',
    titleTr: 'İleri Seviye',
    descriptionUz: 'Ilmiy, badiiy va biznes mavzularda ona tili darajasiga yaqin erkin so\'zlashuv va yozuv.',
    targetVocab: 6500,
    grammarFocusUz: ['Akademik turk tili', 'Murakkab sintaktik tuzilmalar', 'Frazeologizmlar va metaforalar', 'Publitsistik va notiqlik san\'ati'],
    isAvailable: false,
    totalUnits: 12,
  },
  {
    level: 'C2',
    titleUz: 'Mukammal (C2)',
    titleTr: 'Ustalık Seviyesi',
    descriptionUz: 'Eng nozik ma\'nodosh so\'zlar, qadimgi usmonli va zamonaviy adabiy til me\'yorlari, to\'liq avtonom mahorat.',
    targetVocab: 10000,
    grammarFocusUz: ['Etimologiya va tarixiy leksika', 'Stilistika va badiiy tahlil', 'Sinonim va omonimlar nozikliklari', 'Spontan falsafiy munozaralar'],
    isAvailable: false,
    totalUnits: 10,
  },
];

export const A1_LESSON_UNITS: LessonUnit[] = [
  {
    id: 'a1_unit_1',
    cefrLevel: 'A1',
    unitOrder: 1,
    titleUz: '1. Salomlashish va Tanishuv',
    titleTr: 'Selamlaşma ve Tanışma',
    descriptionUz: 'Turk tilida do\'stona va rasmiy salomlashish, o\'z ismini aytish va ahvol so\'rash iboralari.',
    grammarTitleUz: 'Salomlashish etiketi va unlilar talaffuzi',
    grammarNotesUz: `
Turk va o'zbek tillari qardosh tillar bo'lib, ko'plab salomlashish so'zlari ildizi bir xil.

1. Rasmiy va norasmiy salomlashish:
   - "Merhaba" — har qanday vaqtda barcha uchun universal salom (Salom / Assalomu alaykum).
   - "Günaydın" — ertalabki salom (Xayrli tong).
   - "İyi günler" — kunduzgi salom yoki xayrlashuv (Xayrli kun).
   - "İyi akşamlar" — kechki salom (Xayrli kech).
   - "İyi geceler" — uyqudan oldin (Xayrli tun).

2. Ism va hol-ahvol so'rash:
   - "Adınız ne?" (Ismingiz nima?) -> "Benim adım Ali." (Mening ismim Ali).
   - "Nasılsınız?" (Qandaysiz? / Qalaysiz?) -> "İyiyim, teşekkür ederim." (Yaxshiman, rahmat).
   - "Senin adın ne?" (Isming nima? - do'stona).

3. Xayrlashuv:
   - "Hoşça kal" — xayrlashayotgan odam aytadi (Xayr, yaxshi qol).
   - "Güle güle" — qolayotgan odam ketuvchiga aytadi (Oq yo'l / Kulib-kulib bor).
   - "Görüşürüz" — ko'rishguncha.
    `,
    comparisonWithUzbek: 'O\'zbek tilidagi "Xayrli kun" turk tilida "İyi günler", "Rahmat" esa "Teşekkür ederim" yoki qisqacha "Sağ ol" deb aytiladi.',
    estimatedMinutes: 15,
    vocabulary: [
      {
        id: 'v_1',
        tr: 'Merhaba',
        uz: 'Salom, Assalomu alaykum',
        pronunciation: 'Merhaba',
        exampleTr: 'Merhaba! Benim adım Elif.',
        exampleUz: 'Salom! Mening ismim Elif.',
        category: 'Salomlashuv',
      },
      {
        id: 'v_2',
        tr: 'Günaydın',
        uz: 'Xayrli tong',
        pronunciation: 'Gunaydin',
        exampleTr: 'Günaydın öğretmenim!',
        exampleUz: 'Xayrli tong ustozim!',
        category: 'Salomlashuv',
      },
      {
        id: 'v_3',
        tr: 'Nasılsınız?',
        uz: 'Qandaysiz? Ahvollaringiz qanday?',
        pronunciation: 'Nasilsiniz?',
        exampleTr: 'Merhaba Ahmet Bey, nasılsınız?',
        exampleUz: 'Salom Ahmad bey, ahvollaringiz qanday?',
        category: 'Muloqot',
      },
      {
        id: 'v_4',
        tr: 'İyiyim',
        uz: 'Yaxshiman',
        pronunciation: 'Iyiyim',
        exampleTr: 'Çok iyiyim, teşekkür ederim.',
        exampleUz: 'Juda yaxshiman, rahmat.',
        category: 'Hol-ahvol',
      },
      {
        id: 'v_5',
        tr: 'Memnun oldum',
        uz: 'Tanishganimdan xursandman',
        pronunciation: 'Memnun oldum',
        exampleTr: 'Ben de çok memnun oldum.',
        exampleUz: 'Men ham juda xursand bo\'ldim.',
        category: 'Tanishuv',
      },
      {
        id: 'v_6',
        tr: 'Görüşmek üzere',
        uz: 'Ko\'rishguncha',
        pronunciation: 'Gyorushmek uzere',
        exampleTr: 'Yarın görüşmek üzere!',
        exampleUz: 'Ertaga ko\'rishguncha!',
        category: 'Xayrlashuv',
      },
    ],
    dialogues: [
      { speaker: 'Emre', tr: 'Merhaba! Benim adım Emre. Senin adın ne?', uz: 'Salom! Mening ismim Emre. Sening isming nima?' },
      { speaker: 'Ziyoda', tr: 'Merhaba Emre! Benim adım Ziyoda.', uz: 'Salom Emre! Mening ismim Ziyoda.' },
      { speaker: 'Emre', tr: 'Tanıştığımıza çok memnun oldum Ziyoda.', uz: 'Tanishganimizdan juda xursandman, Ziyoda.' },
      { speaker: 'Ziyoda', tr: 'Ben de çok memnun oldum. Nasılsın?', uz: 'Men ham juda mamnunman. Qalaysan?' },
      { speaker: 'Emre', tr: 'İyiyim, teşekkürler! Sen nasılsın?', uz: 'Yaxshiman, rahmat! O\'zing qalaysan?' },
    ],
    exercises: [
      {
        id: 'ex_1_1',
        type: 'multiple_choice',
        promptUz: 'Turk tilida "Xayrli tong" qanday aytiladi?',
        options: ['İyi akşamlar', 'Günaydın', 'Hoşça kal', 'Güle güle'],
        correctAnswer: 'Günaydın',
        explanationUz: '"Günaydın" ertalabki salomlashish so\'zidir.',
        points: 10,
      },
      {
        id: 'ex_1_2',
        type: 'fill_blank',
        promptUz: 'Bo\'sh joyni to\'ldiring: "Benim _____ Ziyoda."',
        contextTr: 'Benim [?] Ziyoda.',
        options: ['adım', 'nasılsın', 'merhaba', 'günaydın'],
        correctAnswer: 'adım',
        explanationUz: '"Benim adım" — mening ismim degan ma\'noni beradi.',
        points: 10,
      },
      {
        id: 'ex_1_3',
        type: 'translation',
        promptUz: '"Memnun oldum" iborasining o\'zbekcha ma\'nosi nima?',
        options: ['Tanishganimdan xursandman', 'Kechirasiz', 'Salomat bo\'ling', 'Ko\'rishguncha'],
        correctAnswer: 'Tanishganimdan xursandman',
        explanationUz: 'Yangi inson bilan tanishganda "Memnun oldum" deb aytiladi.',
        points: 10,
      },
    ],
  },
  {
    id: 'a1_unit_2',
    cefrLevel: 'A1',
    unitOrder: 2,
    titleUz: '2. Turk Alifbosi va Tovushlar',
    titleTr: 'Türk Alfabesi ve Ses Uyumu',
    descriptionUz: 'Turk tilidagi 29 ta harf, maxsus tovushlar (ç, ğ, ı, ö, ş, ü) va unlilar uyg\'unligi (büyük ünlü uyumu) qoidalari.',
    grammarTitleUz: 'Turk tilida unlilar uyg\'unligi qoidasi',
    grammarNotesUz: `
Turk alifbosi 29 ta harfdan iborat: 8 ta unli va 21 ta undosh.

O'ziga xos harflar:
- Ç ç: o'zbekcha "ch" (çay - choy)
- Ğ ğ: "yumuşak ge". Hech qachon so'z boshida kelmaydi. O'zidan oldingi unlini cho'zadi (dağ - tog', ağaç - daraxt).
- I ı: qalin unli, o'zbekcha "i" dan ko'ra orqaroq va bo'g'iqroq aytiladi (ılık - iliq, ışık - chiroq).
- İ i: nozik unli, o'zbekchadagi odatiy "i" (iyi - yaxshi, insan - inson).
- Ö ö: yumshoq "o" (öğrenci - o'quvchi).
- Ş ş: o'zbekcha "sh" (şeker - shakar).
- Ü ü: yumshoq "u" (üzüm - uzum, üniversite - universitet).

Unlilar Uygunligi (Büyük Ünlü Uyumu):
Turk tilida so'zning birinchi bo'g'inidagi unliga qarab keyingi qo'shimchalar tanlanadi:
- Qalin unlilar: a, ı, o, u -> Qo'shimcha ham qalin bo'ladi (-lar, -da, -dan).
- Nozik unlilar: e, i, ö, ü -> Qo'shimcha ham nozik bo'ladi (-ler, -de, -den).
    `,
    comparisonWithUzbek: 'O\'zbek tilida sovet imlosida yo\'qolgan singarmonizm (unlilar moslashuvi) turk tilida qat\'iy amal qiladi: Masalan: Kitap-lar (kitoblar), Lekin: Defter-ler (daftarlar).',
    estimatedMinutes: 20,
    vocabulary: [
      {
        id: 'v_7',
        tr: 'Ağaç',
        uz: 'Daraxt',
        pronunciation: 'A-ach',
        exampleTr: 'Bahçede büyük bir ağaç var.',
        exampleUz: 'Bog\'da katta bir daraxt bor.',
        category: 'Tabiat',
      },
      {
        id: 'v_8',
        tr: 'Öğrenci',
        uz: 'O\'quvchi, talaba',
        pronunciation: 'O-yrenji',
        exampleTr: 'Ben Türk dili öğrencisiyim.',
        exampleUz: 'Men turk tili talabasiman.',
        category: 'Ta\'lim',
      },
      {
        id: 'v_9',
        tr: 'Şehir',
        uz: 'Shahar',
        pronunciation: 'Shehir',
        exampleTr: 'İstanbul güzel bir şehir.',
        exampleUz: 'Istanbul chiroyli shahar.',
        category: 'Geografiya',
      },
      {
        id: 'v_10',
        tr: 'Üzüm',
        uz: 'Uzum',
        pronunciation: 'Uzum',
        exampleTr: 'Taze üzüm çok lezzetli.',
        exampleUz: 'Yangi uzum juda mazali.',
        category: 'Meva',
      },
      {
        id: 'v_11',
        tr: 'Çiçek',
        uz: 'Gul, chechak',
        pronunciation: 'Chichek',
        exampleTr: 'Bu çiçek annem için.',
        exampleUz: 'Bu gul onam uchun.',
        category: 'Tabiat',
      },
    ],
    dialogues: [
      { speaker: 'Ali', tr: 'Affedersiniz, "öğrenci" kelimesini nasıl heceliyorsunuz?', uz: 'Kechirasiz, "öğrenci" so\'zini qanday bo\'g\'inlarga ajratasiz?' },
      { speaker: 'Ayşe', tr: 'Öğ-ren-ci. "Ğ" harfi burada okunmaz, sadece "ö" harfini uzatır.', uz: 'Öğ-ren-ci. "Ğ" harfi bu yerda o\'qilmaydi, faqat "ö" harfini cho\'zadi.' },
      { speaker: 'Ali', tr: 'Anladım, teşekkürler!', uz: 'Tushundim, rahmat!' },
    ],
    exercises: [
      {
        id: 'ex_2_1',
        type: 'multiple_choice',
        promptUz: '"Kitap" so\'ziga to\'g\'ri ko\'plik qo\'shimchasini tanlang (Unlilar uyg\'unligi):',
        options: ['Kitaplar', 'Kitapler', 'Kitapdur', 'Kitapdir'],
        correctAnswer: 'Kitaplar',
        explanationUz: '"Kitap" so\'zining oxirgi unlisi "a" (qalin) bo\'lgani uchun ko\'plik qo\'shimchasi "-lar" bo\'ladi.',
        points: 10,
      },
      {
        id: 'ex_2_2',
        type: 'multiple_choice',
        promptUz: 'Qaysi harf turk tilida hech qachon so\'z boshida kelmaydi?',
        options: ['ğ', 'ç', 'ş', 'ü'],
        correctAnswer: 'ğ',
        explanationUz: '"Ğ" (yumuşak ge) harfi bilan turk tilida hech qanday so\'z boshlanmaydi.',
        points: 10,
      },
      {
        id: 'ex_2_3',
        type: 'fill_blank',
        promptUz: 'To\'g\'ri ko\'plikni tanlang: "Ev + [?]"',
        options: ['ler', 'lar'],
        correctAnswer: 'ler',
        explanationUz: '"Ev" so\'zida "e" nozik unli bo\'lgani uchun "-ler" qo\'shiladi (Evler).',
        points: 10,
      },
    ],
  },
  {
    id: 'a1_unit_3',
    cefrLevel: 'A1',
    unitOrder: 3,
    titleUz: '3. Kishilik Olmoshlari va "Bo\'lmoq" Qo\'shimchalari',
    titleTr: 'Şahıs Zamirleri ve Ek-Fiil',
    descriptionUz: 'Men, sen, u, biz, siz, ular olmoshlari hamda sifat va otlarga shaxs qo\'shimchalarini bog\'lash (-im, -sin, -dir, -iz, -siniz, -ler).',
    grammarTitleUz: 'Turk tilida ega va shaxs qo\'shimchalari',
    grammarNotesUz: `
1. Kishilik olmoshlari:
   - Ben (Men)
   - Sen (Sen)
   - O (U)
   - Biz (Biz)
   - Siz (Siz)
   - Onlar (Ular)

2. Shaxs (Ek-Fiil) qo'shimchalari:
   - Ben doktor-um (Men doktorman). / Ben öğretmen-im (Men o'qituvchiman).
   - Sen doktor-sun (Sen doktorsan). / Sen öğretmen-sin (Sen o'qituvchisan).
   - O doktor(dur) (U doktor). / O öğretmen(dir).
   - Biz doktor-uz (Biz doktormiz). / Biz öğretmen-iz (Biz o'qituvchimiz).
   - Siz doktor-sunuz (Siz doktorsiz). / Siz öğretmen-siniz (Siz o'qituvchisiz).
   - Onlar doktor-lar (Ular doktorlar). / Onlar öğretmen-ler.

3. Inkori: "değil" (emas) so'zi orqali yasaladi:
   - Ben doktor değilim (Men doktor emasman).
   - Sen yorgun değilsin (Sen charchagan emassan).
    `,
    comparisonWithUzbek: 'O\'zbek tilidagi "-man, -san, -miz, -siz" qo\'shimchalari turk tilida ham xuddi shunday ishlaydi! O\'xshashlik juda katta.',
    estimatedMinutes: 20,
    vocabulary: [
      {
        id: 'v_12',
        tr: 'Öğretmen',
        uz: 'O\'qituvchi, ustoz',
        exampleTr: 'Fatma Hanım çok iyi bir öğretmen.',
        exampleUz: 'Fotima xonim juda yaxshi o\'qituvchi.',
        category: 'Kasblar',
      },
      {
        id: 'v_13',
        tr: 'Doktor',
        uz: 'Shifokor, doktor',
        exampleTr: 'Ağabeyim hastanede doktor.',
        exampleUz: 'Akam shifoxonada shifokor.',
        category: 'Kasblar',
      },
      {
        id: 'v_14',
        tr: 'Mutlu',
        uz: 'Baxtli, xursand',
        exampleTr: 'Bugün çok mutluyum.',
        exampleUz: 'Bugun juda baxtliman.',
        category: 'Sifatlar',
      },
      {
        id: 'v_15',
        tr: 'Yorgun',
        uz: 'Charchagan, toliqqan',
        exampleTr: 'İşten sonra biraz yorgunum.',
        exampleUz: 'Ishdan so\'ng biroz charchaganman.',
        category: 'Sifatlar',
      },
      {
        id: 'v_16',
        tr: 'Değil',
        uz: 'Emas',
        exampleTr: 'Ben yabancı değilim, Özbeğim.',
        exampleUz: 'Men begona emasman, o\'zbekman.',
        category: 'Grammatika',
      },
    ],
    dialogues: [
      { speaker: 'Murat', tr: 'Sen öğrenci misin?', uz: 'Sen talabamisan?' },
      { speaker: 'Kamola', tr: 'Evet, ben üniversitede öğrenciyim. Sen ne iş yapıyorsun?', uz: 'Ha, men universitetda talabaman. Sen nima ish qilasan?' },
      { speaker: 'Murat', tr: 'Ben mühendisim.', uz: 'Men muhandisman.' },
    ],
    exercises: [
      {
        id: 'ex_3_1',
        type: 'fill_blank',
        promptUz: 'Bo\'sh joyni to\'ldiring: "Biz çok mutlu____."',
        contextTr: 'Biz çok mutlu[?].',
        options: ['yuz', 'sunuz', 'yum', 'sun'],
        correctAnswer: 'yuz',
        explanationUz: '"Biz" uchun shaxs qo\'shimchasi "-uz/-yuz" (Biz mutluyuz).',
        points: 10,
      },
      {
        id: 'ex_3_2',
        type: 'multiple_choice',
        promptUz: '"Men charchagan emasman" jumlasining to\'g\'ri turkcha tarjimasi qaysi?',
        options: ['Ben yorgun değilim', 'Ben yorgunum', 'Sen yorgun değilsin', 'O yorgun değil'],
        correctAnswer: 'Ben yorgun değilim',
        explanationUz: 'Inkor uchun "değil" + shaxs qo\'shimchasi "-im" (değilim).',
        points: 10,
      },
    ],
  },
  {
    id: 'a1_unit_4',
    cefrLevel: 'A1',
    unitOrder: 4,
    titleUz: '4. Sodda Gap Qurilishi va Hozirgi Zamon',
    titleTr: 'Sodda Cümle ve Şimdiki Zaman (-iyor)',
    descriptionUz: 'Turk tilida hozirgi davomli zamon (Şimdiki Zaman -iyor) yasash, fe\'l o\'zaklariga qo\'shish va gapdagi so\'z tartibi (Ega + To\'ldiruvchi + Kesim).',
    grammarTitleUz: 'Hozirgi Zamon (-iyor) qoidasi',
    grammarNotesUz: `
1. Turk tilida so'z tartibi:
   Ega + To'ldiruvchi / Hol + Fe'l (Kesim doimo oxirida keladi).
   Masalan: "Ben her gün Türkçe öğreniyorum." (Men har kuni turk tili o'rganyapman).

2. Hozirgi zamon (-iyor) formulasi:
   Fe'l o'zagi + (ı, i, u, ü) + yor + Shaxs qo'shimchasi

   - Gel-mek (kelmoq) -> Gel-i-yor-um (Kelyapman).
   - Gel-i-yor-sun (Kelyapsan).
   - Gel-i-yor (Kelyapti).
   - Gel-i-yor-uz (Kelyapmiz).
   - Gel-i-yor-sunuz (Kelyapsiz).
   - Gel-i-yor-lar (Kelyaptilar).

3. Tovush o'zgarishi:
   - "t" harfi ikkita unli orasida "d" ga aylanadi: Git-mek -> Gid-i-yor (Ketmoq -> Ketyapti).
   - "a" yoki "e" bilan tugagan fe'llarda torayish yuz beradi: Başla-mak -> Başl-ı-yor (Boshlayapti).
    `,
    comparisonWithUzbek: 'O\'zbek tilidagi "-yapti" yoki "-moqda" zamoni aynan turk tilidagi "-iyor" ga tengdir. (Geliyor = Kelyapti, Yapıyor = Qilyapti).',
    estimatedMinutes: 25,
    vocabulary: [
      {
        id: 'v_17',
        tr: 'Gelmek',
        uz: 'Kelmoq',
        exampleTr: 'Yarın bize geliyor musun?',
        exampleUz: 'Ertaga biznikiga kelyapsanmi?',
        category: 'Fe\'llar',
      },
      {
        id: 'v_18',
        tr: 'Gitmek',
        uz: 'Ketmoq, bormoq',
        exampleTr: 'Şimdi okula gidiyorum.',
        exampleUz: 'Hozir maktabga ketyapman.',
        category: 'Fe\'llar',
      },
      {
        id: 'v_19',
        tr: 'Okumak',
        uz: 'O\'qimoq',
        exampleTr: 'Her akşam kitap okuyorum.',
        exampleUz: 'Har oqshom kitob o\'qiyapman.',
        category: 'Fe\'llar',
      },
      {
        id: 'v_20',
        tr: 'Konuşmak',
        uz: 'Gapirmoq, so\'zlashmoq',
        exampleTr: 'Biraz Türkçe konuşuyorum.',
        exampleUz: 'Biroz turkcha gapiryapman.',
        category: 'Fe\'llar',
      },
      {
        id: 'v_21',
        tr: 'Yemek',
        uz: 'Yemoq / Taom',
        exampleTr: 'Lezzetli bir yemek yiyoruz.',
        exampleUz: 'Mazali taom yeyapmiz.',
        category: 'Kundalik',
      },
    ],
    dialogues: [
      { speaker: 'Can', tr: 'Nereye gidiyorsun?', uz: 'Qayerga ketyapsan?' },
      { speaker: 'Sardor', tr: 'Kütüphaneye gidiyorum, ders çalışıyorum.', uz: 'Kutubxonaga ketyapman, dars qilyapman.' },
      { speaker: 'Can', tr: 'Harika, kolay gelsin!', uz: 'Ajoyib, ishlaringga rivoj!' },
    ],
    exercises: [
      {
        id: 'ex_4_1',
        type: 'fill_blank',
        promptUz: '"Men kitob o\'qiyapman" jumlasini to\'ldiring: "Ben kitap oku____."',
        contextTr: 'Ben kitap oku[?].',
        options: ['yorum', 'yorsun', 'yor', 'yoruz'],
        correctAnswer: 'yorum',
        explanationUz: '"Ben" uchun "-yorum" qo\'shiladi (Okuyorum).',
        points: 10,
      },
      {
        id: 'ex_4_2',
        type: 'multiple_choice',
        promptUz: '"Gitmek" fe\'lining hozirgi zamondagi "Sen" shakli qaysi?',
        options: ['Gidiyorsun', 'Gitiyorsun', 'Geliyorsun', 'Gidiyorum'],
        correctAnswer: 'Gidiyorsun',
        explanationUz: '"Git-" o\'zagi unli oldida "Gid-" bo\'ladi va "Gidiyorsun" hosil bo\'ladi.',
        points: 10,
      },
    ],
  },
  {
    id: 'a1_unit_5',
    cefrLevel: 'A1',
    unitOrder: 5,
    titleUz: '5. Sonlar, Soatlar va Vaqt',
    titleTr: 'Sayılar, Saatler ve Zaman',
    descriptionUz: '0 dan 1000 gacha sonlar, haftaning kunlari, oylar va "Saat kaç?" (Soat necha?) savoli bilan vaqtni aytish.',
    grammarTitleUz: 'Vaqt va miqdor ifodalari',
    grammarNotesUz: `
1. Asosiy sonlar (Sayılar):
   0: Sıfır, 1: Bir, 2: İki, 3: Üç, 4: Dört, 5: Beş, 6: Altı, 7: Yedi, 8: Sekiz, 9: Dokuz, 10: On
   20: Yirmi, 30: Otuz, 40: Kırk, 50: Elli, 60: Altmış, 70: Yetmiş, 80: Seksen, 90: Doksan, 100: Yüz, 1000: Bin

2. Hafta kunlari (Günler):
   - Pazartesi (Dushanba), Salı (Seshanba), Çarşamba (Chorshanba), Perşembe (Payshanba),
     Cuma (Juma), Cumartesi (Shanba), Pazar (Yakshanba).

3. Soatni aytish:
   - "Saat kaç?" — Soat necha?
   - "Saat üç" — Soat uch.
   - "Saat üç buçuk" — Soat uch yarim.
   - "Saat kaçta?" — Soat nechada?
    `,
    comparisonWithUzbek: 'Turk tilidagi sonlar o\'zbek tiliga deyarli 95% bir xil: Bir, İki, Üç, Dört (To\'rt), Beş (Besh), Altı (Olti), Yedi (Yetti)...',
    estimatedMinutes: 20,
    vocabulary: [
      {
        id: 'v_22',
        tr: 'Bugün',
        uz: 'Bugun',
        exampleTr: 'Bugün günlerden ne?',
        exampleUz: 'Bugun qaysi kun?',
        category: 'Vaqt',
      },
      {
        id: 'v_23',
        tr: 'Yarın',
        uz: 'Ertaga',
        exampleTr: 'Yarın sabah buluşalım.',
        exampleUz: 'Ertaga ertalab uchrashaylik.',
        category: 'Vaqt',
      },
      {
        id: 'v_24',
        tr: 'Hafta sonu',
        uz: 'Dam olish kunlari (Shanba-Yakshanba)',
        exampleTr: 'Hafta sonu ne yapıyorsun?',
        exampleUz: 'Dam olish kunlarida nima qilyapsan?',
        category: 'Vaqt',
      },
      {
        id: 'v_25',
        tr: 'Buçuk',
        uz: 'Yarim (soatlar uchun)',
        exampleTr: 'Saat iki buçukta buluşacağız.',
        exampleUz: 'Soat ikki yarimda uchrashamiz.',
        category: 'Vaqt',
      },
    ],
    dialogues: [
      { speaker: 'Mijoz', tr: 'Pardon, saat kaç acaba?', uz: 'Kechirasiz, soat necha bo\'ldi ekan?' },
      { speaker: 'O\'tkinchi', tr: 'Saat tam dört buçuk.', uz: 'Soat rosa to\'rt yarim.' },
      { speaker: 'Mijoz', tr: 'Çok teşekkür ederim!', uz: 'Katta rahmat!' },
    ],
    exercises: [
      {
        id: 'ex_5_1',
        type: 'multiple_choice',
        promptUz: '"35" sonining to\'g\'ri turkcha yozilishi qaysi?',
        options: ['Otuz beş', 'Yirmi beş', 'Kırk beş', 'Elli üç'],
        correctAnswer: 'Otuz beş',
        explanationUz: '30 = Otuz, 5 = Beş -> Otuz beş.',
        points: 10,
      },
      {
        id: 'ex_5_2',
        type: 'multiple_choice',
        promptUz: 'Haftaning dushanba kuni turk tilida qanday ataladi?',
        options: ['Pazartesi', 'Cuma', 'Salı', 'Pazar'],
        correctAnswer: 'Pazartesi',
        explanationUz: 'Dushanba — Pazartesi deb nomlanadi.',
        points: 10,
      },
    ],
  },
  {
    id: 'a1_unit_6',
    cefrLevel: 'A1',
    unitOrder: 6,
    titleUz: '6. Kundalik Savollar va Iboralar',
    titleTr: 'Günlük Sorular ve Pratik Kalıplar',
    descriptionUz: 'Restoranda, do\'konda, ko\'chada yo\'l so\'rashda ishlatiladigan eng muhim savol olmoshlari (Ne?, Kim?, Nerede?, Ne kadar?, Kaça?).',
    grammarTitleUz: 'So\'roq olmoshlari va yo\'nalish qo\'shimchalari',
    grammarNotesUz: `
1. Muhim so'roq so'zlari:
   - "Ne?" — Nima? (Bu ne? - Bu nima?)
   - "Kim?" — Kim? (O kim? - U kim?)
   - "Nerede?" — Qayerda? (Hastane nerede? - Kasalxona qayerda?)
   - "Nereye?" — Qayerga? (Nereye gidiyorsun? - Qayerga ketyapsan?)
   - "Nasıl?" — Qanday? / Qalaysiz?
   - "Ne zaman?" — Qachon?
   - "Ne kadar? / Kaç para?" — Qancha? Narxi qancha?

2. Restoran va kafeda:
   - "Bir çay alabilir miyim lütfen?" (Iltimos, bitta choy olsam bo'ladimi?)
   - "Hesap lütfen." (Hisobni keltiring, iltimos).
   - "Kolay gelsin!" (Ishlarga omad, hormang!).
   - "Afiyet olsun!" (Yoqimli ishtaha!).
    `,
    comparisonWithUzbek: '"Ne kadar?" o\'zbek tilidagi "Qancha?", "Afiyet olsun" esa "Yoqimli ishtaha" ma\'nosida kundalik eng sevimli iboralardir.',
    estimatedMinutes: 20,
    vocabulary: [
      {
        id: 'v_26',
        tr: 'Lütfen',
        uz: 'Iltimos',
        exampleTr: 'Bir bardak su lütfen.',
        exampleUz: 'Bir stakan suv, iltimos.',
        category: 'Etiket',
      },
      {
        id: 'v_27',
        tr: 'Hesap',
        uz: 'Hisob-kitob (kafe/restoranda)',
        exampleTr: 'Garson bey, hesap lütfen.',
        exampleUz: 'Ofitsiant janob, hisobni olib kelsangiz.',
        category: 'Kafe',
      },
      {
        id: 'v_28',
        tr: 'Afiyet olsun',
        uz: 'Yoqimli ishtaha',
        exampleTr: 'Yemeğiniz için afiyet olsun!',
        exampleUz: 'Taomingiz uchun yoqimli ishtaha!',
        category: 'Etiket',
      },
      {
        id: 'v_29',
        tr: 'Kolay gelsin',
        uz: 'Ishingiz oson bo\'lsin, hormang',
        exampleTr: 'İyi çalışmalar, kolay gelsin.',
        exampleUz: 'Yaxshi ishlar tilayman, hormang.',
        category: 'Etiket',
      },
      {
        id: 'v_30',
        tr: 'Ne kadar?',
        uz: 'Qancha? Narxi qancha?',
        exampleTr: 'Bu ekmek ne kadar?',
        exampleUz: 'Bu non qancha turadi?',
        category: 'Bozor',
      },
    ],
    dialogues: [
      { speaker: 'Mijoz', tr: 'Pardon bakar mısınız? Bir Türk kahvesi alabilir miyim?', uz: 'Kechirasiz qaray olasizmi? Bitta turk qahvasi olsam bo\'ladimi?' },
      { speaker: 'Ofitsiant', tr: 'Tabii ki efendim, sade mi orta mı?', uz: 'Albatta janob, shakarsizmi yoki o\'rtachami?' },
      { speaker: 'Mijoz', tr: 'Orta şekerli lütfen.', uz: 'O\'rtacha shakarli, iltimos.' },
      { speaker: 'Ofitsiant', tr: 'Hemen getiriyorum, afiyet olsun.', uz: 'Hozir olib kelaman, yoqimli ishtaha.' },
    ],
    exercises: [
      {
        id: 'ex_6_1',
        type: 'multiple_choice',
        promptUz: 'Kafeda ovqatlanib bo\'lgach ofitsiantdan hisobni so\'rash uchun nima deyiladi?',
        options: ['Hesap lütfen', 'Güle güle', 'Günaydın', 'Hoşça kal'],
        correctAnswer: 'Hesap lütfen',
        explanationUz: '"Hesap lütfen" — hisobni bering, iltimos degani.',
        points: 10,
      },
      {
        id: 'ex_6_2',
        type: 'multiple_choice',
        promptUz: 'Kimdir ovqatlanayotganda unga qanday tilak aytiladi?',
        options: ['Afiyet olsun', 'Kolay gelsin', 'Geçmiş olsun', 'Tebrikler'],
        correctAnswer: 'Afiyet olsun',
        explanationUz: '"Afiyet olsun" — yoqimli ishtaha tilagidir.',
        points: 10,
      },
    ],
  },
];

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'sp_1',
    cefrLevel: 'A1',
    titleUz: 'O\'zingizni tanishtiring',
    titleTr: 'Kendini Tanıtma',
    contextUz: 'Yangi do\'stingizga o\'z ismingizni, qayerdan ekanligingizni va xursand bo\'lganingizni ayting.',
    targetSentenceTr: 'Merhaba! Benim adım Sardor, Özbekistanlıyım ve seninle tanıştığıma çok memnun oldum.',
    translationUz: 'Salom! Mening ismim Sardor, O\'zbekistonlikman va sen bilan tanishganimdan juda xursandman.',
    difficulty: 'Oson',
    audioSpeedHint: 0.9,
  },
  {
    id: 'sp_2',
    cefrLevel: 'A1',
    titleUz: 'Kafeda choy va suv buyurtma qiling',
    titleTr: 'Kafede Sipariş Verme',
    contextUz: 'Istanbuldagi kafeda ofitsiantdan bitta issiq turk choyi va bir stakan suv so\'rang.',
    targetSentenceTr: 'Pardon bakar mısınız? Bir bardak sıcak çay ve bir şişe su rica edebilir miyim?',
    translationUz: 'Kechirasiz qaray olasizmi? Bir stakan issiq choy va bir shisha suv iltimos qilsam bo\'ladimi?',
    difficulty: 'Oson',
    audioSpeedHint: 0.95,
  },
  {
    id: 'sp_3',
    cefrLevel: 'A1',
    titleUz: 'Do\'konda narx so\'rash',
    titleTr: 'Markette Fiyat Sorma',
    contextUz: 'Do\'kondordan mevalar narxini va hisobni so\'rang.',
    targetSentenceTr: 'Bu elmaların kilosu ne kadar? İki kilo almak istiyorum.',
    translationUz: 'Bu olmalarning kilosi qancha? Ikki kilo olmoqchiman.',
    difficulty: 'Oson',
    audioSpeedHint: 1.0,
  },
  {
    id: 'sp_4',
    cefrLevel: 'A2',
    titleUz: 'O\'tgan dam olish kunlarini aytib berish',
    titleTr: 'Hafta Sonu Neler Yaptın?',
    contextUz: 'O\'tgan dam olish kunlarida do\'stlaringiz bilan qayerga borganingizni tushuntiring.',
    targetSentenceTr: 'Geçen hafta sonu arkadaşlarımla birlikte Boğaz turuna çıktık ve çok güzel balık yedik.',
    translationUz: 'O\'tgan dam olish kunlarida do\'stlarim bilan birga Bosfor sayohatiga chiqdik va juda mazali baliq yedik.',
    difficulty: "O'rta",
    audioSpeedHint: 1.0,
  },
  {
    id: 'sp_5',
    cefrLevel: 'B1',
    titleUz: 'Kelajak rejalari va maqsadlar',
    titleTr: 'Gelecek Planları ve Hedefler',
    contextUz: 'Turk tilini o\'rganish sabablaringiz va Turkiyadagi ta\'lim rejalaringizni bayon qiling.',
    targetSentenceTr: 'Gelecekte Türkiye\'de yüksek lisans yapmak ve uluslararası bir şirkette çalışmak istiyorum.',
    translationUz: 'Kelajakda Turkiyada magistratura o\'qish va xalqaro kompaniyada ishlashni xohlayman.',
    difficulty: 'Qiyin',
    audioSpeedHint: 1.0,
  },
];

export const WRITING_TASKS: WritingTask[] = [
  {
    id: 'wt_1',
    cefrLevel: 'A1',
    titleUz: 'Mening oilam va do\'stlarim',
    promptTr: 'Aileni ve kendini tanıtan kısa bir metin yaz.',
    instructionsUz: 'O\'zingiz, oilangiz a\'zolari (ota, ona, aka-uka), ularning kasblari va qayerda yashashingiz haqida 30-50 so\'zli qisqa matn yozing.',
    minWords: 30,
  },
  {
    id: 'wt_2',
    cefrLevel: 'A1',
    titleUz: 'Mening bir kunim',
    promptTr: 'Bir gününü sabah kalkışından akşama kadar anlat.',
    instructionsUz: 'Ertalab soat nechada uyg\'onasiz, nima yeysiz, qayerga borasiz va kechqurun nima qilasiz? Hozirgi zamon (-iyor) fe\'llaridan foydalaning.',
    minWords: 40,
  },
  {
    id: 'wt_3',
    cefrLevel: 'A2',
    titleUz: 'Unutilmas sayohatim',
    promptTr: 'Unutamadığın bir seyahatini geçmiş zaman kullanarak anlat.',
    instructionsUz: 'Borgan shahringiz, u yerdagi diqqatga sazovor joylar va taassurotlaringiz haqida o\'tgan zamon (-di) qo\'shimchalari bilan yozing.',
    minWords: 60,
  },
  {
    id: 'wt_4',
    cefrLevel: 'B1',
    titleUz: 'Til o\'rganishning ahamiyati',
    promptTr: 'Yeni bir dil öğrenmenin insana kazandırdığı avantajlar nelerdir?',
    instructionsUz: 'Chet tili o\'rganish qanday imkoniyatlar ochadi? O\'z fikringiz va dalillaringiz bilan 80-120 so\'zli insho tayyorlang.',
    minWords: 80,
  },
];

export const MAHLIYO_SCENARIOS = [
  { id: 'general', titleUz: 'Umumiy Suhbat', titleTr: 'Genel Sohbet', icon: 'Sparkles', descUz: 'Erkin va do\'stona muloqot' },
  { id: 'introductions', titleUz: 'Tanishuv', titleTr: 'Tanışma', icon: 'UserCheck', descUz: 'Ism, kasb, shahar va qiziqishlar' },
  { id: 'restaurant', titleUz: 'Restoran & Kafe', titleTr: 'Restoran & Kafe', icon: 'Coffee', descUz: 'Taom buyurtma qilish, hisob so\'rash' },
  { id: 'shopping', titleUz: 'Bozor & Do\'kon', titleTr: 'Alışveriş', icon: 'ShoppingBag', descUz: 'Kiyim, meva, narx so\'rash va savdolashish' },
  { id: 'travel', titleUz: 'Sayohat & Yo\'nalish', titleTr: 'Seyahat & Yön', icon: 'Compass', descUz: 'Mehmonxona, aeroport, ko\'chada yo\'l so\'rash' },
  { id: 'university', titleUz: 'Universitet & Ta\'lim', titleTr: 'Üniversite', icon: 'GraduationCap', descUz: 'Talabalik hayoti, darslar, imtihonlar' },
  { id: 'job_interview', titleUz: 'Ish Suhbatiga Tayyorgarlik', titleTr: 'İş Görüşmesi', icon: 'Briefcase', descUz: 'Rezyume, tajriba, kuchli tomonlar' },
  { id: 'debate', titleUz: 'Munozara va Fikr Almashish', titleTr: 'Tartışma ve Münazara', icon: 'MessageSquare', descUz: 'Madaniyat, texnologiya, kitoblar haqida bahs' },
];
