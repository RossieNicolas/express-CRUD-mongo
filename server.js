const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var db;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());

MongoClient.connect('mongodb://localhost:27017/person', (err, client) => {
    if (err) return console.log(err);
    db = client.db('person');
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
});

app.get('/', (req, res) => {
    res.redirect('/list')
});

app.get('/list', (req, res) => {
    db.collection('person').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('list.ejs', { people: result })
    })
});

app.get('/add', (req, res) => {
    res.render('add.ejs', {})
});

app.post('/add', (req, res) => {
    db.collection('person').insertOne(req.body, (err, result) => {
        if (err) return console.log(err);
        res.redirect('/list')
    })
});

app.post('/edit', (req,res) => {
    const query = {'firstname': req.body.firstname};
    console.log(query);
   db.collection('person').findOneAndUpdate(query, {$set: req.body}, (err, result) => {
       if (err) return console.log(err);
       res.redirect('/list')
   })
});

app.get('/search', (req, res) => {
    res.render('search.ejs', { product: '' })
});

app.post('/search', (req, res) => {
    var query = { firstname: req.body.firstname };
    db.collection('person').find(query).toArray(function(err, result) {
        if (err) return console.log(err);
        if (result == '')
            res.render('search_not_found.ejs', {});
        else
            res.render('search_result.ejs', { person: result[0] })
    });
});

app.post('/delete', (req, res) => {
    db.collection('person').findOneAndDelete({ firstname: req.body.firstname }, (err, result) => {
        if (err) return res.send(500, err)
        res.redirect('/list')
    })
});