const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    name: {
        type: String
    },
    tickerSymbol: {
        type: String,
        index: true
    },
    currentPrice: {
        type: mongoose.Types.Decimal128
    },
    modified_at: Date
});

//mongoose.Promise = global.Promise;
mongoose.connect(config.get('databaseSettings.mongo.connectionUrl'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).catch(error => console.log(error));

module.exports = mongoose.model('stock', stockSchema);