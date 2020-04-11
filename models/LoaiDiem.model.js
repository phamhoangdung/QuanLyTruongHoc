const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var LoaiDiem = mongoose.Schema({
    TenLoaiDiem:String,
    HeSo: Number
}, schemaOptions)
LoaiDiem.plugin(mongoosePaginate);
module.exports = mongoose.model('LoaiDiem', LoaiDiem)