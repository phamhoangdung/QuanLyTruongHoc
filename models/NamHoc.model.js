const mongoose = require('mongoose');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var NamHoc = mongoose.Schema({
    TenNamHoc: { type: String, require: true },
}, schemaOptions)

module.exports = mongoose.model('NamHoc', NamHoc)