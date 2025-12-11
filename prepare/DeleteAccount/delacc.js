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
    window.location.href = path;
}



// 前端回傳資料
document.querySelector('.confirm-button').addEventListener('click', async (e) => {
    
    e.preventDefault(); 

    const emailElement = document.querySelector('.email');
    const emailInput = document.querySelector('.email').value;

    const url = 'http://localhost:3000/api/home_get/del';

    if (!emailInput) {
        if (messageFeedback) messageFeedback.textContent = '請輸入電子郵件。';
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json', 
                'User-Email': emailInput // 將 Email 放這裡才安全
            },
        });
           
        const result = await response.json();

        if (response.ok || result.message === '成功註銷帳號') { 
            console.log(response.ok);
            console.log('-----------');
            console.log(result.message);
            console.log('-----------');
            console.log(result);
            openModal();
            
        } else {
            messageFeedback.textContent = '用戶不存在，註銷失敗';
            emailElement.value = '';
        }
    } catch (error) {
        messageFeedback.textContent = '用戶不存在，註銷失敗';
        emailElement.value = '';
    }
});