const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var NamHoc = mongoose.Schema({
    TenNamHoc: { type: String, require: true },
    Status: { type: Boolean, default: false }
}, schemaOptions)
NamHoc.index({'$**': 'text'});
NamHoc.plugin(mongoosePaginate);
module.exports = mongoose.model('NamHoc', NamHoc)