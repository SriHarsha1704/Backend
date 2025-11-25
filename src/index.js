import DB from './db/database.js';
import app from './app.js';


const PORT = process.env.PORT || 5000;
DB().then(()=>{
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
})
.catch((err)=>
{
  console.log("MONGO CONNECTION ERROR",err);
})

