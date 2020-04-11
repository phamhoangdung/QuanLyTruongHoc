const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var TonGiao = mongoose.Schema({
    TenTonGiao: { type: String, require: true }
}, schemaOptions)
TonGiao.plugin(mongoosePaginate);
module.exports = mongoose.model('TonGiao', TonGiao)