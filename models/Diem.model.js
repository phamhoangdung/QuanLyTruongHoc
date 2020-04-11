const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Float = require('mongoose-float').loadType(mongoose);
var schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
var Diem = mongoose.Schema({
    HocSinh_id: { type: mongoose.Schema.Types.ObjectId, ref: "HocSinh" },
    NamHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "NamHoc" },
    HocKy_id: { type: mongoose.Schema.Types.ObjectId, ref: "HocKy" },
    MonHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "MonHoc" },
    Lop_id: {type:mongoose.Schema.Types.ObjectId,ref:"Lop"},
    LoaiDiem_id:{type:mongoose.Schema.Types.ObjectId,ref:"LoaiDiem"},
    Diem: Float
}, schemaOptions)
Diem.plugin(mongoosePaginate);
module.exports = mongoose.model('Diem', Diem)