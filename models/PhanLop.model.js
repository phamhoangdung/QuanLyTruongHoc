const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var PhanLop = mongoose.Schema({
    LopHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "LopHoc" },
    NamHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "NamHoc" },
    Khoi_id: { type: mongoose.Schema.Types.ObjectId, ref: "Khoi" },
    HocSinhs: [{ type: mongoose.Schema.Types.ObjectId, ref: "HocSinh" }]
}, schemaOptions)
PhanLop.index({ '$**': 'text' });
PhanLop.plugin(mongoosePaginate);
module.exports = mongoose.model('PhanLop', PhanLop)