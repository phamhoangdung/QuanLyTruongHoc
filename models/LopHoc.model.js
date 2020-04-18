const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var LopHoc = mongoose.Schema({
    TenLopHoc: { type: String, require: true },
    SiSo: Number,
    Khoi_id: { type: mongoose.Schema.Types.ObjectId, ref: "Khoi" },
    NamHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "NamHoc" },
    GiaoVien_id: { type: mongoose.Schema.Types.ObjectId, ref: "GiaoVien" },
    status: { type: Number, default: 1 }
}, schemaOptions)
LopHoc.plugin(mongoosePaginate);
module.exports = mongoose.model('LopHoc', LopHoc)