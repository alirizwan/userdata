module.exports = models => ({
    get(req){
        return models.User.find().then(data => {
            return { data: data };
        });
    },

    getById(req){
        return models.User.findById(req.query.id).then(data => {
            return { data: data };
        });
    },

    find(req){
        console.log(req.query);
        return models.User.find({
            where: req.query
        }).then(data => {
            return { data: data };
        });
    },

    create(req){
        return models.User.create(req.body).then(data => {
            return { data: data };
        });
    }
});
