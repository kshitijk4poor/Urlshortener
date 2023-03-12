const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')


// setup app and database
mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
});
const app = express();

// serves css as static
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

//render HTML
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname,"views","index.html"));

})

// creates short url
app.post('/shortUrls', async (req, res) => {
    if(!req.body.shortUrl || !req.body.fullUrl){
        return res.send("No full url/short url provided")
    }else if(req.body.shortUrl.length < 3){
        return res.send("Short url length cannot be less than 3 characters");
    }
    const urlExists = await ShortUrl.exists({short: req.body.shortUrl})
    if(urlExists){
        return res.send("short url already exists");
    };
    try{
        await ShortUrl.create({ full: req.body.fullUrl,short:req.body.shortUrl }).then(shortUrl => {
            return res.render('url', {shortUrl: shortUrl})
        });
        
    }catch(e){
        res.send("database error")
        console.log(e);
    }
})

// open short url
app.get("/:url",async (req,res) => {
    const url = await ShortUrl.findOne({short: req.params.url});
    if(!url){
        return res.sendFile(path.join(__dirname,"views","404.html"))
    }
    return res.redirect(url.full);
})

// Start listening
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
