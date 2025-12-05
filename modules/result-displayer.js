// modules/result-displayer.js
// وحدة عرض نتائج التعرف على النبات

export function createResultsContainer() {
    /**
     * تنشئ حاوية لعرض النتائج
     * @returns {HTMLDivElement} حاوية النتائج
     */
    const container = document.createElement('div');
    container.className = 'results-container';
    container.style.cssText = `
        margin: 30px 0;
        padding: 20px;
        background: #ffffff;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    `;
    
    return container;
}

export function displayResults(container, apiResponse) {
    /**
     * عرض نتائج التعرف على النبات
     * @param {HTMLDivElement} container - حاوية العرض
     * @param {Object} apiResponse - رد API من PlantNet
     */
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    if (!apiResponse || !apiResponse.success) {
        displayError(container, apiResponse?.error || 'حدث خطأ غير معروف');
        return;
    }
    
    const results = apiResponse.data?.results || [];
    
    if (results.length === 0) {
        displayNoResults(container);
        return;
    }
    
    // إضافة عنوان النتائج
    const header = document.createElement('div');
    header.style.cssText = `
        text-align: center;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 2px solid #4CAF50;
    `;
    
    const title = document.createElement('h2');
    title.textContent = '🌿 نتائج التعرف على النبات';
    title.style.color = '#2E7D32';
    header.appendChild(title);
    
    const countText = document.createElement('p');
    countText.textContent = `تم العثور على ${results.length} نبات محتمل`;
    countText.style.color = '#666';
    header.appendChild(countText);
    
    // إضافة ملاحظة إذا كانت النتائج محاكاة
    if (apiResponse.isMock) {
        const mockNote = document.createElement('p');
        mockNote.textContent = '⚠️ هذه نتائج تجريبية للمحاكاة فقط';
        mockNote.style.cssText = `
            background: #FFF3CD;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #FFEEBA;
            font-size: 14px;
            margin-top: 10px;
        `;
        header.appendChild(mockNote);
    }
    
    container.appendChild(header);
    
    // عرض كل نتيجة
    results.forEach((plant, index) => {
        const plantCard = createPlantCard(plant, index + 1);
        container.appendChild(plantCard);
    });
}

function createPlantCard(plant, rank) {
    /**
     * إنشاء بطاقة عرض لنبات واحد
     * @param {Object} plant - بيانات النبات
     * @param {number} rank - الترتيب (1, 2, 3...)
     * @returns {HTMLDivElement} بطاقة النبات
     */
    
    const card = document.createElement('div');
    card.className = 'plant-card';
    card.style.cssText = `
        background: #F8F9FA;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        border-left: 5px solid #4CAF50;
        transition: transform 0.3s, box-shadow 0.3s;
    `;
    
    card.onmouseenter = () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
    };
    
    card.onmouseleave = () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    };
    
    // شارة الترتيب
    const rankBadge = document.createElement('div');
    rankBadge.style.cssText = `
        display: inline-block;
        background: ${getRankColor(rank)};
        color: white;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        text-align: center;
        line-height: 35px;
        font-weight: bold;
        margin-right: 15px;
        vertical-align: middle;
    `;
    rankBadge.textContent = `#${rank}`;
    
    // اسم النبات العلمي
    const scientificName = document.createElement('h3');
    scientificName.style.cssText = `
        display: inline-block;
        margin: 0;
        color: #2C3E50;
        font-size: 18px;
    `;
    scientificName.textContent = plant.species?.scientificName || 'نبات غير معروف';
    
    const nameRow = document.createElement('div');
    nameRow.style.marginBottom = '15px';
    nameRow.appendChild(rankBadge);
    nameRow.appendChild(scientificName);
    
    card.appendChild(nameRow);
    
    // الأسماء الشائعة
    if (plant.species?.commonNames && plant.species.commonNames.length > 0) {
        const commonNamesDiv = document.createElement('div');
        commonNamesDiv.style.cssText = `
            margin-bottom: 10px;
            color: #555;
        `;
        
        const namesLabel = document.createElement('strong');
        namesLabel.textContent = 'الأسماء الشائعة: ';
        namesLabel.style.color = '#4CAF50';
        
        const namesText = document.createElement('span');
        namesText.textContent = plant.species.commonNames.join('، ');
        
        commonNamesDiv.appendChild(namesLabel);
        commonNamesDiv.appendChild(namesText);
        card.appendChild(commonNamesDiv);
    }
    
    // العائلة
    if (plant.species?.family?.scientificName) {
        const familyDiv = document.createElement('div');
        familyDiv.style.cssText = `
            margin-bottom: 10px;
            color: #555;
        `;
        
        const familyLabel = document.createElement('strong');
        familyLabel.textContent = 'العائلة النباتية: ';
        familyLabel.style.color = '#4CAF50';
        
        const familyText = document.createElement('span');
        familyText.textContent = plant.species.family.scientificName;
        
        familyDiv.appendChild(familyLabel);
        familyDiv.appendChild(familyText);
        card.appendChild(familyDiv);
    }
    
    // درجة الثقة
    const confidenceDiv = document.createElement('div');
    confidenceDiv.style.cssText = `
        margin: 15px 0;
    `;
    
    const confidenceLabel = document.createElement('strong');
    confidenceLabel.textContent = 'درجة الثقة: ';
    confidenceLabel.style.color = '#4CAF50';
    
    const confidenceBar = document.createElement('div');
    confidenceBar.style.cssText = `
        background: #E0E0E0;
        height: 10px;
        border-radius: 5px;
        margin: 5px 0;
        overflow: hidden;
    `;
    
    const confidenceFill = document.createElement('div');
    confidenceFill.style.cssText = `
        background: ${getConfidenceColor(plant.score)};
        height: 100%;
        width: ${(plant.score * 100)}%;
        border-radius: 5px;
        transition: width 1s ease-in-out;
    `;
    
    const confidenceText = document.createElement('span');
    confidenceText.textContent = `${(plant.score * 100).toFixed(1)}%`;
    confidenceText.style.cssText = `
        font-size: 14px;
        color: #666;
        display: block;
        text-align: right;
        margin-top: 5px;
    `;
    
    confidenceDiv.appendChild(confidenceLabel);
    confidenceDiv.appendChild(confidenceBar);
    confidenceBar.appendChild(confidenceFill);
    confidenceDiv.appendChild(confidenceText);
    
    card.appendChild(confidenceDiv);
    
    // اقتراحات العلاج (محاكاة)
    if (rank === 1) { // فقط للنبات الأول في الترتيب
        const treatmentDiv = document.createElement('div');
        treatmentDiv.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: #E8F5E9;
            border-radius: 8px;
            border: 1px solid #C8E6C9;
        `;
        
        const treatmentTitle = document.createElement('h4');
        treatmentTitle.textContent = '💡 اقتراحات العناية:';
        treatmentTitle.style.cssText = `
            margin: 0 0 10px 0;
            color: #2E7D32;
        `;
        
        const treatmentList = document.createElement('ul');
        treatmentList.style.cssText = `
            margin: 0;
            padding-left: 20px;
            color: #555;
        `;
        
        // اقتراحات وهمية حسب نوع النبات
        const suggestions = getTreatmentSuggestions(plant.species?.scientificName || '');
        
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.style.marginBottom = '5px';
            treatmentList.appendChild(li);
        });
        
        treatmentDiv.appendChild(treatmentTitle);
        treatmentDiv.appendChild(treatmentList);
        card.appendChild(treatmentDiv);
    }
    
    return card;
}

function displayError(container, errorMessage) {
    /**
     * عرض رسالة خطأ
     */
    container.innerHTML = `
        <div style="
            text-align: center;
            padding: 40px;
            background: #FFEBEE;
            border-radius: 10px;
            border: 2px solid #EF5350;
        ">
            <div style="font-size: 48px; color: #EF5350;">❌</div>
            <h3 style="color: #C62828;">فشل في التعرف على النبات</h3>
            <p style="color: #555; margin: 15px 0;">${errorMessage}</p>
            <p style="color: #777; font-size: 14px;">يرجى المحاولة مرة أخرى أو تجربة صورة أخرى</p>
        </div>
    `;
}

function displayNoResults(container) {
    /**
     * عرض رسالة عدم وجود نتائج
     */
    container.innerHTML = `
        <div style="
            text-align: center;
            padding: 40px;
            background: #FFF3E0;
            border-radius: 10px;
            border: 2px solid #FF9800;
        ">
            <div style="font-size: 48px; color: #FF9800;">🔍</div>
            <h3 style="color: #EF6C00;">لم يتم التعرف على النبات</h3>
            <p style="color: #555; margin: 15px 0;">لم يتم العثور على تطابق في قاعدة البيانات</p>
            <p style="color: #777; font-size: 14px;">جرب تصوير جزء مختلف من النبات (زهرة، ورق، ساق)</p>
        </div>
    `;
}

function getRankColor(rank) {
    /**
     * لون حسب الترتيب
     */
    switch(rank) {
        case 1: return '#4CAF50'; // أخضر
        case 2: return '#2196F3'; // أزرق
        case 3: return '#FF9800'; // برتقالي
        default: return '#9E9E9E'; // رمادي
    }
}

function getConfidenceColor(score) {
    /**
     * لون حسب درجة الثقة
     */
    if (score >= 0.8) return '#4CAF50'; // أخضر (عالي)
    if (score >= 0.5) return '#FF9800'; // برتقالي (متوسط)
    return '#F44336'; // أحمر (منخفض)
}

function getTreatmentSuggestions(plantName) {
    /**
     * اقتراحات علاج وهمية حسب نوع النبات
     */
    const suggestions = [
        'تأكد من تربة جيدة التصريف',
        'الري المعتدل - لا تفرط في الري',
        'تعريض النبات لضوء شمس غير مباشر',
        'تسميد خفيف كل أسبوعين في موسم النمو'
    ];
    
    if (plantName.toLowerCase().includes('rosa')) {
        suggestions.push('تقليم السيقان الميتة في الربيع');
        suggestions.push('مراقبة علامات البياض الدقيقي');
    }
    
    if (plantName.toLowerCase().includes('mentha')) {
        suggestions.push('يحب الرطوبة - ضع في مكان بارد');
        suggestions.push('قص الأوراق بانتظام لتحفيز النمو');
    }
    
    return suggestions;
}

// للاختبار
if (typeof window !== 'undefined') {
    console.log('✅ وحدة result-displayer.js جاهزة');
    
    // دالة مساعدة للاختبار
    window.testDisplayResults = function(containerId) {
        const container = document.getElementById(containerId) || document.createElement('div');
        const mockResponse = {
            success: true,
            data: {
                results: [
                    {
                        score: 0.95,
                        species: {
                            scientificName: 'Rosa canina',
                            commonNames: ['ورد بري', 'ورد الكلاب'],
                            family: { scientificName: 'Rosaceae' }
                        }
                    },
                    {
                        score: 0.87,
                        species: {
                            scientificName: 'Mentha spicata',
                            commonNames: ['نعناع', 'نعناع حامض'],
                            family: { scientificName: 'Lamiaceae' }
                        }
                    }
                ]
            },
            isMock: true
        };
        
        displayResults(container, mockResponse);
        return container;
    };
}