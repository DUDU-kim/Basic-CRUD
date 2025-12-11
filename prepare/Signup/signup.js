// 前端回傳資料
document.querySelector('.sign-button').addEventListener('click', async (e) => {
    // 阻止按鈕的預設行為（例如表單提交）
    // 避免頁面刷新 (阻止瀏覽器接管fetch())
    e.preventDefault(); 

    // 1. 獲取表單輸入值
    const nameInput = document.querySelector('.name').value;
    const ageInput = document.querySelector('.age').value;
    const emailInput = document.querySelector('.email').value;
    const passwordInput = document.querySelector('.password').value;
    const sexInput = document.querySelector('.sex').value;
    
    // 2. 構造要傳輸的資料物件 (JSON格式)
    const formData = {
        name: nameInput,
        age: ageInput,
        email: emailInput,
        password: passwordInput,
        sex: sexInput,
    };

    try {
        // 3. 發送 POST 請求給後端 API
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST', // 使用 POST 方法 (符合 RESTful 創建資源或執行操作)
            headers: {
                'Content-Type': 'application/json', // 告訴伺服器，我傳送的是 JSON 格式
            },
            body: JSON.stringify(formData), // 將 JavaScript 物件轉換成 JSON 字串
        });

        // 4. 處理後端響應
        const result = await response.json();

        if (response.ok) { 
            // 成功：跳轉到登入頁面
            console.log('註冊成功:', result);
            alert('帳號創建成功！請登入。');
            window.location.href = '/prepare/Login/login.html'; // 假設跳轉
            
        } else {
            // 失敗：後端返回的錯誤訊息
            alert(`註冊失敗: ${result.message}`);
        }
    } catch (error) {
        console.error('網路請求錯誤:', error);
        alert('無法連接到伺服器。');
    }
});