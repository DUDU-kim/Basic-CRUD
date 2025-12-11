// 前端回傳資料
document.querySelector('.login-button').addEventListener('click', async (e) => {
    // 阻止按鈕的預設行為（例如表單提交）
    // 避免頁面刷新 (阻止瀏覽器接管fetch())
    e.preventDefault(); 

    // 1. 獲取表單輸入元素
    const emailElement = document.querySelector('.email');
    const passwordElement = document.querySelector('.password');

    // 1. 獲取表單輸入值
    const emailInput = document.querySelector('.email').value;
    const passwordInput = document.querySelector('.password').value;
    
    // 2. 構造要傳輸的資料物件 (JSON格式)
    const formData = {
        email: emailInput,
        password: passwordInput,
    };

    try {
        // 3. 發送 POST 請求給後端 API
        const response = await fetch('http://13.239.60.163/api/login', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', // 告訴伺服器，我傳送的是 JSON 格式
            },
            body: JSON.stringify(formData), // 將 JavaScript 物件轉換成 JSON 字串
        });

        // 4. 處理後端響應
        const result = await response.json();

        if (response.ok) { 
            // 成功：跳轉到登入頁面
            console.log('登入成功:', result);
            alert('登入成功。');

            // 將 Email 存入 localStorage
            localStorage.setItem('userEmail', emailInput); // 使用一個鍵名 'userEmail' 儲存 Email

            window.location.href = '/prepare/Home/home.html'; // 假設跳轉
            
        } else {
            // 失敗：後端返回的錯誤訊息
            alert(`登入失敗: ${result.message}`);
            // 登入失敗：清空帳號和密碼輸入欄位 
            emailElement.value = '';
            passwordElement.value = '';
        }
    } catch (error) {
        console.error('網路請求錯誤:', error);
        alert('無法連接到伺服器。');
        // 網路錯誤：清空帳號和密碼輸入欄位
        emailElement.value = '';
        passwordElement.value = '';
    }
});