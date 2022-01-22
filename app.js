require('dotenv').config();

const cors = require('cors'),
      express = require('express'),
      {json, urlencoded} = express,
      mongoose = require('mongoose');


const app = express()

mongoose.connect(process.env.MONGO_URI)

app.use(cors(
    {
        origin : 'http://time-trac.vercel.app'
    }
))
app.use(json())
app.use(urlencoded({extended : false}));

const authRoutes = require('./routes/auth');
app.use('/api/auth' , authRoutes);
const projectRoutes = require('./routes/project');
app.use('/api/projects' , projectRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server has started on port ${PORT} `)
})