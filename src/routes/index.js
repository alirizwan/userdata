const querystring = require('querystring');
const libs = require('../libs');    // to avoid requiring them for each call and to control from one place.

const responseHandler = (data, res) => {
    res.statusCode = data.status || 200;
    res.setHeader('Content-Type', 'json/application');
    res.end(JSON.stringify(data.data));
};

const requestParser = (req, res) => {
    return new Promise((resolve, reject) => {

        let queryData = ``;

        if(req.method == 'POST' || req.method == 'PUT') {
            req.on('data', function(data) {
                queryData += data;
                if(queryData.length > 1e6) {
                    queryData = "";
                    reject("Invalid data.");
                    req.connection.destroy();
                }
            });

            req.on('end', function() {
                req.body = JSON.parse(queryData);
                resolve(req);
            });

        }else{
            resolve(req);
        }
    });

}

module.exports = (req, res) => {

    //TODO Replace simple url split with a proper url parser
    let urls = req.url.split('/');
    urls.forEach((path, index) => {
        urls[index] = path === '' ? '/' : path;
    });
    urls = urls.concat(urls[urls.length - 1] === '/' ? [] : '/');
    const route = urls.splice(2).join('');

    requestParser(req, res).then(request => {
        return require('./' + urls[1])(request, libs)[route][req.method.toLowerCase()]().then(data => {
            responseHandler(data, res);
        });
    }).catch(err => {
        responseHandler({ status: 500, data: { message: err.message } }, res);
    });

};
