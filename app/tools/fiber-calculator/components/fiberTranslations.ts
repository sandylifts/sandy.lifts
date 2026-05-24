/* ─── Fiber Calculator Translations ─────────────────────── */
export type Lang = "en" | "hi";

/* ── UI Strings ── */
export const UI = {
  en: {
    headerTag: "[ BIOMETRIC SYSTEM // NUTRITION INTELLIGENCE ]",
    headerTitle: "Daily Fiber Intelligence",
    headerDesc: "Evidence-based dietary protocols derived from ICMR-NIN 2024 standards. Redefining metabolic, digestive, and hormonal efficiency.",
    tab1: "01 // Warning Signals",
    tab2: "02 // Precision Calculator",
    diagHeading: "\u201cYou might need more fiber if...\u201d",
    diagSubhead: "Your body communicates functional deficiencies through precise biological warnings. Analyze these signals.",
    diagCtaBadge: "[ DIAGNOSTIC DISCOVERY ]",
    diagCtaTitle: "Identified any warning markers?",
    diagCtaDesc: "If you relate to 2 or more of the biological signals above, establish a precision nutritional buffer immediately.",
    diagCtaBtn: "Determine My Calorie-Scaled Fiber Target \u2192",
    sectionYourDetails: "Your Details",
    calLabel: "Daily Calorie Intake (kcal)",
    genderLabel: "Gender",
    condLabel: "Condition",
    ageLabel: "Age Group",
    actLabel: "Activity Level",
    goalLabel: "Primary Goal / Diagnostic Profile",
    calcBtn: "Compute Precision Target \u2192",
    resultsTitle: "Your Fiber Targets",
    dailyTarget: "Daily Target",
    solubleTarget: "Soluble Target",
    insolubleTarget: "Insoluble Target",
    systemGap: "System Gap",
    rampTitle: "4-Week Gut-Adaptation Schedule",
    rampDesc: "Do not force a high fiber load instantly. Intestinal microbiome arrays require incremental steps to build enzyme capacity and eliminate bloating.",
    tipsTitle: "12 Science-Backed Protocols",
    tipsDesc: "Clinical directives to optimize daily fiber efficiency.",
    mythsTitle: "8 Clinical Myths \u2014 Refuted",
    mythsDesc: "Deconstructing popular wellness fallacies with peer-reviewed science.",
    nextStepTitle: "Fiber target set. Now plan your diet break schedule \u2192",
    nextStepDesc: "Find out when to take a strategic break from dieting to beat adaptive thermogenesis.",
    nextStepBtn: "Plan My Diet Break \u2192",
    dontKnow: "Don\u2019t know yours?",
    dontKnowLink: "Calculate maintenance calories first \u2192",
    disclaimer: "Biometrics calculated using ICMR-NIN 2024 and peer-reviewed metabolic literature. Individual results vary. Not medical advice \u2014 consult a qualified practitioner.",
  },
  hi: {
    headerTag: "[ BIOMETRIC SYSTEM // NUTRITION INTELLIGENCE ]",
    headerTitle: "Rozana Fiber Calculator",
    headerDesc: "ICMR-NIN 2024 ke Indian guidelines pe based formula. Apna sahi fiber target jaano aur metabolic, digestive health sudhaaro.",
    tab1: "01 // Warning Signs",
    tab2: "02 // Calculator",
    diagHeading: "\u201cAapko zyada fiber chahiye agar...\u201d",
    diagSubhead: "Aapka body in biological signals se zyada fiber ki zaroorat batata hai. In signals ko samjho.",
    diagCtaBadge: "[ DIAGNOSTIC DISCOVERY ]",
    diagCtaTitle: "Koi warning signal mila?",
    diagCtaDesc: "Agar 2 ya zyada signals aap pe laagu hote hain, toh abhi apna fiber target set karo.",
    diagCtaBtn: "Mera Fiber Target Calculate Karo \u2192",
    sectionYourDetails: "Aapki Details",
    calLabel: "Rozana Calorie Intake (kcal)",
    genderLabel: "Gender",
    condLabel: "Condition",
    ageLabel: "Umar Group",
    actLabel: "Activity Level",
    goalLabel: "Aapka Main Goal",
    calcBtn: "Mera Target Calculate Karo \u2192",
    resultsTitle: "Aapka Fiber Target",
    dailyTarget: "Rozana Target",
    solubleTarget: "Soluble Target",
    insolubleTarget: "Insoluble Target",
    systemGap: "Current Gap",
    rampTitle: "4 Hafte ka Gut Adaptation Plan",
    rampDesc: "Ek din mein high fiber mat shuru karo. Pet ke bacteria ko dheere dheere adjust karne ka time chahiye — warna gas aur bloating hogi.",
    tipsTitle: "12 Science-Based Tips",
    tipsDesc: "Rozana fiber sahi tarike se khaane ke liye proven tips.",
    mythsTitle: "8 Common Galat Fahmiyaan \u2014 Sach",
    mythsDesc: "Popular health myths ko science ke saath tod rahe hain.",
    nextStepTitle: "Fiber target set ho gaya. Ab diet break plan karo \u2192",
    nextStepDesc: "Jaano kab diet se break lena chahiye taaki metabolism slow na ho.",
    nextStepBtn: "Mera Diet Break Plan Karo \u2192",
    dontKnow: "Apni calories nahi pata?",
    dontKnowLink: "Pehle maintenance calories calculate karo \u2192",
    disclaimer: "ICMR-NIN 2024 aur peer-reviewed research pe based calculation. Individual results alag ho sakte hain. Ye medical advice nahi hai \u2014 doctor se zaroor mile.",
  },
} as const;

/* ── Diagnostic Card Text (title, sublabel, desc only) ── */
export type DiagText = { title: string; sublabel: string; desc: string };

export const DIAG_TEXTS_HI: DiagText[] = [
  {
    title: "Khana khane ke thodi der baad phir bhukh lag jaati hai",
    sublabel: "Kam fiber diet mein common",
    desc: "Soluble fiber digestion slow karta hai. Iske bina, khane ke baad blood sugar gir jaati hai aur achanak bhukh lag jaati hai.",
  },
  {
    title: "Digestion slow ya irregular lagti hai",
    sublabel: "Kam fiber diet mein common",
    desc: "Insoluble fiber intestine mein jhadu ki tarah kaam karta hai. Iske bina peristalsis slow ho jaati hai aur transit delay hota hai.",
  },
  {
    title: "Meetha ya packaged food khane ka mann bahut karta hai",
    sublabel: "Kam fiber diet mein common",
    desc: "Fiber ke bina high-sugar food khane se intense insulin spike aata hai aur phir crash — jisse aur zyada craving hoti hai.",
  },
  {
    title: "Poora khana khane ke baad bhi pet nahi bharta",
    sublabel: "Kam fiber diet mein common",
    desc: "Satiety hormones (GLP-1 aur PYY) tab release hote hain jab physical bulk hoti hai. Fiber nahi = satisfied feeling nahi.",
  },
  {
    title: "Meal mein sabzi ya whole food hoti hi nahi",
    sublabel: "Kam fiber diet mein common",
    desc: "Plant ke cell walls ke bina gut bacteria ko prebiotic nahi milta — beneficial short-chain fatty acids kam ban paate hain.",
  },
  {
    title: "Din bhar kafi paani nahi peete",
    sublabel: "Kam fiber diet mein common",
    desc: "Fiber paani absorb karta hai. Bina paani ke fiber dry rehta hai — constipation aur gas hota hai.",
  },
  {
    title: "Khana heavy lagta hai lekin satisfy nahi karta",
    sublabel: "Kam fiber diet mein common",
    desc: "Dense, low-fiber khana stomach mein atka rehta hai — digestive energy zyada lagti hai par satiety hormones activate nahi hote.",
  },
];

/* ── Tips Hinglish ── */
export const TIPS_HI = [
  { category: "Eating", tip: "Fiber Pehle Rule", detail: "Dal ya sabzi pehle khao, baaki baad mein. Same calories mein 15-20% kam khaoge automatically. Fiber se stomach ke stretch receptors trigger hote hain jo satiety signal bhejte hain." },
  { category: "Eating", tip: "Apple, Pear, Gajar ka chilka mat utaaro", detail: "Fruit ki total fiber ka 40% chilke mein hota hai. Apple ka chilka utaarne se uski fiber aadhi reh jaati hai. Achhe se dho aur poora khao." },
  { category: "Eating", tip: "Whole Grain Switch — sabse aasaan upgrade", detail: "Maida roti se whole wheat mein switch karne se har roti mein ~2g extra fiber milti hai. 2 roti/meal = +4g/day — kuch badlay bina." },
  { category: "Eating", tip: "Har hafte alag dal khao", detail: "Masoor, moong, chana, rajma, urad — alag dals alag fiber types dete hain. Variety se gut microbiome diversity measurably badhti hai." },
  { category: "Eating", tip: "Chia Seeds — 5 second fiber hack", detail: "1 tbsp chia dahi ya paani mein daal do = 5g fiber, bina koi cooking, bina taste change. Gut bacteria ka favourite prebiotic food." },
  { category: "Timing", tip: "Khane se 30 min pehle isabgol lo", detail: "Isabgol paani mein khane se 30 min pehle lena total calorie intake ~12% naturally kam karta hai — bina willpower ke early satiety milti hai." },
  { category: "Timing", tip: "Workout ke 2 ghante pehle high fiber mat khao", detail: "Training se pehle high fiber = bloating, gas, mid-workout discomfort. Fiber-heavy meals workout ke baad ya raat ke khaane mein khao." },
  { category: "Hydration", tip: "30ml Rule — sirf follow karo", detail: "Har extra gram fiber ke liye 30ml zyada paani zaroori hai. 12g se 35g jaana = 690ml extra paani daily. Fiber bina paani ke kabz karta hai." },
  { category: "Hydration", tip: "Paani ki kami ke signs pahchano", detail: "Hard stool, bloating, cramps, ya full-but-uncomfortable feeling — ye sab paani ki kami ke signs hain. Pehle paani badhaao, fiber band mat karo." },
  { category: "Special", tip: "IBS mein high-FODMAP fiber avoid karo", detail: "Onion, garlic, apple, wheat high-FODMAP hain aur IBS trigger kar sakte hain. IBS-safe fiber sources: oats, ripe banana, gajar, potato." },
  { category: "Special", tip: "Whole food fiber > supplements hamesha", detail: "Isabgol capsules sirf isolated fiber dete hain. Whole foods (dal, sabzi, fruit) mein fiber ke saath vitamins, minerals, antioxidants bhi hote hain. Clinical studies whole food ko consistently better sabit karte hain." },
  { category: "Special", tip: "Dal aur sabzi zyada mat pakao", detail: "Overcooking se 15-20% fiber nasht ho jaati hai. Thoda firm pakao — texture better aur gut bacteria ko bhi zyada milega." },
];

/* ── Myths Hinglish ── */
export const MYTHS_HI = [
  {
    myth: "\u201c25g mahilaon ke liye, 38g purushon ke liye\u201d \u2014 ye sahi fiber target hai",
    reality: "Ye American guidelines hain, Indian bodies ke liye nahi. ICMR-NIN 2024 calorie-scaled formula use karta hai: 30g per 2000 kcal. 45kg ki Indian woman jo 1400 kcal leti hai use ~21g chahiye, 25g nahi. Flat numbers body size ignore karte hain.",
    tag: "Sabse Common",
  },
  {
    myth: "Fiber supplements utne hi effective hain jitna whole food fiber",
    reality: "Isabgol capsules sirf isolated fiber dete hain. Whole foods (dal, sabzi, fruit) mein fiber ke saath vitamins, minerals, antioxidants bhi hote hain. Clinical studies consistently whole food fiber ko better sabit karte hain.",
    tag: "Common",
  },
  {
    myth: "High fiber diet se bloating aur gas hoti hai",
    reality: "Bloating tab hoti hai jab fiber bahut jaldi badhao. 12g se 35g overnight jaana gut microbiome shock karta hai. 4-hafte ka gradual ramp-up aur sufficient paani se bloating practically zero ho jaati hai.",
    tag: "Common",
  },
  {
    myth: "Fruit juice fiber intake mein count hota hai",
    reality: "Juicing se fruit ki 85-90% fiber khatam ho jaati hai. Poora orange = 3g fiber. Fresh orange juice = 0.3g. Pulp HI fiber hai. Hamesha whole fruit khao.",
    tag: "Dangerous",
  },
  {
    myth: "Brown bread mein high fiber hoti hai",
    reality: "India mein zyada commercial brown breads caramel ya molasses se color ki hoti hain \u2014 actually maida hain. Ingredients check karo: pehla item \u2018whole wheat flour (atta)\u2019 hona chahiye. Agar \u2018enriched wheat flour\u2019 likha hai to wo maida hai.",
    tag: "Common",
  },
  {
    myth: "Fiber sirf digestion aur kabz ke liye kaam karta hai",
    reality: "Fiber ka scope bahut bada hai. Evidence: LDL cholesterol 10-15% kam, T2D risk 20-30% kam, colon cancer risk kam, gut microbiome diversity improve, aur appetite control better hota hai.",
    tag: "Underrated",
  },
  {
    myth: "Athletes ko zyada fiber ki zaroorat nahi \u2014 performance slow hogi",
    reality: "Athletes ko actually MORE fiber chahiye kyunki calorie intake zyada hoti hai. Fiber gut microbiome support karta hai jo recovery ke liye nutrients absorb karta hai. Sirf timing matter karta hai.",
    tag: "Common",
  },
  {
    myth: "Keto / low-carb diet pe enough fiber nahi mil sakta",
    reality: "Grain-free matlab fiber-free nahi. High-fiber low-carb options: avocado (7g/half), flaxseeds (8g/2tbsp), chia seeds (10g/2tbsp), almonds (4g/30g), broccoli (5g/katori). Planning chahiye, par possible hai.",
    tag: "Common",
  },
];

/* ── Activity Options ── */
export const ACTIVITY_DESCS: Record<string, { en: string; hi: string }> = {
  sedentary: { en: "Desk job, no exercise", hi: "Sirf ghar/office kaam, exercise nahi" },
  light: { en: "Walk / yoga, 1\u20133x/wk", hi: "Walk ya yoga, hafte mein 1-3 baar" },
  moderate: { en: "Gym 3\u20135x/week", hi: "Gym 3-5 din hafte mein" },
  athlete: { en: "Training 6x/week+", hi: "Training 6+ din hafte mein" },
};

/* ── Goal Options ── */
export const GOAL_LABELS: Record<string, { en: string; hi: string }> = {
  general: { en: "General Wellness", hi: "General Health" },
  fatloss: { en: "Fat Loss", hi: "Fat Loss" },
  muscle: { en: "Muscle Gain", hi: "Muscle Gain" },
  gut: { en: "Gut Health", hi: "Pet ki Sehat" },
  diabetes: { en: "Diabetes / Pre-diabetic", hi: "Diabetes" },
  cholesterol: { en: "High Cholesterol", hi: "High Cholesterol" },
  constipation: { en: "Constipation", hi: "Kabz" },
};

export const GOAL_DESCS: Record<string, { en: string; hi: string }> = {
  general: { en: "Base target", hi: "Aam target" },
  fatloss: { en: "+3g satiety", hi: "+3g bhukh kam hogi" },
  muscle: { en: "\u22122g, less appetite suppression", hi: "-2g, appetite kam nahi hogi" },
  gut: { en: "+2g prebiotic focus", hi: "+2g prebiotic ke liye" },
  diabetes: { en: "+5g glycemic control", hi: "+5g blood sugar control" },
  cholesterol: { en: "+5g soluble fiber, LDL protocol", hi: "+5g soluble fiber, cholesterol control" },
  constipation: { en: "+3g insoluble focus", hi: "+3g insoluble fiber, kabz ke liye" },
};
