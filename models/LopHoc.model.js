const mongoose = require('mongoose');
var schemaOptions = {
    timestamps = { createdAt = 'created_at' },
}
var LopHoc = mongoose.Schema({
    TenLop: { type: String, require: true },
    SiSo: Number,
    Khoi_id: { type: mongoose.Schema.Types.ObjectId, ref: "Khoi" },
    NamHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "NamHoc" },
    GiaoVienChuNhiem_id: { type: mongoose.Schema.Types.ObjectId, ref: "GiaoVien" }
}, schemaOptions)

module.exports = mongoose.model('LopHoc', LopHoc)