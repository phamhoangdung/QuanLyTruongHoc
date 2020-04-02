const mongoose = require('mongoose');
var schemaOptions = {
    timestamps = { createdAt = 'created_at' },
}
var HocSinh = mongoose.Schema({
    HoTen: { type: String, require: true },
    GioiTinh: { type: Number, require: true },
    NgaySinh: Date,
    NoiSinh: String,
    DanToc_id: { type: mongoose.Schema.Types.ObjectId, ref: "DanToc" },
    TonGiao_id: { type: mongoose.Schema.Types.ObjectId, ref: "TonGiao"}
}, schemaOptions)

module.exports = mongoose.model('HocSinh', HocSinh)