import mysql from 'mysql2';
import { config } from '../config.js';
//DB에 접속 MYSQL 시행
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
});

export const db = pool.promise();
