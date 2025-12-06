# 🌿 Plant Scanner 1

تطبيق ويب للتعرف على النباتات وأمراضها عبر تحليل الصور.

## ✨ المميزات

- 📸 رفع صور النباتات (سحب وإفلات أو اختيار)
- 🖼️ عرض صورة مصغرة فورية
- 🔄 تحويل تلقائي إلى Base64
- 🌐 اتصال بـ PlantNet API (محاكاة/حقيقي)
- 📊 عرض النتائج مع اقتراحات العلاج
- 📱 تصميم متجاوب يعمل على جميع الأجهزة

## 🧩 الهيكلية المعيارية

المشروع مبني على وحدات منفصلة:
1. **upload-basic.js** - إدارة رفع الملفات
2. **thumbnail-display.js** - عرض الصور المصغرة
3. **image-to-base64.js** - تحويل الصور
4. **api-sender.js** - الاتصال بـ PlantNet API
5. **result-displayer.js** - عرض النتائج

## 🚀 البدء السريع

1. افتح `test-units/full-test.html` في متصفحك
2. اضغط "اختبار بالمحاكاة" لتجربة سريعة
3. أو اختر صورة نبات حقيقية للتحليل

## 🔧 الاختبار

كل وحدة لها صفحة اختبار منفصلة:
- `test-units/test-upload.html` - اختبار الرفع
- `test-units/test-thumbnail.html` - اختبار العرض
- `test-units/test-base64.html` - اختبار التحويل
- `test-units/full-test.html` - اختبار التكامل الكامل

## 📁 الهيكلية
plant-scanner-1/
├── modules/                    # 5 وحدات أساسية تعمل
│   ├── upload-basic.js        ✅
│   ├── thumbnail-display.js   ✅
│   ├── image-to-base64.js     ✅
│   ├── api-sender.js          ✅ (محاكاة)
│   └── result-displayer.js    ✅
├── test-units/                # صفحات اختبار
│   ├── test-upload.html      ✅
│   ├── test-thumbnail.html   ✅
│   ├── test-base64.html      ✅
│   └── full-test.html        ✅ (تكامل كامل)
├── public/                    # للتطوير المستقبلي
└── README.md                  # ملف التعريف

## 🎯 الهدف التعليمي

هذا المشروع يهدف إلى:
- تعلم التطوير المعياري (Modular Development)
- فهم كيفية عمل APIs مع الصور
- بناء تطبيق كامل خطوة بخطوة

## 📄 الرخصة

مشروع تعليمي مفتوح المصدر.