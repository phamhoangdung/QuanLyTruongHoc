const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var MonHoc = mongoose.Schema({
    TenMonHoc: { type: String, require: true },
    SoTiet: { type: Number, require: true }
}, schemaOptions)
MonHoc.plugin(mongoosePaginate);
module.exports = mongoose.model('MonHoc', MonHoc)