const express = require('express');
const mongoose = require('mongoose');

// A COMPLETER AU NIVEAU DE l'URL
// mongoose.connect('mongodb+srv://Apoxys:ynaFLQ28-+@cluster0. x .mongodb.net/test?retryWrites=true&w=majority',
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => console.log('Connexion à MongoDB réussie !'))
//     .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json()); // Allows acces to request body if Content-Type is application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

module.exports = app;