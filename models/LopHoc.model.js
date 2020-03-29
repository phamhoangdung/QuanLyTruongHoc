const mongoose = require('mongoose');
var schemaOptions = {
    timestamps = { createdAt = 'created_at' },
}
var LopHoc = mongoose.Schema({
    tenLop: { type: String, require: true },
    siSo: Number,
    khoi_id: { type: mongoose.Schema.Types.ObjectId, ref: "Khoi" },
    namHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "NamHoc" },
    giaoVienChuNhiem_id: { type: mongoose.Schema.Types.ObjectId, ref: "GiaoVien" }
}, schemaOptions)

module.exports = mongoose.model('LopHoc', LopHoc)