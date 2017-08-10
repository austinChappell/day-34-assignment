const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      { Client } = require('pg'),
      mustache = require('mustache-express');

require('dotenv').config();

let port = process.env.PORT || 3000;

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
  const client = new Client();
  client.connect()
    .then(() => {
      return client.query('SELECT * FROM books');
    })
    .then((results) => {
      let data = results.rows
      console.log(data);
      res.render('index', { data });
    })
});

app.get('/entry', (req, res) => {
  res.render('entry');
});

app.post('/entry', (req, res) => {
  let form = req.body;
  const client = new Client();
  client.connect().then(() => {
    const sql = 'INSERT INTO books (title, author, publisher, year, image_url) VALUES ($1, $2, $3, $4, $5)';
    const params = [form.title, form.author, form.publisher, form.year, form.image_url];

    client.query(sql, params).then(() => {
      res.redirect('/');
    });
  });
});





app.listen(port, () => {
  console.log(`Your app is running on PORT ${ port }.`);
});
