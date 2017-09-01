const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
    if(err){
        throw new Error(err);
    }
});

let models = {};

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
    var cd = file.replace ('.js', '');
    models[cd] = require('./' + file)(connection);
});

module.exports = models;
