const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var Khoi = mongoose.Schema({
    TenKhoi: { type: String, require: true },
    Status: { type: Boolean, default: false }
}, schemaOptions)
Khoi.index({'$**': 'text'});
Khoi.plugin(mongoosePaginate);
module.exports = mongoose.model('Khoi', Khoi)