require('dotenv').config();

const http = require('http');
const port = process.env.port || 3000;
const server = http.createServer(require('./src/routes'));
server.listen(port, err => {
    if(err){
        return console.log(err);
    }
    console.log(`Running Server on Port ${ port }`);
});
