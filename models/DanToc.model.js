const mongoose = require('mongoose');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}
var DanToc = mongoose.Schema({
    TenDanToc: { type: String, require: true }
}, schemaOptions)

module.exports = mongoose.model('DanToc', DanToc)