const mongoose = require('mongoose');
var schemaOptions = {
    timestamps = { createdAt = 'created_at' },
}
var HocSinh = mongoose.Schema({
    hoTen: { type: String, require: true },
    gioiTinh: { type: Number, require: true },
    ngaySinh: Date,
    noiSinh: String,
    danToc_id: { type: mongoose.Schema.Types.ObjectId, ref: "DanToc" },
    tonGiao_id: { type: mongoose.Schema.Types.ObjectId, ref: "TonGiao"}
}, schemaOptions)

module.exports = mongoose.model('HocSinh', HocSinh)