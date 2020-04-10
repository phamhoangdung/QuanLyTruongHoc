const mongoose = require('mongoose');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var HocKy = mongoose.Schema({
    TenHocKy: {type: String, require: true},
    HeSo: { type: Number, require: true }
}, schemaOptions)

module.exports = mongoose.model('HocKy', HocKy)