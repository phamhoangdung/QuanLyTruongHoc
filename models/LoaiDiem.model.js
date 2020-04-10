const mongoose = require('mongoose');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var LoaiDiem = mongoose.Schema({
    TenLoaiDiem:String,
    HeSo: Number
}, schemaOptions)

module.exports = mongoose.model('LoaiDiem', LoaiDiem)