const mongoose = require('mongoose');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var TonGiao = mongoose.Schema({
    TenTonGiao: { type: String, require: true }
}, schemaOptions)

module.exports = mongoose.model('TonGiao', TonGiao)