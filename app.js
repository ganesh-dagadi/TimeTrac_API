require('dotenv').config();

const cors = require('cors'),
      express = require('express'),
      {json, urlencoded} = express,
      mongoose = require('mongoose'),
      cookieParser = require('cookie-parser'),
      errorHandler = require('./middleware/errorHandler')


const app = express()

mongoose.connect(process.env.MONGO_URI)

app.use(cors(
    {
        origin : 'https://time-trac.vercel.app',
        methods : ['GET' , 'POST' , 'PUT' , 'DELETE']
    }
))
app.use(json())
app.use(urlencoded({extended : false}));
app.use(cookieParser());

const authRoutes = require('./routes/auth');
app.use('/api/auth' , authRoutes);
const projectRoutes = require('./routes/project');
app.use('/api/projects' , projectRoutes)
app.use(errorHandler);
app.all('*' , (req , res)=>{
    res.status(404).json({error : "Resource not found"})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server has started on port ${PORT} `)
})