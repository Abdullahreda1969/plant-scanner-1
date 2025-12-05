// modules/thumbnail-display.js
// وحدة عرض الصورة المصغرة

export function createThumbnailContainer() {
    /**
     * تنشئ حاوية لعرض الصورة المصغرة
     * @returns {HTMLDivElement} حاوية جاهزة لعرض الصورة
     */
    const container = document.createElement('div');
    container.className = 'thumbnail-container';
    container.style.cssText = `
        width: 200px;
        height: 200px;
        border: 2px dashed #ccc;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-color: #f9f9f9;
        margin: 20px auto;
    `;
    
    const placeholder = document.createElement('p');
    placeholder.textContent = 'الصورة المصغرة ستظهر هنا';
    placeholder.style.color = '#888';
    placeholder.style.fontSize = '14px';
    
    container.appendChild(placeholder);
    return container;
}

export function displayThumbnail(container, file) {
    /**
     * تعرض صورة مصغرة داخل الحاوية
     * @param {HTMLDivElement} container - حاوية العرض
     * @param {File} file - ملف الصورة
     */
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    if (!file || !file.type.startsWith('image/')) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = '⚠️ ليس ملف صورة صالح';
        errorMsg.style.color = 'red';
        container.appendChild(errorMsg);
        return;
    }
    
    // إنشاء عنصر الصورة
    const img = document.createElement('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    `;
    
    // استخدام FileReader لقراءة وعرض الصورة
    const reader = new FileReader();
    
    reader.onload = function(event) {
        img.src = event.target.result;
        container.appendChild(img);
    };
    
    reader.onerror = function() {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = '❌ فشل في عرض الصورة';
        errorMsg.style.color = 'red';
        container.appendChild(errorMsg);
    };
    
    reader.readAsDataURL(file);
}

// للاختبار
if (typeof window !== 'undefined') {
    console.log('✅ وحدة thumbnail-display.js جاهزة');
}