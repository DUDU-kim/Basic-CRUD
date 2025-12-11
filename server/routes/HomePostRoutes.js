import express from 'express';
import db from '../db.js';
// import bcrypt from 'bcrypt'; // 密碼hash需要

const router = express.Router(); // 子路由，只包含method(get, post, use...)

router.put('/', async (req, res) => {
    const receivedData = req.body;

    const {email, items} = receivedData;
    // console.log(email);
    // console.log(items);

    try {
        if (!items || items.length === 0) {
             return res.status(400).json({ success: false, message: '購物車內容為空。' });
        }
        
        // 刪除該用戶舊有的購物車資料
        const deleteSql = 'DELETE FROM product_content WHERE email = ?';
        await db.execute(deleteSql, [email]);

        const insertSql = `
            INSERT INTO product_content 
            (email, product_id, product_name, product_price, product_count, product_total) 
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        
        // 使用 map 將每個商品轉換為一個非同步的資料庫操作 Promise
        const insertPromises = items.map(item => {

            return db.execute(insertSql, [
                email,            
                item.id,          
                item.name,      
                item.price,           
                item.count,
                item.total         
            ]);
        });
        
        // 等待所有商品的插入操作完成
        await Promise.all(insertPromises); 
        
        res.status(200).json({ 
            success: true, 
            message: `成功插入 ${items.length} 筆商品訂單記錄`,
        });
        
    } catch (err) {
        console.error('訂單處理失敗', err);
        // 處理資料庫連線或寫入錯誤
        return res.status(500).json({ success: false, message: '訂單處理失敗' });
    }
});

export default router;