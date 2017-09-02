const fs = require('fs');
const AWS = require('aws-sdk');
const DOC = require("dynamodb-doc");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const dynamo = new DOC.DynamoDB();

let models = {};

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
    var cd = file.replace ('.js', '');
    models[cd] = require('./' + file)(dynamo);
});

module.exports = models;
