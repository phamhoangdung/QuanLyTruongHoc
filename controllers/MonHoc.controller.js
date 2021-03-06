const MonHoc = require('../models/MonHoc.model');
const GiaoVien = require('../models/GiaoVien.model');
const Diem = require('../models/Diem.model');
const PhanMon = require('../models/PhanMon.model');

exports.selectMonHoc = async (req, res) => {
    try {
        let data;
        if (req.query.Khoi_id) {
            if (req.query.search) {
                if (req.query.user_role == "teacher") {
                    let giaoVien = await GiaoVien.findOne({ TaiKhoan: req.query.User_id });
                    let phanMon = await PhanMon.find({ GiaoVien_id: giaoVien._id }).select("MonHoc_id");
                    
                    data = await MonHoc.find({ Khoi_id: req.query.Khoi_id, $text: { $search: req.query.search }, _id: { $in: phanMon.map(a => a.MonHoc_id) } });
                } else {
                    console.log("here");

                    data = await MonHoc.find({ Khoi_id: req.query.Khoi_id, $text: { $search: req.query.search } });
                }
            } else {
                if (req.query.user_role == "teacher") {
                    let giaoVien = await GiaoVien.findOne({ TaiKhoan: req.query.User_id });
                    let phanMon = await PhanMon.find({ GiaoVien_id: giaoVien._id }).select("MonHoc_id");
                    data = await MonHoc.find({ Khoi_id: req.query.Khoi_id,_id: { $in: phanMon.map(a => a.MonHoc_id) } });
                } else {
                    data = await MonHoc.find({ Khoi_id: req.query.Khoi_id });
                }
            }
        } else {
            if (req.query.search) {
                data = await MonHoc.find({ $text: { $search: req.query.search } });
            } else {
                data = await MonHoc.find({});
            }
        }

        let result = [];
        data.map((e, i) => {
            result.push({ "id": e._id, "text": e.TenMonHoc });
        })

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
    }
}
exports.GetMonHoc = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        populate: { path: "Khoi_id", select: "_id TenKhoi" },
        sort: { Khoi_id: 1 },
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    MonHoc.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_MONHOC' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateMonHoc = async (req, res) => {
    try {
        req.checkBody('TenMonHoc', 'Tên môn học trống !').notEmpty();
        req.checkBody('SoTiet', 'Số tiết trống !').notEmpty();
        req.checkBody('Khoi_id', 'Khối trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_MONHOC' });
        } else {
            let monHocCheck = await MonHoc.findOne({ TenMonHoc: req.body.TenMonHoc });
            if (monHocCheck) {
                res.status(200).json({ status: false, msg: "Môn học đã tồn tại", code: 'ERR_CREATE_MONHOC' })
            } else {
                var monHoc = new MonHoc({
                    TenMonHoc: req.body.TenMonHoc,
                    SoTiet: req.body.SoTiet,
                    Khoi_id: req.body.Khoi_id,
                });
                await monHoc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_MONHOC' })
                    res.status(200).json({ status: true, msg: 'Tạo mới môn học thành công!', data: result })
                })
            }
        }
    }
    catch (err) {
        res.status(500).json({ status: false, msg: err, code: 'ERR_CREATE_MONHOC' })
    }
}
exports.UpdateMonHoc = async (req, res) => {
    req.checkBody('TenMonHoc', 'Tên môn học trống !').notEmpty();
    req.checkBody('SoTiet', 'Tên số tiết trống !').notEmpty();
    req.checkParams('id', 'id môn học trống !').isMongoId();
    req.checkBody('Khoi_id', 'Khối trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_UPDATE_MONHOC' });
    } else {
        try {
            const monHoc = await MonHoc.findById(req.params.id);
            if (monHoc) {
                monHoc.set(req.body);
                monHoc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_MONHOC' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới môn học thành công!', data: monHoc })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_MONHOC' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_MONHOC' })
        }
    }
}
exports.DeleteMonHoc = async (req, res) => {
    req.checkParams('id', 'id môn học trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_MONHOC' });
    } else {
        let giaoVien = await GiaoVien.findOne({ MonHoc_id: req.params.id });
        let diem = await Diem.findOne({ MonHoc_id: req.params.id });
        if (giaoVien || diem) {
            res.status(200).json({ status: false, msg: "Môn học đang được sử dụng !", code: 'ERR_DELETE_MONHOC' });
        } else {
            MonHoc.findByIdAndDelete(req.params.id, (error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_MONHOC' });
                res.status(200).json({ status: true, msg: 'Xoá môn học ' + result.TenMonHoc + ' thành công!' });
            })
        }
    }
}