document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email'); // 這裡會拿到發送過來的 Email

    if (email) {
        console.log("從上一個頁面接收到的 Email:", email);

        document.querySelector('.confirm-button').addEventListener('click', async (e) => {
            // 阻止按鈕的預設行為（例如表單提交）
            // 避免頁面刷新 (阻止瀏覽器接管fetch())
            e.preventDefault(); 

            // 1. 獲取表單輸入值
            const newpassInput = document.querySelector('.newpassword').value;
            
            // 2. 構造要傳輸的資料物件 (JSON格式)
            const formData = {
                email: email,
                newpass: newpassInput,
            };

            try {
                // 3. 發送 POST 請求給後端 API
                const response = await fetch('http://13.239.60.163/api/newpass', {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json', // 告訴伺服器，我傳送的是 JSON 格式
                    },
                    body: JSON.stringify(formData), // 將 JavaScript 物件轉換成 JSON 字串
                });

                // 4. 處理後端響應
                const result = await response.json();

                if (response.ok) { 
                    // 成功：跳轉到登入頁面
                    window.location.href = '/prepare/Login/login.html';
                    
                } else {}
            } catch (error) {
                console.error('網路請求錯誤:', error);
            }
        });

    } else {
        console.warn("未接收到 Email 參數。");
    }
});

