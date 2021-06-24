const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})
// serves css as static
app.use(express.static(path.join(__dirname,"public")));
app.set('view', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
//render HTML
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.sendFile(__dirname + "/index.html", { shortUrls: shortUrls });

})
//shortUrls
app.post('/shortUrls', async (req, res) => {
    if(!req.body.shortUrl || !req.body.fullUrl){
        return res.send("No full url/short url provided")
    }
    const urlExists = await ShortUrl.exists({short: req.body.ShortUrl});
    if(urlExists){
        return res.send("shortUrl already exists");
    };
    try{
        await ShortUrl.create({ full: req.body.fullUrl,short:req.body.shortUrl }).then(shortUrl => {
            return res.render('url', {shortUrl: shortUrl})
        });
        
    }catch(e){
        res.send("Database error")
        throw e;
    }
  
    res.redirect('/')
})
app.get("/:url",async (req,res) => {
    const url = await ShortUrl.findOne({short: req.params.url});
    if(!url){
        return res.send("404")
    }
    return res.redirect(url.full);
})
//runs on port 5000
app.listen(process.env.PORT || 5000);
