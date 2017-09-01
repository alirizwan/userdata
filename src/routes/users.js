module.exports = (req, libs) => ({

    '/': ({
        get(){
            return libs.User.get(req);
        },

        post(){
            return libs.User.create(req);
        }
    }),

    'search/': ({
        get(){
            return libs.User.get(req);
        }
    })

});
