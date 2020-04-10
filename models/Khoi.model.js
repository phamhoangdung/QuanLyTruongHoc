const mongoose = require('mongoose');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var Khoi = mongoose.Schema({
    TenKhoi: { type: String, require: true },
}, schemaOptions)

module.exports = mongoose.model('Khoi', Khoi)