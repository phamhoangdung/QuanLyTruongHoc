const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var HocKy = mongoose.Schema({
    TenHocKy: {type: String, require: true},
    HeSo: { type: Number, require: true },
    Status: { type: Boolean, default: false }
}, schemaOptions)
HocKy.plugin(mongoosePaginate);
module.exports = mongoose.model('HocKy', HocKy)