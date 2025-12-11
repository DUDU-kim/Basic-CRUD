import express from 'express';
import db from '../db.js';
import nodemailer from 'nodemailer'; // 引入 Nodemailer 函式庫
// import bcrypt from 'bcrypt'; // 密碼hash需要

const router = express.Router(); // 子路由，只包含method(get, post, use...)


const transporter = nodemailer.createTransport({
    service: 'gmail', // 使用 Gmail
    auth: {
        // YOUR_EMAIL@gmail.com(.env)
        user: 'inging900610@gmail.com', 
        // YOUR_APP_PASSWORD
        pass: 'hgdsqsvxvbaygbgh' 
    },
});


// 隨機生成一個四位數字的驗證碼
const generateOTP = () => {
    // 產生 0 到 9999 之間的亂數
    const otp = Math.floor(Math.random() * 10000);
    // 確保數字前面補 0，使其成為四位數 (例如 123 -> "0123")
    return String(otp).padStart(4, '0');
};


router.post('/', async (req, res) => {
    const receivedData = req.body;

    //比對帳密
    const {email} = receivedData;
    console.log(email);

    try {
        const selectSql = 'SELECT email FROM account WHERE email = ?';
        const [isEmail] = await db.execute(selectSql, [email]);

        if (isEmail.length === 0) {
            return res.status(401).json({ success: false, message: '用戶不存在。' }); // 409 Conflict
        }

        // const [{ email: userEmail, password: userPassword }] = isExistingUser;
        // console.log(userEmail);
        // console.log(userPassword);

        // 生成並發送驗證碼
        const otpCode = generateOTP();

        const mailOptions = {
            from: 'inging900610@gmail.com', // 發件人 (需與 transporter.auth.user 一致，實際也須用.env)
            to: email, // 收件人
            subject: '驗證碼', // 郵件標題
            text: `驗證碼是 ${otpCode}。請在 5 分鐘內輸入。`, // 純文字內容
            html: `<p>您的<strong>驗證碼</strong>是：</p>
                   <p style="font-size: 28px; font-weight: bold; color: #0D9488;">${otpCode}</p>
                   <p>此驗證碼將在 5 分鐘後過期。</p>`, // HTML 內容
        };

        // 寄送郵件
        const info = await transporter.sendMail(mailOptions);
        console.log('郵件發送成功: %s', info.messageId);

        // 返回成功的響應 (200: ok)
        res.status(200).json({ 
            success: true, 
            message: '',
        });
        
    } catch (err) {
        console.error('查無此用戶', err);
        // 處理資料庫連線或寫入錯誤
        return res.status(500).json({ success: false, message: '伺服器內部錯誤，查詢失敗。' });
    }
});

export default router;