// upload-basic.js  
// modules/upload-basic.js
// الوحدة الأساسية لرفع ملف صورة

export function createUploadInput() {
    /**
     * تنشئ عنصر input لرفع الملفات
     * @returns {HTMLInputElement} عنصر input جاهز للاستخدام
     */
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';  // يقبل جميع أنواع الصور
    input.style.display = 'none';  // نخفيه ونستخدم زراً بدلاً منه
    
    return input;
}

export function setupUpload(callback) {
    /**
     * إعداد نظام رفع الملفات
     * @param {Function} callback - دالة تستدعى عند اختيار ملف
     *                            تتلقى كائن File كمعامل
     */
    
    const input = createUploadInput();
    document.body.appendChild(input);
    
    // عند اختيار ملف
    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && callback) {
            callback(file);
        }
        // إعادة تعيين الـ input للسماح برفع نفس الملف مرة أخرى
        input.value = '';
    });
    
    // دالة لفتح نافذة اختيار الملف
    function openFilePicker() {
        input.click();
    }
    
    return {
        openFilePicker: openFilePicker,
        inputElement: input
    };
}

// للاختبار: إذا تم تشغيل الملف مباشرة في المتصفح
if (typeof window !== 'undefined') {
    console.log('✅ وحدة upload-basic.js جاهزة');
}