const mongoose = require('mongoose');

const CONNECT_STRING = 'mongodb://127.0.0.1/art';
mongoose.set('strictQuery', true);

module.exports = async (app) => {
    try {
        await mongoose.connect(CONNECT_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Seccesful connect to database');
    } catch (error) {
        console.log('invalid connection');
        console.error(error);
        process.exit(1);
    }
}