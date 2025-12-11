import express from 'express';
import db from '../db.js';
// import bcrypt from 'bcrypt'; // 密碼hash需要

const router = express.Router(); // 子路由，只包含method(get, post, use...)

router.post('/', async (req, res) => {
    const receivedData = req.body;

    //比對帳密
    const {email, password} = receivedData;

    try {
        const selectSql = 'SELECT email, password FROM account WHERE email = ? AND password = ?';
        const [isExistingUser] = await db.execute(selectSql, [email, password]);

        if (isExistingUser.length === 0) {
            return res.status(409).json({ success: false, message: '用戶不存在。' }); // 409 Conflict
        }

        // const [{ email: userEmail, password: userPassword }] = isExistingUser;
        // console.log(userEmail);
        // console.log(userPassword);

        // 返回成功的響應 (200: ok)
        res.status(200).json({ 
            success: true, 
            message: '登入成功!',
        });
        
    } catch (err) {
        console.error('查無此用戶', err);
        // 處理資料庫連線或寫入錯誤
        return res.status(500).json({ success: false, message: '伺服器內部錯誤，查詢失敗。' });
    }
});

export default router;