const cart = [];
const cartSidebar = document.querySelector('.cart-sidebar');
const cartItemsList = document.querySelector('.cart-items');
const totalElement = document.getElementById('total');

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const product = {
            id: button.dataset.id, // dataset: 元素以 data- 開頭的自訂資料屬性
            name: button.dataset.name,
            price: parseFloat(button.dataset.price)
        };
        cart.push(product);
        updateCartDisplay();
    });
});

// Cart button
document.querySelector('.open-cart-btn').addEventListener('click', () => {
    // 點擊後顯示側邊欄
    cartSidebar.classList.add('active');
    
    // 確保點擊時，購物車內容是最新的
    updateCartDisplay(); 
});

// Update cart display
function updateCartDisplay() {
   cartItemsList.innerHTML = '';
   let total = 0; 

   // (合併商品和計算數量)
   const processedCart = {};

   cart.forEach(item => {  // {item: {id: '',name: '',price: ''}}
        const itemId = item.id;

        if (processedCart[itemId]) {
            // 如果商品已存在，數量加 1
            processedCart[itemId].count += 1;
            processedCart[itemId].subtotal += item.price; // 更新小計
        } else {
           // 如果是新商品，初始化其數據
            processedCart[itemId] = {
                item: item,
                count: 1,
                subtotal: item.price
            }; 
        }
        total += item.price; 
   });
   

   // Object.values(processedCart) 會返回物件(processedCart)中所有值的陣列
    Object.values(processedCart).forEach(entry => {
        // console.log(entry);
        const li = document.createElement('li');
        li.className = "cart-item";

        li.innerHTML = `
            <span>${entry.item.name}</span>
            <span>$${entry.item.price.toFixed(2)}</span>
            <div class=${entry.item.id}></div>
            <span>x${entry.count}</span>
            <button onclick="removeFromCart('${entry.item.id}')">&times;</button>
        `;
        cartItemsList.appendChild(li);
   });

   totalElement.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(productId) {
    // 尋找要移除的商品的索引
    console.log(cart); // cart按照加入的順序排列
    const indexToRemove = cart.findIndex(item => item.id === productId); // 從最前面開始刪除
    console.log(indexToRemove);
    if (indexToRemove !== -1) {
        // 從原始陣列中只移除該商品的其中一個實例
        cart.splice(indexToRemove, 1);
        updateCartDisplay();
    }
}

// Toggle cart visibility
document.querySelector('.close-cart').addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});


// Front To Back
document.querySelector('.confirm-button').addEventListener('click', async (e) => {

    e.preventDefault();

    // 從 localStorage 讀取 Email
    const loggedInUserEmail = localStorage.getItem('userEmail') || '';

    const cartItems = document.querySelectorAll('.cart-item');
    const cartTotal = document.querySelector('#total').textContent; // id='total'

    const cart_contents = [];
    cartItems.forEach(itemElement => { // 遍歷每個'.cart-item'
       
        const innerId = itemElement.querySelector('div').className;
        const inner = itemElement.innerText.split('\n');
        // console.log(inner);
        // console.log(inner);
        parse_id = parseInt(innerId);
        parse_price = parseFloat(inner[1].split('$')[1]);
        parse_count = parseInt(inner[2].split('x')[1]);
        const total = parse_price * parse_count;
        const cart_content = {
            id: parse_id,
            name: inner[0] ? inner[0].trim() : '',
            price: inner[1] ? parse_price : 0, // 確保最終存入的是數字類型
            count: inner[2] ? parse_count : 0,
            total: total
        }
        cart_contents.push(cart_content);
        console.log(cart_contents);
    });

    
    const final_cart_content = {
        email: loggedInUserEmail,
        items: cart_contents, // 包含所有商品細節的陣列
    };
    console.log(final_cart_content);


    // 給後端發送資料
    try {
        const response = await fetch('http://13.239.60.163/api/home_post', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(final_cart_content), 
        });

        const result = await response.json();

        if (response.ok) { 
            console.log('上傳成功', result);     
        } else {
            console.log('上傳失敗', result);   
        }

    } catch (error) {
        console.error('網路請求錯誤:', error);
    }
  
});




// Back To Front + Re-render the UI
function loadCartFromBackend(backendData) {
    // 清空當前購物車狀態
    cart.length = 0; 
    
    // 遍歷後端返回的每一筆記錄
    backendData.forEach(item => {
        // 根據商品數量 (product_count) 進行展開
        for (let i = 0; i < item.product_count; i++) {
            // 將每個商品實例推入 cart 陣列
            cart.push({
                // 這裡使用後端返回的欄位名稱 (product_id, product_name, product_price)
                id: String(item.product_id), // 確保 ID 是字串，與 data-id 一致
                name: item.product_name,
                price: parseFloat(item.product_price)
            });
        }
    });
    // 重新渲染購物車
    updateCartDisplay();
}

document.querySelector('.open-cart-btn').addEventListener('click', async (e) => {
    
    // 從 localStorage 讀取 Email
    const loggedInUserEmail = localStorage.getItem('userEmail');
    console.log(loggedInUserEmail);

    if (!loggedInUserEmail) {
        console.warn('用戶未登入，無法抓取購物車。');
        return;
    }
    
    const url = 'http://13.239.60.163/api/home_get';

    try {
        const response = await fetch(url, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
                'User-Email': loggedInUserEmail // 將 Email 放這裡才安全
            },
        });

        const result = await response.json();

        if (response.ok) { 
            loadCartFromBackend(result.data) // 後端回傳的資料(result.data)    
            // result.data.forEach(item => {
            //     console.log(`Email: ${item.email}`);
            //     console.log(`Product ID: ${item.product_id}`);
            //     console.log(`Product Name: ${item.product_name}`);
            //     console.log(`Product Price: ${item.product_price}`);
            //     console.log(`Product Count: ${item.product_count}`);
            //     console.log(`Product Total: ${item.product_total}`);
            //     console.log('---');
            // });
        } else {
            console.log('抓取失敗', result.message);   
        }

    } catch (error) {
        console.error('網路請求錯誤:', error);
    }
});




// Delete account
