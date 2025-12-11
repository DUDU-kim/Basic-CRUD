import express from 'express';
import cors from 'cors';
import userRoutes from './routes/CreateAccountRoutes.js'; 
import loginRoutes from './routes/LoginRoutes.js'; 
import verifyRoutes from './routes/VerifyRoutes.js'; 
import newpassRoutes from './routes/NewPasswordRoutes.js'; 
import homePostRoutes from './routes/HomePostRoutes.js';
import homeGetRoutes from './routes/HomeGetRoutes.js';
import homeGetDelRoutes from './routes/HomeGetDelRoutes.js';



import db from './db.js'; 


const app = express(); // 主路由
app.use(cors());
app.use(express.json());

/**
 * 檢查資料庫連線狀態並報告
 */
async function checkDatabaseConnection() {
    try {
        // 使用 db.ping() 發送一個輕量級請求給資料庫
        await db.ping();
        console.log('✅ 資料庫連線成功 (DB Ping OK).');
    } catch (error) {
        console.error('❌ 資料庫連線失敗！請檢查配置和 MySQL 服務是否運行。');
        console.error('錯誤詳情:', error.message);
        // 如果資料庫無法連線，通常可以選擇退出應用程式，避免後續所有路由都出錯。
        // process.exit(1); 
    }
}

// 在啟動伺服器前先檢查資料庫連線
checkDatabaseConnection();

// 將所有以 /api/users 開頭的請求都導向 userRoutes 模組處理
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/newpass', newpassRoutes);
app.use('/api/home_post', homePostRoutes);
app.use('/api/home_get', homeGetRoutes);
app.use('/api/home_get/del', homeGetDelRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Connected to backend on port ${PORT}.`);
});
//正式寫法
// app.listen(process.env.SERVER_PORT, () => {
//   console.log('Connected to backend.');
// });





// --建構 API--
/*
- 動態構建查詢： 查詢語句在運行時拼接，依賴輸入值構建最終的 SQL 字符串。
- 易受 SQL Injection 攻擊： 如果用戶輸入未經過適當的處理（如 userInput 包含惡意 SQL），可能導致 SQL 注入攻擊。
- 無法重複使用查詢計劃： 每次執行查詢時，必須重新解析和最佳化查詢。
*/
// app.get('/api/account', async (req, res) => {
//   try {
//     const sql = 'SELECT * FROM account';
//     const [result] = await db.query(sql);
//     res.status(200).json(result);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to fetch account' });
//   }
// });

/*
// --預處理--
預編譯查詢模板： 查詢的結構（如字段名和表名）在第一步就被數據庫解析，後續執行時只需插入值，不需要重新解析 SQL 語法。
防止 SQL Injection： 用戶輸入的值不直接拼接到查詢中，而是作為參數傳遞給數據庫，數據庫將它們當作純數據處理，無法改變查詢邏輯。
提升性能（在重複執行場景）： 由於查詢計劃被預編譯，可以多次重用，不需要每次執行都進行解析和最佳化。
*/
// app.post('/api/account', async (req, res) => {
//   try {
//     const sql = 'INSERT INTO account(`title`, `desc`, `cover`) VALUES (?, ?, ?)';
//     const values = [req.body.title, req.body.desc, req.body.cover];
//     const [result] = await db.execute(sql, values);
//     res.status(201).json({ message: 'Account created successfully', bookId: result.insertId });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to create account' });
//   }
// });

// app.delete('/api/books/:id', async (req, res) => {
//   try {
//     const sql = 'DELETE FROM books WHERE id = ?';
//     const bookId = req.params.id;
//     const [result] = await db.execute(sql, [bookId]);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Book not found' });
//     }
//     res.status(200).json({ message: 'Book deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to delete book' });
//   }
// });

// app.put('/api/books/:id', async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const sql = 'UPDATE books SET `title`= ?, `desc`= ?, `cover`= ? WHERE id = ?';
//     const values = [req.body.title, req.body.desc, req.body.cover];
//     const [result] = await db.execute(sql, [...values, bookId]);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Book not found' });
//     }
//     res.status(200).json({ message: 'Book updated successfully' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to update book' });
//   }
// });