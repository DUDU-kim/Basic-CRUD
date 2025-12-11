import express from 'express';
import db from '../db.js';
// import bcrypt from 'bcrypt'; // 密碼hash需要

const router = express.Router(); // 子路由，只包含method(get, post, use...)


// 定義一個檢查欄位是否為空的函數
// !field代表假值， 包含false, 0, "", null, undefined。
// String(field).trim().length === 0 防止 " " 的情況
const isInvalid = (field) => !field || String(field).trim().length === 0;

// 註冊帳號
router.post('/', async (req, res) => {
    // 1. 獲取前端傳來的 req.body
    const receivedData = req.body;
    
    // 2. 輸出到伺服器終端機
    console.log(receivedData);

    // 檢查所有欄位，只要任一欄位為空就返回錯誤
    const { name, age, email, password, sex } = receivedData;
    
    if (isInvalid(name)) {
        return res.status(400).json({ success: false, message: '尚未完成填寫！' });
    }
    if (isInvalid(age)) {
        return res.status(400).json({ success: false, message: '尚未完成填寫！' });
    }
    if (isInvalid(email)) {
        return res.status(400).json({ success: false, message: '尚未完成填寫！' });
    }
    if (isInvalid(password)) {
        return res.status(400).json({ success: false, message: '尚未完成填寫！' });
    }
    if (isInvalid(sex)) {
        return res.status(400).json({ success: false, message: '尚未完成填寫！' });
    }


    try {
        // 檢查 Email 是否已存在 (防止重複註冊)
        const checkSql = 'SELECT email FROM account WHERE email = ?';
        const [existingUser] = await db.execute(checkSql, [email]);
        
        if (existingUser.length > 0) {
            return res.status(409).json({ success: false, message: '此 Email 已經被註冊。' }); // 409 Conflict
        }

        // const hashedPassword = await bcrypt.hash(password, 10);

        // 寫入資料庫
        const insertSql = `
            INSERT INTO account 
            (Name, Age, Email, Password, Sex) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const values = [name, age, email, password, sex];
        
        // 使用 await 執行 SQL 寫入
        const [result] = await db.execute(insertSql, values); 

        // 返回成功的響應 (201: Created)
        res.status(200).json({ 
            success: true, 
            message: '帳號創建成功，資料已寫入資料庫！',
            userId: result.insertId // 返回新創建用戶的 ID (資料庫有設置才能寫)
        });

    } catch (err) {
        console.error('資料庫寫入或註冊失敗:', err);
        // 處理資料庫連線或寫入錯誤
        return res.status(500).json({ success: false, message: '伺服器內部錯誤，註冊失敗。' });
    }
});

export default router;