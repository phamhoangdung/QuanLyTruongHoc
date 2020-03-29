const mongoose = require('mongoose');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}
var HocKy = mongoose.Schema({
    tenHocKy: {type: String, require: true},
    heSo: { type: Number, require: true }
}, schemaOptions)

module.exports = mongoose.model('HocKy', HocKy)