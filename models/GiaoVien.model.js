const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var GiaoVien = mongoose.Schema({
    Ho: { type: String, require: true },
    Ten: { type: String, require: true },
    NgaySinh: Date,
    GioTinh: Number,
    DiaChi: String,
    DienThoai: String,
    Email: String,
    AnhDaiDien: { type: String, default: "" }, // ảnh đại diện
    MonHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "MonHoc" },
    DanToc_id: { type: mongoose.Schema.Types.ObjectId, ref: "DanToc" },
    TonGiao_id: { type: mongoose.Schema.Types.ObjectId, ref: "TonGiao" },
    TaiKhoan: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, schemaOptions)
GiaoVien.index({ '$**': 'text' });
GiaoVien.plugin(mongoosePaginate);
module.exports = mongoose.model('GiaoVien', GiaoVien)