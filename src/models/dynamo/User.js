const phone = require('phone');
const crypto = require('crypto-js');
const libphonenumber = require('libphonenumber-js')
const emailRegEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

const TABLE = 'Users';

const phoneNumberDecryptor = value => {
    if(!value) return null;
    return crypto.AES.decrypt(value, process.env.APP_SECRET).toString(crypto.enc.Utf8);
};

module.exports = db => ({
    find(options){

        options = options || {};

        const fields = options.fields ? options.fields.join(`${ TABLE },`) : '*';
        const limit = options.limit ? `LIMIT ${ options.limit }, ${ options.offset || 0 }` : ``;
        const order = options.order ? options.order : `ORDER BY id ASC`;
        let where = ``;

        if(options.where){
            for(let clause in options.where){
                if(where === ''){
                    where = where + `WHERE ${ clause } = ${ options.where[clause] }`;
                }else{
                    where = where + `AND ${ clause } = ${ options.where[clause] }`;
                }
            }
        }

        const sql = `SELECT ${ fields } FROM ${ TABLE } ${ where } ${ limit } ${ order }`;

        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if(err){
                    reject(err);
                }else{

                    result.forEach((user, index) => {
                        result[index].phone = phoneNumberDecryptor(user.phone).slice(-4);
                    });

                    resolve(result);
                }
            });
        });

    },

    findById(id){
        return this.find({ where: { id: id } }).then(rows => {
            return rows.length ? rows[0] : null;
        });
    },

    create(data, options){
        if(!data.email || !emailRegEx.test(data.email)){
            throw Error('Invalid email address.');
        }

        if(!data.phone || !libphonenumber.isValidNumber(data.phone, 'GB')){
            throw Error('Invalid phone number.');
        }

        data.phone = crypto.AES.encrypt(libphonenumber.format(data.phone, 'GB', 'International_plaintext'), process.env.APP_SECRET);

        let fields = [];
        let values = [];
        for(let field in data){
            fields.push(field);
            values.push(data[field]);
        }
        const sql = `INSERT INTO ${ TABLE }(${ fields.join() }) VALUES('${ values.join(`','`) }')`;

        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if(err){
                    reject(err);
                }else{
                    this.findById(result.insertId).then(user => {
                        resolve(user);
                    });
                }
            });
        });

    }
});
