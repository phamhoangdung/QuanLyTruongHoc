const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var GiaoVien = mongoose.Schema({
    TenGiaoVien: { type: String, require: true },
    GioTinh: Boolean,
    DiaChi: String,
    DienThoai: String,
    Email: String,
    AnhDaiDien: String, // ảnh đại diện
    // MonHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "MonHoc" },
    // DanToc_id: { type: mongoose.Schema.Types.ObjectId, ref: "DanToc" },
    // TonGiao_id: { type: mongoose.Schema.Types.ObjectId, ref: "TonGiao" },
}, schemaOptions)
GiaoVien.plugin(mongoosePaginate);
module.exports = mongoose.model('GiaoVien', GiaoVien)