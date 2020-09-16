const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema({
    portfolioId: {
        type: mongoose.Schema.ObjectId,
        ref: 'portfolio'
    },
    stock_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'stock'
    },
    quantity: {
        type: Number
    },
    price: {
        type: mongoose.Types.Decimal128
    },
    created_at: Date
});

mongoose.connect(config.get('databaseSettings.mongo.connectionUrl'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).catch(error => console.log(error));

module.exports = mongoose.model('trade', tradeSchema);