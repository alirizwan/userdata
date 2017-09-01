module.exports = models => ({
    get(req){
        return models.User.find().then(data => {
            return { data: data };
        });
    },

    create(req){
        return models.User.create(req.body).then(data => {
            return { data: data };
        });
    }
});
