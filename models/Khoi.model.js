const mongoose = require('mongoose');
var schemaOptions = {
    timestamps = { createdAt = 'created_at' },
}
var Khoi = mongoose.Schema({
    TennKhoi: { type: String, require: true },
}, schemaOptions)

module.exports = mongoose.model('Khoi', Khoi)