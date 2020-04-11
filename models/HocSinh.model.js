const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var HocSinh = mongoose.Schema({
    Ho: { type: String, require: true },
    Ten: { type: String, require: true },
    GioiTinh: { type: Number, require: true },
    NgaySinh: Date,
    DiaChi: String,
    QueQuan: String,
    AnhDaiDien: String,
    DanToc_id: { type: mongoose.Schema.Types.ObjectId, ref: "DanToc" },
    TonGiao_id: { type: mongoose.Schema.Types.ObjectId, ref: "TonGiao" },
    TaiKhoan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TaiKhoan' }
}, schemaOptions)
HocSinh.plugin(mongoosePaginate);
module.exports = mongoose.model('HocSinh', HocSinh)