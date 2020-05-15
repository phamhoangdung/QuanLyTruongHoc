const PhanMon = require('../models/PhanMon.model');
const MonHoc = require('../models/MonHoc.model');

exports.GetPhanMon = (req, res) => {

    const options = {
        offset: req.body.start,
        page: req.body.draw,
        sort: { created_at: -1 },
        populate: [{ path: "MonHoc_id", select: "_id TenMonHoc" },
        { path: "GiaoVien_id", select: "_id TenGiaoVien" },
        { path: "HocKy_id", select: "_id TenHocKy" },
        { path: "NamHoc_id", select: "_id TenNamHoc" },
        { path: "LopHoc_id", select: "_id TenLopHoc" }],
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    if (req.body.LopHoc_id && req.body.NamHoc_id && req.body.HocKy_id) {
        PhanMon.paginate({ LopHoc_id: req.body.LopHoc_id, NamHoc_id: req.body.NamHoc_id, HocKy_id: req.body.HocKy_id }, options, (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_PhanMon' });
            } else {
                res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
            }
        })
    }else{
        res.status(200).json({ status: true, data: []})
    }

}
exports.CreatePhanMon = async (req, res) => {
    req.checkBody('HocKy_id', 'Học kỳ chưa được chọn !').notEmpty();
    req.checkBody('MonHoc_id', 'Môn học chưa được chọn !').notEmpty();
    req.checkBody('LopHoc_id', 'Lớp học chưa được chọn !').notEmpty();
    req.checkBody('NamHoc_id', 'Năm học chưa được chọn !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_PHANMON' });
    } else {
        let monh = await MonHoc.find({ Khoi_id: req.body.Khoi_id });
        if (monh.length > 0) {
            await monh.map(async (e, i) => {
                PhanMon.findOne({ MonHoc_id: e._id, LopHoc_id: req.body.LopHoc_id, NamHoc_id: req.body.NamHoc_id, HocKy_id: req.body.HocKy_id }, (error, result) => {
                    if (error)
                        console.log(error);
                    if (!result) {
                        let phanmon = new PhanMon({
                            MonHoc_id: e._id,
                            LopHoc_id: req.body.LopHoc_id,
                            NamHoc_id: req.body.NamHoc_id,
                            HocKy_id: req.body.HocKy_id
                        })
                        phanmon.save();
                    }
                });
            })
            res.status(200).json({ status: true, msg: "Khởi tạo phân môn thành công !" });
        } else {
            res.status(200).json({ status: false, msg: "Không có môn học để khởi tạo !", code: 'ERR_CREATE_PHANMON' });
        }
    }
}
exports.UpdatePhanMon = async (req, res) => {
    req.checkBody('TenPhanMon', 'Tên Phân môn trống !').notEmpty();
    req.checkParams('id', 'id Phân môn trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_UPDATE_PhanMon' });
    } else {
        try {
            const PhanMon = await PhanMon.findById(req.params.id);
            if (PhanMon) {
                PhanMon.set(req.body);
                PhanMon.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_PhanMon' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới Phân môn thành công!', data: PhanMon })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_PhanMon' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_PhanMon' })
        }
    }
}
exports.DeletePhanMon = (req, res) => {
    req.checkParams('id', 'id Phân môn trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_PhanMon' });
    } else {
        PhanMon.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_PhanMon' });
            res.status(200).json({ status: true, msg: 'Xoá Phân môn ' + result.TenPhanMon + ' thành công!' });
        })
    }
}