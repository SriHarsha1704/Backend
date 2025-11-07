import express from 'express';
import dotenv from 'dotenv';
import DB from './db/database.js';
import app from './app.js';
dotenv.config();
const app1 = express();
DB();
const PORT = process.env.PORT || 5000;
app1.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
