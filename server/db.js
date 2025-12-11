import mysql from 'mysql2';
// import 'dotenv/config'; // 如果使用環境變數

//使用 dotenv 變數，把環境變數儲存在 .env 檔案當中統一管理
const db = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "side_project",
  })
  .promise();
//正式寫法
// const db = mysql
//   .createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//   })
//   .promise();

export default db;