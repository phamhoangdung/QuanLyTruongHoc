const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var DanToc = mongoose.Schema({
    TenDanToc: { type: String, require: true }
}, schemaOptions)
DanToc.plugin(mongoosePaginate);
module.exports = mongoose.model('DanToc', DanToc)