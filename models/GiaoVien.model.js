const mongoose = require('mongoose');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}
var GiaoVien = mongoose.Schema({
    tenGiaoVien: { type: String, require: true },
    GioTinh: Boolean,
    DiaChi: String,
    DienThoai: String,
    Email: String,
    MonHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "MonHoc" }
}, schemaOptions)

module.exports = mongoose.model('GiaoVien', GiaoVien)