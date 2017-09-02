const fs = require('fs');
const models = require('../models/' + process.env.DB_TYPE);

let lib = {};

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
    var cd = file.replace ('.js', '');
    lib[cd] = require('./' + file)(models);
});

module.exports = lib;
