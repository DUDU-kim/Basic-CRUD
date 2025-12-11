// 全局變數：用於儲存驗證成功的 Email，以便跳轉時傳遞
let emailToSend = ''; 

// 獲取模態框元素
const modal = document.getElementById("myModal");
const messageFeedback = document.getElementById('message-feedback'); 

// 1. 開啟模態框
function openModal() {
    modal.style.display = "block";
}

// 2. 關閉模態框
function closeModal(path) {
    modal.style.display = "none";
    
    let targetPath = path;
    
    // 如果 Email 存在，則將其作為 URL 查詢參數附加
    if (targetPath && emailToSend) {
        // 使用 URLSearchParams 確保 Email 被正確編碼，並附加到路徑中
        const separator = targetPath.includes('?') ? '&' : '?';
        targetPath = `${targetPath}${separator}email=${encodeURIComponent(emailToSend)}`;
        window.location.href = targetPath;
    }
    
    if (targetPath) {
        // 將瀏覽器導向指定的 URL
        console.log(targetPath);
        window.location.href = targetPath; 
    }
}



// 前端回傳資料
document.querySelector('.confirm-button').addEventListener('click', async (e) => {
    // 阻止按鈕的預設行為（例如表單提交）
    // 避免頁面刷新 (阻止瀏覽器接管fetch())
    e.preventDefault(); 

    // 清除之前的錯誤回饋
    if (messageFeedback) messageFeedback.textContent = ''; 

    // 獲取表單輸入元素
    const emailElement = document.querySelector('.email');
    
    // 1. 獲取表單輸入值
    const emailInput = emailElement.value.trim();
    if (!emailInput) {
        if (messageFeedback) messageFeedback.textContent = '請輸入電子郵件。';
        return;
    }

    // 2. 構造要傳輸的資料物件 (JSON格式)
    const formData = {
        email: emailInput,
    };

    try {
        // 3. 發送 POST 請求給後端 API
        const response = await fetch('http://13.239.60.163/api/verify', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', // 告訴伺服器，我傳送的是 JSON 格式
            },
            body: JSON.stringify(formData), // 將 JavaScript 物件轉換成 JSON 字串
        });

        // 4. 處理後端響應
        const result = await response.json();
        const responseMessage = result.message || '驗證碼已送出';

        if (response.ok) { 
            // 成功：跳轉到登入頁面
            // 儲存 Email 到全局變數
            emailToSend = emailInput; 
            openModal();
            console.log('驗證碼已傳送至信箱:', responseMessage);
        } else {
            // 不開啟模態框，顯示錯誤訊息
            const errorMessage = `${responseMessage}`;
            if (messageFeedback) messageFeedback.textContent = errorMessage;
            console.error('驗證碼傳送失敗 (後端錯誤):', result);
            
            // 清空輸入欄位
            emailElement.value = '';
        }
    } catch (error) {
        // 網路請求錯誤：不開啟模態框 (取代 alert)
        const errorMessage = '無法連接到伺服器。';
        if (messageFeedback) messageFeedback.textContent = errorMessage;
        console.error('網路請求錯誤:', error);
        
        // 清空輸入欄位
        emailElement.value = '';
    }
});



