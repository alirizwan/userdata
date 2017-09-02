module.exports = (req, libs) => ({

    '/': ({
        get(){
            if(req.query.id){
                return libs.User.getById(req);
            }else{
                return libs.User.get(req);
            }
        },

        post(){
            return libs.User.create(req);
        }
    }),

    'search/': ({
        get(){
            return libs.User.find(req);
        }
    })

});
