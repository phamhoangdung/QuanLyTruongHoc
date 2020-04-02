const mongoose = require('mongoose');
var schemaOptions = {
    timestamps = { createdAt = 'created_at' },
}
var MonHoc = mongoose.Schema({
    TenMonHoc: { type: String, require: true },
    SoTiet: { type: Number, require: true }
}, schemaOptions)

module.exports = mongoose.model('MonHoc', MonHoc)