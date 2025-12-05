// modules/image-to-base64.js
// وحدة تحويل الصور إلى تنسيق base64

export function convertImageToBase64(file, maxSizeKB = 500) {
    /**
     * تحويل ملف صورة إلى نص base64 مع التحكم بالحجم
     * @param {File} file - ملف الصورة
     * @param {number} maxSizeKB - الحد الأقصى للحجم بالكيلوبايت (افتراضي 500KB)
     * @returns {Promise<string>} وعد برمز base64 أو خطأ
     */
    
    return new Promise((resolve, reject) => {
        // التحقق من أن الملف صورة
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('الملف ليس صورة صالحة'));
            return;
        }
        
        // التحقق من الحجم
        if (file.size > maxSizeKB * 1024) {
            reject(new Error(`حجم الصورة كبير جداً (الحد: ${maxSizeKB}KB)`));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            // الحصول على base64 (نزيل "data:image/...;base64,")
            const base64String = event.target.result;
            resolve(base64String);
        };
        
        reader.onerror = function(error) {
            reject(new Error('فشل في قراءة الملف: ' + error));
        };
        
        reader.readAsDataURL(file);
    });
}

export function extractBase64Data(base64String) {
    /**
     * استخراج البيانات النقية من base64 (إزالة الـ header)
     * @param {string} base64String - نص base64 كامل
     * @returns {string} بيانات base64 النقية
     */
    // مثال: "data:image/jpeg;base64,/9j/4AAQSkZ..." → "/9j/4AAQSkZ..."
    const commaIndex = base64String.indexOf(',');
    if (commaIndex !== -1) {
        return base64String.substring(commaIndex + 1);
    }
    return base64String;
}

export function getImageInfo(base64String) {
    /**
     * الحصول على معلومات عن صورة base64
     * @param {string} base64String - نص base64
     * @returns {Object} معلومات الصورة
     */
    const info = {
        hasHeader: base64String.startsWith('data:'),
        estimatedSizeKB: null,
        imageType: 'unknown'
    };
    
    if (info.hasHeader) {
        // استخراج نوع الصورة من الـ header
        const match = base64String.match(/^data:(image\/\w+);base64,/);
        if (match) {
            info.imageType = match[1];
        }
    }
    
    // حساب الحجم التقريبي (كل 4 حروف base64 = 3 بايت)
    const base64Length = info.hasHeader ? 
        base64String.length - base64String.indexOf(',') - 1 : 
        base64String.length;
    
    info.estimatedSizeKB = Math.ceil((base64Length * 3) / 4 / 1024);
    
    return info;
}

// للاختبار
if (typeof window !== 'undefined') {
    console.log('✅ وحدة image-to-base64.js جاهزة');
    
    // مثال للاستخدام
    window.demoConvertToBase64 = async function(file) {
        try {
            const base64 = await convertImageToBase64(file, 1000);
            const info = getImageInfo(base64);
            console.log('معلومات الصورة:', info);
            console.log('base64 مختصر:', base64.substring(0, 100) + '...');
            return { success: true, base64: base64, info: info };
        } catch (error) {
            console.error('خطأ:', error.message);
            return { success: false, error: error.message };
        }
    };
}