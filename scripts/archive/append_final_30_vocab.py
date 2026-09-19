import json

with open('data/content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Add questions category
existing_cat_ids = {c['id'] for c in data['categories']}
if 'questions' not in existing_cat_ids:
    data['categories'].append({
        "id": "questions",
        "name_ar": "الأسئلة والاستفسارات",
        "icon": "❓",
        "description": "أدوات الاستفهام الأساسية وإشارات الإجابة والتأكيد والنفي في لغة الإشارة المصرية."
    })

# 2. Update 'eh' category if present
for v in data['vocabulary']:
    if v['id'] == 'eh':
        v['category_id'] = 'questions'
        if 'أسئلة' not in v['tags']:
            v['tags'].append('أسئلة')

# 3. 30 New vocabulary entries
new_entries = [
    # Questions & Answers
    {
        "id": "feen",
        "word_ar_eg": "أين / فين؟",
        "category_id": "questions",
        "phonological_description": "شكل اليد: اليدان مفتوحتان والراحتان للأعلى. الحركة: تأرجح طفيف ومتكرر للراحتين يميناً ويساراً مع رفع الحاجبين واستفسار الوجه الأصيل في لغة الإشارة المصرية.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["أسئلة", "يومي", "حوار"],
        "media_local_path": "assets/signs/sign-feen.png"
    },
    {
        "id": "emta",
        "word_ar_eg": "متى / إمتى؟",
        "category_id": "questions",
        "phonological_description": "شكل اليد: السبابة تشير وتدور بحركة دائرية صغيرة عند المعصم. الحركة: إشارة دائرية سريعة نحو موضع الساعة تعبيراً عن التوقيت.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["أسئلة", "وقت", "يومي"],
        "media_local_path": "assets/signs/sign-emta.png"
    },
    {
        "id": "leh",
        "word_ar_eg": "لماذا / ليه؟",
        "category_id": "questions",
        "phonological_description": "شكل اليد: راحة اليد متجهة نحو الصدر ثم تفتح للأمام بحركة مفاجئة مع ضم الحاجبين وتعبير استفسار تعجبي.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["أسئلة", "حوار", "يومي"],
        "media_local_path": "assets/signs/sign-leh.png"
    },
    {
        "id": "meen",
        "word_ar_eg": "من / مين؟",
        "category_id": "questions",
        "phonological_description": "شكل اليد: السبابة تهتز بحركة دائرية صغيرة بجانب الفم أو الصدغ مع زم الشفاه واستفسار بصري.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["أسئلة", "أشخاص"],
        "media_local_path": "assets/signs/sign-meen.png"
    },
    {
        "id": "kam",
        "word_ar_eg": "كم / كام؟",
        "category_id": "questions",
        "phonological_description": "شكل اليد: أصابع اليدين تنفتح متتابعة للأعلى مثل العد السريع مع تقطيب الجبين.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["أسئلة", "أرقام", "كمية"],
        "media_local_path": "assets/signs/sign-kam.png"
    },
    {
        "id": "aiwa",
        "word_ar_eg": "أيوة / نعم",
        "category_id": "questions",
        "phonological_description": "شكل اليد: قبضة اليد مضمومة وتهتز للأعلى والأسفل بحركة إيمائية مثل إيماءة الرأس الدالة على الموافقة التامة.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["إجابات", "تأكيد", "يومي"],
        "media_local_path": "assets/signs/sign-aiwa.png"
    },
    {
        "id": "laa",
        "word_ar_eg": "لا / رفض",
        "category_id": "questions",
        "phonological_description": "شكل اليد: السبابة ممتدة رأسياً وتتحرك يميناً ويساراً بحزم مع هز الرأس نفياً.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["إجابات", "نفي", "يومي"],
        "media_local_path": "assets/signs/sign-laa.png"
    },

    # Food & Kitchen
    {
        "id": "qahwa",
        "word_ar_eg": "قهوة",
        "category_id": "food",
        "phonological_description": "شكل اليد: قبضة يد فوق قبضة يد أخرى تدور بحركة طحن البن التقليدية مع ارتشاف الفنجان بحركة الأصابع.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["مشروبات", "مطبخ", "يومي"],
        "media_local_path": "assets/signs/sign-qahwa.png"
    },
    {
        "id": "laban",
        "word_ar_eg": "لبن / حليب",
        "category_id": "food",
        "phonological_description": "شكل اليد: قبضة يد تفتح وتغلق بحركة هابطة مرتين لمحاكاة حلب الحليب الصافي.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["مشروبات", "طعام", "صحة"],
        "media_local_path": "assets/signs/sign-laban.png"
    },
    {
        "id": "sukkar",
        "word_ar_eg": "سكر",
        "category_id": "food",
        "phonological_description": "شكل اليد: أطراف أصابع السبابة والوسطى تفرك جانبي الذقن أو زاوية الفم إشارة إلى الحلاوة والتحلية.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["طعام", "مطبخ", "مذاق"],
        "media_local_path": "assets/signs/sign-sukkar.png"
    },
    {
        "id": "mattebakh",
        "word_ar_eg": "مطبخ",
        "category_id": "food",
        "phonological_description": "شكل اليد: راحة يد مسطحة تمثل المقلاة واليد الأخرى تقلب محتويات الطعام بحركة دائرية نشطة.",
        "difficulty_level": 2,
        "sign_type": "compound",
        "tags": ["بيت", "مطبخ", "طعام"],
        "media_local_path": "assets/signs/sign-mattebakh.png"
    },
    {
        "id": "malh",
        "word_ar_eg": "ملح",
        "category_id": "food",
        "phonological_description": "شكل اليد: أطراف الإبهام والسبابة والوسطى تفرك معاً فوق راحة اليد بحركة رش ذرات الملح.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["طعام", "مطبخ", "توابل"],
        "media_local_path": "assets/signs/sign-malh.png"
    },

    # Family
    {
        "id": "gadda",
        "word_ar_eg": "جدة",
        "category_id": "family",
        "phonological_description": "شكل اليد: اليد تشير للذقن (علامة الأنوثة) ثم ترسم حركة حنونة مقوسة للأمام للدلالة على الجيل الأكبر سناً.",
        "difficulty_level": 1,
        "sign_type": "compound",
        "tags": ["عائلة", "أقارب", "احترام"],
        "media_local_path": "assets/signs/sign-gadda.png"
    },
    {
        "id": "walad",
        "word_ar_eg": "ولد / ابن",
        "category_id": "family",
        "phonological_description": "شكل اليد: اليد ممتدة عند الجبين بحركة أفقية ترمز لحافة غطاء الرأس ثم تنزل لتحديد قامة الصبي.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["عائلة", "أشخاص"],
        "media_local_path": "assets/signs/sign-walad.png"
    },
    {
        "id": "bent",
        "word_ar_eg": "بنت / ابنة",
        "category_id": "family",
        "phonological_description": "شكل اليد: الإبهام يمر على جانب الخد بنعومة من الأذن إلى زاوية الشفاه (علامة الحلي/القرط) دلالة على الفتاة.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["عائلة", "أشخاص"],
        "media_local_path": "assets/signs/sign-bent.png"
    },
    {
        "id": "tifl",
        "word_ar_eg": "طفل / رضيع",
        "category_id": "family",
        "phonological_description": "شكل اليد: الذراعان مثنيتان تضم هدهدة رضيع وتحريكه برقة بين اليدين.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["عائلة", "طفولة"],
        "media_local_path": "assets/signs/sign-tifl.png"
    },
    {
        "id": "aela",
        "word_ar_eg": "عائلة / أسرة",
        "category_id": "family",
        "phonological_description": "شكل اليد: اليدان تشكلان دائرة متصلة تبدأ من الإبهامين وتنتهي بالخنصرين، دلالة على تماسك الأسرة والبيت الواحد.",
        "difficulty_level": 2,
        "sign_type": "iconic",
        "tags": ["عائلة", "مجتمع", "رابطة"],
        "media_local_path": "assets/signs/sign-aela.png"
    },

    # Home
    {
        "id": "kursi",
        "word_ar_eg": "كرسي / جلوس",
        "category_id": "home",
        "phonological_description": "شكل اليد: إصبعان مثنيان من اليد اليمنى يستقران فوق إصبعين مثنيين من اليد اليسرى بحركة جلوس ثابتة.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["بيت", "أثاث"],
        "media_local_path": "assets/signs/sign-kursi.png"
    },
    {
        "id": "hammam",
        "word_ar_eg": "حمام / دورة مياه",
        "category_id": "home",
        "phonological_description": "شكل اليد: اليد تشكل حرف الحاء أو قبضة مغلقة تنقر نقراً خفيفاً مرتين على الباب.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["بيت", "مرافق"],
        "media_local_path": "assets/signs/sign-hammam.png"
    },
    {
        "id": "shobbak",
        "word_ar_eg": "شباك / نافذة",
        "category_id": "home",
        "phonological_description": "شكل اليد: الساعدان متوازيان ومفصولان، يرتفع الساعد العلوي للأعلى والآخر للأسفل لمحاكاة فتح نافذة منزلقة.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["بيت", "مبنى"],
        "media_local_path": "assets/signs/sign-shobbak.png"
    },

    # School
    {
        "id": "moallem",
        "word_ar_eg": "معلم / مدرس",
        "category_id": "school",
        "phonological_description": "شكل اليد: قبضتا اليدين عند الصدغين تمتدان للأمام وتفتحان الأصابع دلالة على نقل المعرفة والعلم للطلاب.",
        "difficulty_level": 2,
        "sign_type": "lexical",
        "tags": ["تعليم", "مهن", "مدرسة"],
        "media_local_path": "assets/signs/sign-moallem.png"
    },
    {
        "id": "waagib",
        "word_ar_eg": "واجب مدرسي",
        "category_id": "school",
        "phonological_description": "شكل اليد: حركة كتابة بالسبابة على راحة اليد اليسرى تليها إشارة الالتزام بوضع قبضة اليد على الصدر.",
        "difficulty_level": 2,
        "sign_type": "compound",
        "tags": ["تعليم", "دراسة", "مدرسة"],
        "media_local_path": "assets/signs/sign-waagib.png"
    },
    {
        "id": "fasl",
        "word_ar_eg": "فصل دراسي / قاعة",
        "category_id": "school",
        "phonological_description": "شكل اليد: اليدان مفتوحتان ترسمان حدود غرفة مربعة متناسقة تبدأ من الأمام وتنغلق للخلف.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["تعليم", "مدرسة", "مكان"],
        "media_local_path": "assets/signs/sign-fasl.png"
    },

    # Animals
    {
        "id": "samaka",
        "word_ar_eg": "سمكة",
        "category_id": "animals",
        "phonological_description": "شكل اليد: راحة اليد ممتدة رأسياً وأفقياً تتحرك بتموج سلس لمحاكاة سباحة سمكة النيل في الماء.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["حيوانات", "طبيعة", "بحر"],
        "media_local_path": "assets/signs/sign-samaka.png"
    },
    {
        "id": "hosaan",
        "word_ar_eg": "حصان",
        "category_id": "animals",
        "phonological_description": "شكل اليد: إصبعان ممتدان عند الصدغ (شكل حرف H) ينثنيان مرتين لمحاكاة حركة أذني الحصان المتيقظتين.",
        "difficulty_level": 1,
        "sign_type": "iconic",
        "tags": ["حيوانات", "طبيعة"],
        "media_local_path": "assets/signs/sign-hosaan.png"
    },
    {
        "id": "asad",
        "word_ar_eg": "أسد",
        "category_id": "animals",
        "phonological_description": "شكل اليد: كف اليد مخلبية ومتقوسة تمسح للخلف حول الرأس لتحديد لبدة الأسد المهيبة مع تعبير وجه قوي.",
        "difficulty_level": 2,
        "sign_type": "iconic",
        "tags": ["حيوانات", "قوة", "برية"],
        "media_local_path": "assets/signs/sign-asad.png"
    },

    # Time
    {
        "id": "osboua",
        "word_ar_eg": "أسبوع",
        "category_id": "time",
        "phonological_description": "شكل اليد: سبابة اليد اليمنى تنزلق من قاعدة راحة اليد اليسرى حتى أطراف الأصابع بخط مستقيم يمثل مسار أيام الأسبوع السبعة.",
        "difficulty_level": 1,
        "sign_type": "lexical",
        "tags": ["وقت", "تقويم", "يومي"],
        "media_local_path": "assets/signs/sign-osboua.png"
    },
    {
        "id": "shahr",
        "word_ar_eg": "شهر",
        "category_id": "time",
        "phonological_description": "شكل اليد: سبابة اليد اليمنى تنزلق للأسفل على ظهر سبابة اليد اليسرى القائمة رأسياً دلالة على انقضاء شهر في التقويم.",
        "difficulty_level": 2,
        "sign_type": "lexical",
        "tags": ["وقت", "تقويم"],
        "media_local_path": "assets/signs/sign-shahr.png"
    },
    {
        "id": "sana",
        "word_ar_eg": "سنة / عام",
        "category_id": "time",
        "phonological_description": "شكل اليد: القبضتان مضمومتان وتدور إحداهما حول الأخرى في مدار دائري كامل حتى تستقر فوقها، تمثيلاً لدورة فلكية كاملة للأرض حول الشمس.",
        "difficulty_level": 2,
        "sign_type": "iconic",
        "tags": ["وقت", "تقويم", "مستقبل"],
        "media_local_path": "assets/signs/sign-sana.png"
    },

    # Greetings
    {
        "id": "sabah-el-kheir",
        "word_ar_eg": "صباح الخير",
        "category_id": "greetings",
        "phonological_description": "شكل اليد: إشارة الصباح (اليد تشرق من تحت الساعد للأعلى كالشمس) متبوعة بلمسة الذقن أو راحة اليد دلالة على الخير واليمن.",
        "difficulty_level": 1,
        "sign_type": "compound",
        "tags": ["تحيات", "يومي", "أدب"],
        "media_local_path": "assets/signs/sign-sabah-el-kheir.png"
    }
]

existing_vocab_ids = {v['id'] for v in data['vocabulary']}
added_count = 0
for entry in new_entries:
    if entry['id'] not in existing_vocab_ids:
        data['vocabulary'].append(entry)
        added_count += 1

with open('data/content.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully added {added_count} words! Total vocabulary count: {len(data['vocabulary'])}")
print(f"Total categories count: {len(data['categories'])}")
