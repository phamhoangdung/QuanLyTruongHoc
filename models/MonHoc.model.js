const mongoose = require('mongoose');
var schemaOptions = {
    timestamps = { createdAt = 'created_at' },
}
var MonHoc = mongoose.Schema({
    tenMonHoc: { type: String, require: true },
    soTiet: { type: Number, require: true }
}, schemaOptions)

module.exports = mongoose.model('MonHoc', MonHoc)