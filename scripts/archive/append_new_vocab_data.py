import json

with open('data/content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. New categories
new_categories = [
    {
        "id": "colors",
        "name_ar": "الألوان",
        "icon": "🎨",
        "description": "إشارات الألوان الأساسية ودلالاتها البصرية الأصيلة في لغة الإشارة المصرية."
    },
    {
        "id": "health",
        "name_ar": "الصحة والطوارئ",
        "icon": "🏥",
        "description": "إشارات الطبيب والمستشفى والإسعاف والأعراض للتواصل العلاجي الدقيق."
    },
    {
        "id": "clothes",
        "name_ar": "الملابس والزينة",
        "icon": "👔",
        "description": "إشارات قطع الثياب اليومية والإكسسوارات ومواضع ارتدائها."
    },
    {
        "id": "expressions",
        "name_ar": "تعبيرات وعبارات يومية",
        "icon": "🤝",
        "description": "جمل وتعبيرات التحية والاستفسار الشائعة في المحادثة المصرية اليومية."
    }
]

existing_cat_ids = {c['id'] for c in data['categories']}
for cat in new_categories:
    if cat['id'] not in existing_cat_ids:
        data['categories'].append(cat)

# 2. 22 New Vocabulary items
new_vocab = [
    # Colors
    {
        "id": "ahmar",
        "word_ar_eg": "أحمر",
        "category_id": "colors",
        "phonological_description": "شكل اليد: السبابة ممتدة. الحركة: تلمس الشفة السفلى وتسحب للأسفل بخفة دلالة على حمرة الشفاه.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ألوان", "يومي"],
        "media_local_path": "assets/signs/sign-ahmar.png"
    },
    {
        "id": "azraq",
        "word_ar_eg": "أزرق",
        "category_id": "colors",
        "phonological_description": "شكل اليد: اليد تشكل حرف C مقلوباً. الحركة: تموج أفقي متصل لمحاكاة زرقة ماء النيل والبحر.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ألوان", "طبيعة"],
        "media_local_path": "assets/signs/sign-azraq.png"
    },
    {
        "id": "asfar",
        "word_ar_eg": "أصفر",
        "category_id": "colors",
        "phonological_description": "شكل اليد: السبابة والوسطى ممتدتان. الحركة: تنقران جانب الوجنة برفق في إشارة لاصفرار الوجه والليمون.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ألوان"],
        "media_local_path": "assets/signs/sign-asfar.png"
    },
    {
        "id": "akhdar",
        "word_ar_eg": "أخضر",
        "category_id": "colors",
        "phonological_description": "شكل اليد: الكف مفتوح للأعلى. الحركة: الارتفاع الرأسي التدريجي لمحاكاة نماء الزرع والنباتات الخضراء.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ألوان", "طبيعة"],
        "media_local_path": "assets/signs/sign-akhdar.png"
    },
    {
        "id": "abyad",
        "word_ar_eg": "أبيض",
        "category_id": "colors",
        "phonological_description": "شكل اليد: كف مسطح مفرود. الحركة: المسح الصاعد المائل فوق الصدر أو مقدمة الأسنان دلالة على البياض والنقاء.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ألوان"],
        "media_local_path": "assets/signs/sign-abyad.png"
    },
    {
        "id": "aswad",
        "word_ar_eg": "أسود",
        "category_id": "colors",
        "phonological_description": "شكل اليد: السبابة ممتدة. الحركة: تتبع خط الحاجب أو منبت الشعر الأسود بحركة أفقية مقوسة.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ألوان"],
        "media_local_path": "assets/signs/sign-aswad.png"
    },
    # Health & Emergency
    {
        "id": "doctor",
        "word_ar_eg": "دكتور / طبيب",
        "category_id": "health",
        "phonological_description": "شكل اليد: سبابة ووسطى اليد المهيمنة. الحركة: جَس نبض معصم اليد الأخرى في محاكاة الفحص الطبي.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["صحة", "مهن"],
        "media_local_path": "assets/signs/sign-doctor.png"
    },
    {
        "id": "mostashfa",
        "word_ar_eg": "مستشفى",
        "category_id": "health",
        "phonological_description": "شكل اليد: السبابة ترسم علامة زائد (+) أو إشارة الصليب/الهلال في الفضاء الإشاري أو على الذراع.",
        "difficulty_level": 2,
        "sign_type": "compound",
        "tags": ["صحة", "أماكن"],
        "media_local_path": "assets/signs/sign-mostashfa.png"
    },
    {
        "id": "taaban",
        "word_ar_eg": "تعبان / مريض",
        "category_id": "health",
        "phonological_description": "شكل اليد: الكف يسترخي ويهبط للأسفل أمام الصدر مع إمالة الرأس وملامح وجه مجهدة.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["صحة", "مشاعر"],
        "media_local_path": "assets/signs/sign-taaban.png"
    },
    {
        "id": "wagaa",
        "word_ar_eg": "وجع / ألم",
        "category_id": "health",
        "phonological_description": "شكل اليد: سبابتان أو قبضتان متقاربتان. الحركة: الارتعاش التناوبي السريع قرب موضع الألم مع تعبير تألم إجباري.",
        "difficulty_level": 2,
        "sign_type": "lexical",
        "tags": ["صحة", "تعبيرات وجه"],
        "media_local_path": "assets/signs/sign-wagaa.png"
    },
    {
        "id": "dawa",
        "word_ar_eg": "دوا (دواء)",
        "category_id": "health",
        "phonological_description": "شكل اليد: الإبهام والسبابة مقروصان لمسك حبة دواء. الحركة: تقريب اليد نحو الفم المفتوح مع حركة بلع خفيفة.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["صحة"],
        "media_local_path": "assets/signs/sign-dawa.png"
    },
    {
        "id": "esaaf",
        "word_ar_eg": "إسعاف",
        "category_id": "health",
        "phonological_description": "شكل اليد: كف مفتوح فوق الرأس. الحركة: الدوران الدائري السريع لمحاكاة صفارة الإسعاف الضوئية المتحركة.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["صحة", "طوارئ"],
        "media_local_path": "assets/signs/sign-esaaf.png"
    },
    # Clothes
    {
        "id": "qamees",
        "word_ar_eg": "قميص",
        "category_id": "clothes",
        "phonological_description": "شكل اليد: الإبهام والسبابة في كلتا اليدين. الحركة: مسك ياقة القميص أو موضع الأزرار والسحب برفق للخارج.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ملابس"],
        "media_local_path": "assets/signs/sign-qamees.png"
    },
    {
        "id": "bantalon",
        "word_ar_eg": "بنطلون",
        "category_id": "clothes",
        "phonological_description": "شكل اليد: الكفان مفرودان يواجهان الساقين. الحركة: الانزلاق الرأسي من الخصر إلى منتصف الفخذين بمحاذاة البنطال.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ملابس"],
        "media_local_path": "assets/signs/sign-bantalon.png"
    },
    {
        "id": "fostan",
        "word_ar_eg": "فستان",
        "category_id": "clothes",
        "phonological_description": "شكل اليد: الكفان مفرودان يبدآن من الخصر. الحركة: الانفراج المائل للأسفل لتجسيد وسع الفستان المتدلي.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ملابس"],
        "media_local_path": "assets/signs/sign-fostan.png"
    },
    {
        "id": "tarha",
        "word_ar_eg": "طرحة / حجاب",
        "category_id": "clothes",
        "phonological_description": "شكل اليد: الكفان مسطحان يحيطان بجانبي الرأس. الحركة: النزول المقوس نحو أسفل الذقن لمحاكاة لف الطرحة المصرية.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ملابس", "ثقافة"],
        "media_local_path": "assets/signs/sign-tarha.png"
    },
    {
        "id": "saaa",
        "word_ar_eg": "ساعة يد",
        "category_id": "clothes",
        "phonological_description": "شكل اليد: السبابة ممتدة. الحركة: النقر مرتين متتاليتين على ظهر معصم اليد الأخرى في موضع الساعة.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["ملابس", "زمن"],
        "media_local_path": "assets/signs/sign-saaa.png"
    },
    # Daily Expressions
    {
        "id": "aamel-eh",
        "word_ar_eg": "عامل إيه؟ / إزيك؟",
        "category_id": "expressions",
        "phonological_description": "شكل اليد: الكفان مفتوحان للأعلى. الحركة: اهتزاز أفقي لطيف للأمام والخلف مع رفع الحاجبين وابتسامة ترحيب.",
        "difficulty_level": 1,
        "sign_type": "question",
        "tags": ["عبارات", "تحيات", "تعبيرات وجه"],
        "media_local_path": "assets/signs/sign-aamel-eh.png"
    },
    {
        "id": "tamam",
        "word_ar_eg": "تمام / كويس / كله بخير",
        "category_id": "expressions",
        "phonological_description": "شكل اليد: قبضة يد مع فرد الإبهام للأعلى باستقامة. الحركة: رفعة توكيدية واثقة للأعلى مع إيماءة رأس بالموافقة.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["عبارات", "تأكيد"],
        "media_local_path": "assets/signs/sign-tamam.png"
    },
    {
        "id": "alhamdulillah",
        "word_ar_eg": "الحمد لله",
        "category_id": "expressions",
        "phonological_description": "شكل اليد: كف مسطح خاشع. الحركة: يلمس الجبهة ثم ينزل ليستقر فوق القلب تعبيراً عن الشكر والرضا العميق.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["عبارات", "ثقافة"],
        "media_local_path": "assets/signs/sign-alhamdulillah.png"
    },
    {
        "id": "mesh-faahem",
        "word_ar_eg": "مش فاهم / مافهمتش",
        "category_id": "expressions",
        "phonological_description": "شكل اليد: السبابة تلمس الصدغ ثم تنفض للخارج في حركة نفي مع هزة رأس جانبية ونظرة استفسار.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["عبارات", "تواصل"],
        "media_local_path": "assets/signs/sign-mesh-faahem.png"
    },
    {
        "id": "wahda-wahda",
        "word_ar_eg": "واحدة واحدة / براحة",
        "category_id": "expressions",
        "phonological_description": "شكل اليد: السبابة ممتدة للأمام لأسفل. الحركة: نبضتان متتاليتان هادئتان للأسفل تدعوان للتمهل والتريث.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["عبارات", "تواصل"],
        "media_local_path": "assets/signs/sign-wahda-wahda.png"
    }
]

existing_vocab_ids = {v['id'] for v in data['vocabulary']}
added_count = 0
for v in new_vocab:
    if v['id'] not in existing_vocab_ids:
        data['vocabulary'].append(v)
        added_count += 1

with open('data/content.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {added_count} new vocabulary signs. Total vocabulary now: {len(data['vocabulary'])}")
