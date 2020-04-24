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
    LopHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "LopHoc" },
    HocKy_id: { type: mongoose.Schema.Types.ObjectId, ref: "HocKy" },
    MonHoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "MonHoc" },
    Diem_m01: { type: Float, default: -1 },
    Diem_m02: { type: Float, default: -1 },
    Diem_m03: { type: Float, default: -1 },
    Diem_m04: { type: Float, default: -1 },
    Diem_15p01: { type: Float, default: -1 },
    Diem_15p02: { type: Float, default: -1 },
    Diem_15p03: { type: Float, default: -1 },
    Diem_15p04: { type: Float, default: -1 },
    Diem_1t01: { type: Float, default: -1 },
    Diem_1t02: { type: Float, default: -1 },
    Diem_1t03: { type: Float, default: -1 },
    Diem_1t04: { type: Float, default: -1 },
    Diem_HK: { type: Float, default: -1 },
    Diem_TBC: { type: Float, default: -1 },
}, schemaOptions)
Diem.index({'$**': 'text'});
Diem.plugin(mongoosePaginate);
module.exports = mongoose.model('Diem', Diem)