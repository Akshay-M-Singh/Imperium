# AR Copy Review Sheet

> All Arabic copy on /ar is a machine-assisted MSA draft, not native-reviewed. Before AR launch: (1) native Arabic speaker (Gulf market register) reviews and corrects every row; (2) Sofia signs off on the corrected copy; (3) corrections are applied to the `ar` keys in `src/data/*.ts`. The privacy policy additionally needs professional legal translation. Until then the site remains noindex, so shipping drafts to the staging URL is acceptable.

Every row below is sourced directly from the current `src/data/*.ts` files on `feat/arabic-version` (Tasks 5–13). Brand names (Imperium, Tessuti Italiani, Pezzi Unici, Ospitalità di Lusso), the founder's name (Sofia Mazza), and email/Instagram handle stay in Latin script by design and are not review items — they're listed for completeness where they appear inline with copy that does need review.

---

## 1. Navigation (`src/data/navigation.ts`)

| English source              | Arabic draft  |
| --------------------------- | ------------- |
| Fabrics                     | الأقمشة       |
| About                       | من نحن        |
| Contact                     | تواصل معنا    |
| Request Samples (CTA label) | اطلب العيّنات |
| Language toggle: EN         | EN            |
| Language toggle: AR         | AR            |

## 2. UI / Chrome (`src/data/ui.ts` — nav aria labels, footer)

| English source                                         | Arabic draft                                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Primary (nav landmark aria-label)                      | التنقل الرئيسي                                                                       |
| Imperium Italian Textile — home (logo link aria-label) | إمبريوم للأقمشة الإيطالية — الصفحة الرئيسية                                          |
| Open menu                                              | افتح القائمة                                                                         |
| Close menu                                             | أغلق القائمة                                                                         |
| Chat on WhatsApp (mobile overlay)                      | تحدّث معنا عبر واتساب                                                                |
| Switch to English                                      | Switch to English _(intentionally kept in English — label targets EN-reading users)_ |
| Switch to Arabic                                       | التبديل إلى العربية                                                                  |
| Footer (landmark aria-label)                           | روابط تذييل الصفحة                                                                   |
| All rights reserved.                                   | جميع الحقوق محفوظة.                                                                  |
| Privacy Policy                                         | سياسة الخصوصية                                                                       |
| WhatsApp                                               | واتساب                                                                               |

## 3. Hero (`src/data/ui.ts` — `ui.hero`)

| English source                                            | Arabic draft                         |
| --------------------------------------------------------- | ------------------------------------ |
| Made in Italy (eyebrow)                                   | صُنِع في إيطاليا                     |
| Premium Italian fabrics · Delivered to the Gulf (tagline) | أقمشة إيطالية فاخرة · تصل إلى الخليج |
| Explore our fabrics (primary CTA)                         | اكتشف أقمشتنا                        |
| Request a sample (secondary CTA)                          | اطلب عيّنة                           |

Note: the hero wordmark itself ("IMPERIUM / ITALIAN TEXTILE") renders as a static logo/typographic mark and is not locale-keyed — same image/text in both locales by design.

## 4. Stats (`src/data/stats.ts`)

| English source        | Arabic draft       |
| --------------------- | ------------------ |
| 40+ Fabrics           | +40 من الأقمشة     |
| 4 Curated collections | 4 مجموعات مختارة   |
| 100% Italian fabrics  | %100 أقمشة إيطالية |

Note: `CountUp` renders the numeral itself (40, 4, 100) unlocalized (Western Arabic numerals in both locales); only the `label` and `suffix` strings above are translated copy. Confirm with the native reviewer whether Eastern Arabic-Indic numerals (٤٠+ etc.) are preferred for the Gulf register — current draft keeps Western numerals for consistency with prices/dates elsewhere.

## 5. Collections (`src/data/collections.ts` + `collectionsSection`)

### Section header

| English source                                                                               | Arabic draft                                                             |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Our collections (eyebrow)                                                                    | مجموعاتنا                                                                |
| Fabric with a story. (headline)                                                              | أقمشة تحمل قصة.                                                          |
| Collection panels (carousel aria-label)                                                      | لوحات المجموعات                                                          |
| Four curated collections — each one a different way of working with Italian craft. (subline) | أربع مجموعات مختارة — كل واحدة طريقة مختلفة للتعامل مع الحرفة الإيطالية. |

### Tessuti Italiani

| English source                                                                                                                                            | Arabic draft                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| LINEN / SILK / WOOL / COTTON (tags)                                                                                                                       | كتان / حرير / صوف / قطن                                                                                |
| For those who don't compromise. (tagline)                                                                                                                 | لمن لا يقبلون الحلول الوسط.                                                                            |
| The foundation of the house: linens, silks, wools and cottons sourced from Italian mills we know by name. Fabric for work that carries your label. (body) | أساس الدار: كتان وحرير وصوف وقطن من مصانع نسيج إيطالية نعرفها بالاسم. أقمشة لأعمال تحمل علامتك الخاصة. |
| Contact Us Now (CTA)                                                                                                                                      | تواصل معنا الآن                                                                                        |
| Draped Italian jacquard in warm rose and gold, with a fringed selvedge and a black Made in Italy label. (image alt)                                       | قماش جاكار إيطالي منسدل بلونَي الورد الدافئ والذهبي، مع حاشية مهدّبة وبطاقة سوداء «صُنِع في إيطاليا».  |

### Pezzi Unici

| English source                                                                                                         | Arabic draft                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| RARE / LIMITED / ONE OF A KIND (tags)                                                                                  | نادر / إصدار محدود / فريد                                                                            |
| Rare, limited, one of a kind. (tagline — 🟡 team-derived, no client-supplied tagline for this card)                    | نادرة، محدودة، فريدة من نوعها.                                                                       |
| Small runs, discontinued weaves, single bolts. When a piece is gone, it is gone — which is precisely the point. (body) | كميات صغيرة، ونسجات أُوقف إنتاجها، ولفّات وحيدة. حين تنفد القطعة فلن تعود — وهذا هو المقصود تحديدًا. |
| Contact Us Now (CTA)                                                                                                   | تواصل معنا الآن                                                                                      |
| Gold and midnight-blue floral brocade with a Limited Edition 01 of 50 card. (image alt)                                | بروكار مزهر بالذهبي والأزرق الليلي مع بطاقة إصدار محدود 01 من 50.                                    |

### Ospitalità di Lusso

| English source                                                                                                                  | Arabic draft                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| HOSPITALITY / BESPOKE (tags)                                                                                                    | ضيافة / حسب الطلب                                                                                                          |
| Breathability, durability, and quality. (tagline)                                                                               | تهوية ومتانة وجودة.                                                                                                        |
| Contract-grade fabric for hotels, resorts and restaurants that refuse to look like it. Specified with you, sampled fast. (body) | أقمشة بمواصفات تعاقدية للفنادق والمنتجعات والمطاعم التي ترفض أن يبدو ذلك عليها. نحدّد المواصفات معك، ونرسل العيّنات بسرعة. |
| Contact Us Now (CTA)                                                                                                            | تواصل معنا الآن                                                                                                            |
| Tailored taupe and black jackets with gold piping on Imperium-branded wooden hangers. (image alt)                               | سترات مفصّلة بدرجات الرمادي الداكن والأسود مع حواف ذهبية على علّاقات خشبية تحمل شعار إمبريوم.                              |

### Interior & Exterior Design

| English source                                                                                                                                                                     | Arabic draft                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| INTERIOR / EXTERIOR / CONTRACT (tags)                                                                                                                                              | داخلي / خارجي / تعاقدي                                                                                                                        |
| Interior & Exterior Design (title — only collection title translated; others are proper/brand names kept in Latin)                                                                 | تصميم داخلي وخارجي                                                                                                                            |
| Timeless design, durability, and versatility. (tagline)                                                                                                                            | تصميم خالد ومتانة وتعدّد استخدامات.                                                                                                           |
| Premium Italian textiles designed for sophisticated interior and exterior spaces, bringing timeless craftsmanship to residential, commercial, and hospitality environments. (body) | منسوجات إيطالية فاخرة مصمّمة للمساحات الداخلية والخارجية الراقية، تنقل الحرفية الإيطالية الخالدة إلى البيئات السكنية والتجارية وقطاع الضيافة. |
| Contact Us Now (CTA)                                                                                                                                                               | تواصل معنا الآن                                                                                                                               |
| Layered neutral Italian textiles in cream and taupe beside an olive branch. (image alt)                                                                                            | طبقات من المنسوجات الإيطالية بدرجات محايدة من الكريمي والبيج إلى جانب غصن زيتون.                                                              |

## 6. WhyImperium (`src/data/pillars.ts`)

| English source                                                                                                                                                                                                | Arabic draft                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Why Imperium (eyebrow)                                                                                                                                                                                        | لماذا إمبريوم                                                                                                                                                |
| Not just fabric. A guarantee of origin. (headline)                                                                                                                                                            | ليست مجرد أقمشة، بل ضمان للمنشأ.                                                                                                                             |
| Illustrated route map from Italy to the UAE and the Gulf (`mapAlt` — media alt text, item 01)                                                                                                                 | خريطة توضيحية لمسار الشحن من إيطاليا إلى الإمارات والخليج                                                                                                    |
| 100% Made in Italy certification stamp (`stampAlt` — media alt text, item 02)                                                                                                                                 | ختم شهادة صُنِع في إيطاليا 100%                                                                                                                              |
| Direct From the Source (item 01 heading)                                                                                                                                                                      | من المصدر مباشرة                                                                                                                                             |
| We buy from the mills, not from middlemen — and we visit them. Every collection begins in Italy, in conversations on factory floors with the people who weave what we sell. (item 01, ¶1)                     | نشتري من المصانع لا من الوسطاء — ونزورها بأنفسنا. كل مجموعة تبدأ في إيطاليا، من حوارات في صالات الإنتاج مع من ينسجون ما نبيعه.                               |
| From those mills, fabric travels one route: Italy to the UAE and across the Gulf. One partner, one chain of custody, nothing anonymous between the loom and your project. (item 01, ¶2)                       | من تلك المصانع يسلك القماش طريقًا واحدًا: من إيطاليا إلى الإمارات وعبر الخليج. شريك واحد، وسلسلة عهدة واحدة، ولا شيء مجهول بين النول ومشروعك.                |
| Made in Italy Expertise (item 02 heading)                                                                                                                                                                     | خبرة معتمدة في «صُنِع في إيطاليا»                                                                                                                            |
| Imperium is led by a certified Made in Italy expert. Provenance here is not a label claim — it is a discipline: verifying where a fabric is made, how, and by whom, before it ever reaches you. (item 02, ¶1) | تقود إمبريوم خبيرة معتمدة في «صُنِع في إيطاليا». المنشأ هنا ليس ادعاءً على بطاقة — بل منهج عمل: نتحقق من مكان صناعة القماش وطريقتها وصانعها قبل أن يصل إليك. |
| For the Gulf's Luxury Market (item 03 heading)                                                                                                                                                                | لسوق الفخامة في الخليج                                                                                                                                       |
| Based in Dubai, serving the Gulf's luxury market. We understand the region's pace, climate and standard of finish — and we bring Italian craftsmanship that answers all three. (item 03, ¶1)                  | من دبي، نخدم سوق الفخامة في الخليج. نفهم إيقاع المنطقة ومناخها ومعاييرها في الإتقان — ونقدّم حرفية إيطالية تلبّي الثلاثة معًا.                               |
| And with no one in between, that provenance comes with an edge — sourcing direct keeps us genuinely competitive. _(added 2026-07-16, item 01 ¶2 closing sentence)_                                            | ولأن لا وسيط بيننا وبين المصانع، يتحول هذا المنشأ إلى أفضلية — فالتوريد المباشر يجعلنا في موقع تنافسي حقيقي.                                                 |

## 7. Founder (`src/data/founder.ts`)

| English source                                                                                                                                                                                                                                                                                                                            | Arabic draft                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The story behind Imperium (eyebrow)                                                                                                                                                                                                                                                                                                       | القصة وراء إمبريوم                                                                                                                                                                                                                                                            |
| Proudly Italian. Purposefully Global. (headline)                                                                                                                                                                                                                                                                                          | إيطالية بفخر. عالمية عن قصد.                                                                                                                                                                                                                                                  |
| Born and raised in Italy, Sofia Mazza is an Italian entrepreneur with a legal and business background and a certified Made in Italy expert. Now based in Dubai, she founded Imperium to create a direct bridge between Italy's finest textile manufacturers and the Gulf's most discerning designers, architects and fashion houses. (¶1) | وُلدت صوفيا ماتزا ونشأت في إيطاليا، وهي رائدة أعمال إيطالية بخلفية قانونية وتجارية، وخبيرة معتمدة في «صُنِع في إيطاليا». تقيم اليوم في دبي، وقد أسّست إمبريوم لتقيم جسرًا مباشرًا بين أرقى مصانع النسيج الإيطالية وأكثر المصمّمين والمعماريين ودور الأزياء تميّزًا في الخليج. |
| Deeply proud of her heritage, Sofia believes that authentic Italian craftsmanship deserves to be represented with the same integrity with which it is created. She personally travels across Italy to meet mills, evaluate collections and build long-term relationships with manufacturers whose values reflect her own. (¶2)            | انطلاقًا من اعتزازها العميق بإرثها، تؤمن صوفيا بأن الحرفية الإيطالية الأصيلة تستحق أن تُمثَّل بالنزاهة نفسها التي صُنعت بها. تسافر بنفسها عبر إيطاليا للقاء المصانع وتقييم المجموعات وبناء علاقات طويلة الأمد مع صنّاع تعكس قيمُهم قيمَها.                                    |
| Imperium is more than a textile supplier. It's a carefully curated expression of Italian excellence. (¶3)                                                                                                                                                                                                                                 | إمبريوم أكثر من مورّد أقمشة؛ إنها تعبير منتقى بعناية عن التميّز الإيطالي.                                                                                                                                                                                                     |
| Sofia Mazza, Founder of Imperium Italian Textile (portrait alt)                                                                                                                                                                                                                                                                           | صوفيا ماتزا، مؤسِّسة إمبريوم للأقمشة الإيطالية                                                                                                                                                                                                                                |
| Sofia Mazza, Founder (portrait caption)                                                                                                                                                                                                                                                                                                   | صوفيا ماتزا، المؤسِّسة                                                                                                                                                                                                                                                        |
| Every fabric I select represents not only Italian craftsmanship, but my own commitment to excellence. (pull-quote)                                                                                                                                                                                                                        | كل قماش أختاره لا يجسّد الحرفية الإيطالية فحسب، بل التزامي الشخصي بالتميّز أيضًا.                                                                                                                                                                                             |
| Sofia Mazza, Founder (quote attribution)                                                                                                                                                                                                                                                                                                  | صوفيا ماتزا، المؤسِّسة                                                                                                                                                                                                                                                        |
| Made in Italy Certification (certification caption)                                                                                                                                                                                                                                                                                       | شهادة «صُنِع في إيطاليا»                                                                                                                                                                                                                                                      |
| **Image to follow** (`certificationPlaceholderLabel` — fallback shown only if `certification.src` is ever null again)                                                                                                                                                                                                                     | **الصورة قادمة قريبًا**                                                                                                                                                                                                                                                       |

> The certification scan itself (`/images/certifications/made-in-italy-certification.png`) contains real client-issued document text in Italian/English (visible DOB and issue date) and is integrated as an image, not translated copy — out of scope for this sheet. Per `CLAUDE.md` §7 item 4, Sofia's explicit OK on the visible DOB/issue date is separately recommended before launch.

## 8. Contact (`src/data/contact.ts`)

| English source                                                                                       | Arabic draft                                                                 |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Contact (eyebrow)                                                                                    | تواصل                                                                        |
| Let's talk fabric. (headline)                                                                        | لنتحدث عن الأقمشة.                                                           |
| Tell us what you're making. We'll bring samples, prices and timelines to the conversation. (subline) | أخبرنا بما تصنعه، وسنأتي إلى الحوار بالعيّنات والأسعار والجداول الزمنية.     |
| Dubai, UAE · Italy (location)                                                                        | دبي، الإمارات العربية المتحدة · إيطاليا                                      |
| Chat on WhatsApp (button label)                                                                      | تحدّث معنا عبر واتساب                                                        |
| Hello Imperium — I'd like to ask about fabrics. (WhatsApp prefill text)                              | مرحبًا إمبريوم — أودّ الاستفسار عن الأقمشة.                                  |
| We use your details only to respond to your inquiry. See our (consent, before-link)                  | نستخدم بياناتك للرد على استفسارك فقط. راجع                                   |
| Privacy Policy (consent link label)                                                                  | سياسة الخصوصية                                                               |
| . (consent, after-link)                                                                              | .                                                                            |
| We respond within one business day. (form note)                                                      | نردّ خلال يوم عمل واحد.                                                      |
| Sending… (loading state)                                                                             | جارٍ الإرسال…                                                                |
| Thank you. We'll be in touch shortly. (success state)                                                | شكرًا لك. سنتواصل معك قريبًا.                                                |
| Something went wrong. Please try WhatsApp or email us directly. (error state)                        | حدث خطأ ما. يُرجى المحاولة عبر واتساب أو مراسلتنا مباشرة بالبريد الإلكتروني. |
| **Send inquiry** (`submitLabel` — submit button)                                                     | **إرسال الاستفسار**                                                          |
| Email Us (email button label)                                                                        | راسلنا عبر البريد الإلكتروني                                                 |
| Fabric inquiry — Imperium Italian Textile (email subject prefill)                                    | استفسار عن الأقمشة — Imperium Italian Textile                                |

### Validation messages

| English source                                               | Arabic draft                                   |
| ------------------------------------------------------------ | ---------------------------------------------- |
| Please enter your name.                                      | يُرجى إدخال اسمك.                              |
| Please enter your email.                                     | يُرجى إدخال بريدك الإلكتروني.                  |
| Please enter a valid email address.                          | يُرجى إدخال بريد إلكتروني صالح.                |
| Company name is too long.                                    | اسم الشركة طويل جدًا.                          |
| Please enter a valid phone number.                           | يُرجى إدخال رقم هاتف صالح.                     |
| Please select your role.                                     | يُرجى اختيار مجال عملك.                        |
| Please select a valid role.                                  | يُرجى اختيار مجال عمل صالح.                    |
| Please tell us about your project.                           | يُرجى إخبارنا عن مشروعك.                       |
| Please write at least 10 characters.                         | يُرجى كتابة 10 أحرف على الأقل.                 |
| Please tell us more about your project (10–5000 characters). | يُرجى إخبارنا بالمزيد عن مشروعك (10–5000 حرف). |
| Please check the highlighted fields.                         | يُرجى مراجعة الحقول المحدّدة.                  |
| Please take a moment before submitting.                      | يُرجى الانتظار لحظة قبل الإرسال.               |
| Submitted too quickly.                                       | تم الإرسال بسرعة كبيرة.                        |
| Too many submissions. Please try again later.                | عدد كبير من المحاولات. يُرجى المحاولة لاحقًا.  |
| Thank you                                                    | شكرًا لك                                       |

### Form field labels

| English source             | Arabic draft      |
| -------------------------- | ----------------- |
| Your name                  | الاسم             |
| Email                      | البريد الإلكتروني |
| Company                    | الشركة            |
| Phone / WhatsApp           | الهاتف / واتساب   |
| Your role                  | مجال عملك         |
| Tailor                     | خيّاط             |
| Hospitality group          | مجموعة ضيافة      |
| Designer                   | مصمّم             |
| Other                      | غير ذلك           |
| Tell us about your project | حدّثنا عن مشروعك  |

## 9. SEO (`src/data/seo.ts`)

| English source                                                                                                                                                           | Arabic draft                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Imperium Italian Textile — Premium Italian Fabrics, Delivered to the Gulf (home `<title>`)                                                                               | إمبريوم للأقمشة الإيطالية — أقمشة إيطالية فاخرة تصل إلى الخليج                                                             |
| Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups. (home meta description) | أقمشة إيطالية فاخرة من أرقى مصانع النسيج في إيطاليا، تصل إلى أكثر الخيّاطين والمصمّمين ومجموعات الضيافة تميّزًا في الخليج. |
| Imperium Italian Textile (home OG title)                                                                                                                                 | إمبريوم للأقمشة الإيطالية                                                                                                  |
| Premium Italian fabrics sourced from the finest mills of Italy. (home OG description)                                                                                    | أقمشة إيطالية فاخرة من أرقى مصانع النسيج في إيطاليا.                                                                       |
| About — Sofia Mazza, Founder (about `<title>`)                                                                                                                           | من نحن — صوفيا ماتزا، المؤسِّسة                                                                                            |
| The story behind Imperium Italian Textile. (about meta description)                                                                                                      | القصة وراء إمبريوم للأقمشة الإيطالية.                                                                                      |
| Contact (contact `<title>`)                                                                                                                                              | تواصل معنا                                                                                                                 |
| Request Italian fabric samples or talk to us about your project. (contact meta description)                                                                              | اطلب عيّنات من الأقمشة الإيطالية أو حدّثنا عن مشروعك.                                                                      |

Canonical paths (`/`, `/ar`, `/about`, `/ar/about`, `/contact`, `/ar/contact`) are structural, not copy, and are out of scope for translation review.

---

## Fields added during review fix-cycles (beyond the original plan schema)

These four fields were added to the data model during Tasks 7–11's review passes and are fully included in the tables above — flagged here again so the reviewer doesn't skip them as "not in the original spec":

1. `collectionsSection[locale].subline` — Task 7 fix. See §5, Section header.
2. `whyImperium[locale].mapAlt` / `.stampAlt` — Task 8 fix. See §6, first two rows.
3. `founder[locale].certificationPlaceholderLabel` — Task 9. See §7, last row.
4. `contact[locale].submitLabel` — Task 11. See §8, bolded row.

## Out of scope for this sheet

- **Privacy Policy** (`/privacy`) — currently English-only inside an LTR island by design (per the plan's judgment calls); needs a **separate professional legal translation** pass, not native-speaker copy review, before any AR privacy page ships.
- **Testimonials** — data file is an empty array; the component renders `null`. No AR strings exist yet; revisit once a real quote is collected.
- **`/about` and `/contact` standalone routes** — still one-line stubs per `CLAUDE.md` §3; not localized because they're not real pages yet.
