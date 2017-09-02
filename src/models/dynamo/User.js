const phone = require('phone');
const crypto = require('crypto-js');
const uuid = require('uuid/v4');
const libphonenumber = require('libphonenumber-js')
const emailRegEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

const TABLE = 'MyJar-Users';

const phoneNumberDecryptor = value => {
    if(!value) return null;
    return crypto.AES.decrypt(value, process.env.APP_SECRET).toString(crypto.enc.Utf8);
};

module.exports = db => ({
    find(options){

        options = options || {};
        let params = { TableName: TABLE };

        if(options.where){

            let queries = [];

            if(options.where.id){
                params.KeyConditions = [db.Condition('id', 'EQ', options.where.id)]
                options.where.id = null;
            }

            for(let clause in options.where){
                if(options.where[clause]){
                    queries.push(db.Condition(clause, 'CONTAINS', options.where[clause]))
                }
            }

            params.ScanFilter = queries;

        }

        if(options.limit){
            params.limit = options.limit;
        }

        return new Promise((resolve, reject) => {

            db.scan(params, (err, result) => {
                if(err){
                    reject(err);
                }else{

                    result.Items.forEach((user, index) => {
                        result.Items[index].phone = phoneNumberDecryptor(user.phone).slice(-4);
                    });

                    resolve(result.Items);
                }
            });
        });

    },

    findById(id){
        return new Promise((resolve, reject) => {

            db.getItem({
                TableName: TABLE,
                Key: { id: id }
            }, (err, result) => {
                if(err){
                    reject(err);
                }else{

                    if(result && result.Item){
                        result.Item.phone = result.Item.phone ? phoneNumberDecryptor(result.Item.phone).slice(-4) : null;
                        resolve(result.Item);
                    }else{
                        resolve(null);
                    }


                }
            });
        });
    },

    create(data, options){
        if(!data.email || !emailRegEx.test(data.email)){
            throw Error('Invalid email address.');
        }

        if(!data.phone || !libphonenumber.isValidNumber(data.phone, 'GB')){
            throw Error('Invalid phone number.');
        }

        data.phone = crypto.AES.encrypt(libphonenumber.format(data.phone, 'GB', 'International_plaintext'), process.env.APP_SECRET).toString();
        data.id = uuid();

        return new Promise((resolve, reject) => {

            db.putItem({
                TableName: TABLE,
                Item: data
            }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    this.findById(data.id).then(user => {
                        resolve(user);
                    });
                }
            });

        });

    }
});
