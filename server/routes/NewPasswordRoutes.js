import express from 'express';
import db from '../db.js';
// import bcrypt from 'bcrypt'; // 密碼hash需要

const router = express.Router(); // 子路由，只包含method(get, post, use...)

router.put('/', async (req, res) => {
    const receivedData = req.body;

    //比對帳密
    const {email, newpass} = receivedData;

    try {
        const updateSql = `UPDATE account SET password = ? WHERE email= '${email}'`;
        const [updatepass] = await db.execute(updateSql, [newpass]);
        
        if (updatepass.length === 0) {
            return res.status(401).json({ success: false, message: '用戶不存在。' }); // 409 Conflict
        }

        // const [{ email: userEmail, password: userPassword }] = isExistingUser;
        // console.log(userEmail);
        // console.log(userPassword);

        // 返回成功的響應 (200: ok)
        res.status(200).json({ 
            success: true, 
            message: '',
        });
        
    } catch (err) {
        console.error('更新失敗', err);
        // 處理資料庫連線或寫入錯誤
        return res.status(500).json({ success: false, message: '伺服器內部錯誤，查詢失敗。' });
    }
});

export default router;