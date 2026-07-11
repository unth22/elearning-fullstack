const { Pool } = require("pg");
require("dotenv").config();

// Pool quản lý nhiều kết nối tới PostgreSQL cùng lúc,
// hiệu quả hơn là mở/đóng 1 connection cho mỗi request.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Lỗi kết nối PostgreSQL:", err.message);
});

module.exports = pool;
