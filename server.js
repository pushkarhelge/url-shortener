const express = require('express');
const mongoose = require('mongoose'); 
const app = express();

const port = 80;
const ShortUrl = require('./models/shortUrl')

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost/urlShortener',{
    useNewUrlParser : true, useUnifiedTopology: true
})


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))

app.get('/', async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls});
})

app.post('/shortUrls',async (req,res)=>{
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/');
})

app.get('/:shortUrl',async (req,res)=>{
   const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
   if(shortUrl == null) return res.sendStatus(404);

   shortUrl.clicks++;
   shortUrl.save();
   res.redirect(shortUrl.full);
})



// app.listen(process.ennv.PORT || 5000,()=>{})
app.listen(port,()=>{
    console.log(`Server is Listening at port ${port}`);
})