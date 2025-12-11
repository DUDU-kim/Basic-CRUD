import express from 'express';
import db from '../db.js';
// import bcrypt from 'bcrypt'; // 密碼hash需要

const router = express.Router(); // 子路由，只包含method(get, post, use...)

router.get('/', async (req, res) => {
    const email = req.headers['user-email']; // express規定小寫查詢
    // console.log(email);

    try {
        const selectSql = 'SELECT * FROM product_content WHERE email = ?';
        const [prodContent] = await db.execute(selectSql, [email]);
        // console.log(prodContent);
   
        // prodContent.forEach(item => {
        //     // 就是每一筆資料的物件
        //     console.log(`Email: ${item.email}`);
        //     console.log(`Product ID: ${item.product_id}`);
        //     console.log(`Product Name: ${item.product_name}`);
        //     console.log(`Product Price: ${item.product_price}`);
        //     console.log(`Product Count: ${item.product_count}`);
        //     console.log(`Product Total: ${item.product_total}`);
        //     console.log('---');
        // });

        // 返回成功的響應 (200: ok)
        res.status(200).json({ 
            success: true, 
            message: '成功獲取資料!',
            data: prodContent // 將完整的陣列返回給前端
        });
        
    } catch (err) {
        console.error('查詢失敗', err);
        // 處理資料庫連線或寫入錯誤
        return res.status(500).json({ success: false, message: '伺服器內部錯誤，查詢失敗。' });
    }
});

export default router;