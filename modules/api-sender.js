// modules/api-sender.js
// وحدة إرسال الطلبات إلى PlantNet API

// Note: في التطبيق الحقيقي، سيتم قراءة API Key من ملف .env
// لكن للتبسيط الآن، سنستخدم متغيراً مؤقتاً
const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';
const API_KEY = ''; // ستضيف المفتاح هنا مؤقتاً

export async function sendToPlantNetAPI(imageBase64, apiKey = API_KEY) {
    /**
     * إرسال صورة إلى PlantNet API للتعرف على النبات
     * @param {string} imageBase64 - صورة بتنسيق base64
     * @param {string} apiKey - مفتاح API (اختياري)
     * @returns {Promise<Object>} نتيجة التعرف على النبات
     */
    
    if (!apiKey) {
        throw new Error('مفتاح API مطلوب. احصل عليه من: https://my.plantnet.org/');
    }
    
    if (!imageBase64 || !imageBase64.startsWith('data:image')) {
        throw new Error('صورة base64 غير صالحة');
    }
    
    // إعداد البيانات للإرسال
    const formData = new FormData();
    
    // تحويل base64 إلى Blob
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: mimeType });
    const file = new File([blob], 'plant.jpg', { type: mimeType });
    
    formData.append('images', file);
    formData.append('organs', 'flower'); // يمكن تغييره لـ leaf, fruit, bark
    
    // إعداد الطلب
    const url = `${PLANTNET_API_URL}?api-key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`فشل الطلب: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        return {
            success: true,
            data: data,
            status: response.status
        };
        
    } catch (error) {
        console.error('خطأ في API:', error);
        return {
            success: false,
            error: error.message,
            suggestion: 'تحقق من اتصال الإنترنت والمفتاح'
        };
    }
}

export function simulateAPIResponse(imageBase64) {
    /**
     * محاكاة رد API للاختبار (بدون اتصال حقيقي بالإنترنت)
     * @param {string} imageBase64 - صورة base64 (للمحاكاة فقط)
     * @returns {Promise<Object>} نتيجة محاكاة
     */
    
    console.log('🔧 محاكاة رد API - للاختبار فقط');
    
    // بيانات وهمية للنباتات
    const mockPlants = [
        {
            score: 0.95,
            species: {
                scientificName: 'Rosa canina',
                commonNames: ['ورد بري', 'ورد الكلاب'],
                family: { scientificName: 'Rosaceae' }
            },
            images: [
                { organ: 'flower', url: { o: 'https://example.com/rose1.jpg' } }
            ]
        },
        {
            score: 0.87,
            species: {
                scientificName: 'Mentha spicata',
                commonNames: ['نعناع', 'نعناع حامض'],
                family: { scientificName: 'Lamiaceae' }
            },
            images: [
                { organ: 'leaf', url: { o: 'https://example.com/mint1.jpg' } }
            ]
        },
        {
            score: 0.72,
            species: {
                scientificName: 'Lavandula angustifolia',
                commonNames: ['لافندر', 'خزامى'],
                family: { scientificName: 'Lamiaceae' }
            }
        }
    ];
    
    // محاكاة تأخير الشبكة
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    results: mockPlants,
                    query: { images: ['plant.jpg'], organs: ['flower'] },
                    version: '2024.01.01'
                },
                status: 200,
                isMock: true
            });
        }, 1500);
    });
}

export function validateAPIResponse(response) {
    /**
     * التحقق من صحة رد API
     * @param {Object} response - رد API
     * @returns {Object} نتيجة التحقق
     */
    if (!response || !response.success) {
        return { valid: false, error: 'رد API غير صالح' };
    }
    
    if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
        return { valid: false, error: 'هيكلية البيانات غير صحيحة' };
    }
    
    if (response.data.results.length === 0) {
        return { valid: true, warning: 'لم يتم التعرف على أي نبات' };
    }
    
    return { valid: true, plantsCount: response.data.results.length };
}


// للاختبار
if (typeof window !== 'undefined') {
    console.log('✅ وحدة api-sender.js جاهزة');
    console.log('⚠️ تذكر: أضف API Key في المتغير API_KEY');
}