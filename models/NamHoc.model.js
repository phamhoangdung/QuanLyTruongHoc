const mongoose = require('mongoose');
var schemaOptions = {
    timestamps = { createdAt = 'created_at' },
}
var NamHoc = mongoose.Schema({
    TenNamHoc: { type: String, require: true },
}, schemaOptions)

module.exports = mongoose.model('NamHoc', NamHoc)