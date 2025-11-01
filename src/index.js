import express from 'express';
import dotenv from 'dotenv';
import DB from './db/index.js';
dotenv.config();
const app = express();
DB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
