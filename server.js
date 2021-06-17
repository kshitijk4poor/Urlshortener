const express = require('express');
const app = express();
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})
// serves css as static
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }))
//render HTML
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.sendFile(__dirname + "/index.html", { shortUrls: shortUrls });

})
//shortUrls
app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
  
    res.redirect('/')
  })
//runs on port 5000
app.listen(process.env.PORT || 5000);