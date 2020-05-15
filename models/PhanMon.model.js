const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var PhanMon = mongoose.Schema({
    GiaoVien_id: { type: mongoose.Schema.Types.ObjectId, ref: "GiaoVien" },
    MonHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "MonHoc" },
    HocKy_id: { type: mongoose.Schema.Types.ObjectId, ref: "HocKy" },
    NamHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "NamHoc" },
    LopHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "LopHoc" }
}, schemaOptions)
PhanMon.plugin(mongoosePaginate);
module.exports = mongoose.model('PhanMon', PhanMon)