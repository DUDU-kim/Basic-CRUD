import express from 'express';
import db from '../db.js';
// import bcrypt from 'bcrypt'; // 密碼hash需要

const router = express.Router(); // 子路由，只包含method(get, post, use...)

router.delete('/', async (req, res) => {
    const email = req.headers['user-email']; // express規定小寫查詢
    console.log(email);

    try {
        const deleteSql = 'DELETE FROM account WHERE email = ?';
        const [isDelEmail] = await db.execute(deleteSql, [email]);

        if (isDelEmail.affectedRows > 0) {
            // 如果 affectedRows > 0，代表至少有一行被刪除
            res.status(200).json({ success: true, message: '成功註銷帳號',  });
        } else {
            // 如果 affectedRows == 0，代表沒有找到符合條件的 email
            res.status(404).json({ success: false, message: '註銷失敗' });
        }
         
    } catch (err) {
        console.error('查詢失敗', err);
        // 處理資料庫連線或寫入錯誤
        return res.status(500).json({ success: false, message: '伺服器內部錯誤，查詢失敗。' });
    }
});

export default router;