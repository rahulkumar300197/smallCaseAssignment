const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    hashed_password: String,
    is_deleted: Boolean,
    created_at: Date
});

mongoose.connect(config.get('databaseSettings.mongo.connectionUrl'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).catch(error => console.log(error));

module.exports = mongoose.model('user', userSchema);