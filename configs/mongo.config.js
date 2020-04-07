const mongoose = require('mongoose');
const chalk = require('chalk');
// please hide connect string !!!

module.exports = mongoose.connect(process.env.MONGODB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("%s MongoDB connect success", chalk.green('✓'));
}).catch((error) => {
    console.log("%s MongoDB connect failed ", chalk.red('✗'));
    process.exit();
});