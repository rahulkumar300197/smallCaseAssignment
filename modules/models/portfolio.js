const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        unique: true,
        index: true
    },
    stocks: [{
        stock_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'stock'
        },
        quantity: {
            type: Number
        },
        average_buy_price: {
            type: mongoose.Types.Decimal128
        }
    }],
    modified_at: Date
});

mongoose.connect(config.get('databaseSettings.mongo.connectionUrl'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).catch(error => console.log(error));

module.exports = mongoose.model('portfolio', portfolioSchema);