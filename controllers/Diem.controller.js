const Diem = require('../models/Diem.model');
const PhanLop = require('../models/PhanLop.model');

exports.GetDiem = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        populate: { path: "HocSinh_id", select: "_id Ho Ten" },
        // sort: { HocSinh_id.Ten: 1 },
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    req.checkBody('HocKy_id', 'Học kỳ chưa được chọn !').notEmpty();
    req.checkBody('MonHoc_id', 'Môn học chưa được chọn !').notEmpty();
    req.checkBody('LopHoc_id', 'Lớp học chưa được chọn !').notEmpty();
    req.checkBody('NamHoc_id', 'Năm học chưa được chọn !').notEmpty();
    const errors = req.validationErrors();
    if (!req.body.HocKy_id && !req.body.MonHoc_id && !req.body.LopHoc_id && !req.body.NamHoc_id) {
        Diem.paginate({}, options, (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_DIEM' });
            } else {
                if (result.docs.length > 0) {
                    res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                } else {
                    res.status(200).json({ status: false, msg: "Dữ liệu không tồn tại" });
                }
            }
        })
    } else {
        const conditions = {
            NamHoc_id: req.body.NamHoc_id,
            Lop_id: req.body.Lop_id,
            HocKy_id: req.body.HocKy_id,
            MonHoc_id: req.body.MonHoc_id
        }
        Diem.paginate(conditions, options, (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_DIEM' });
            } else {
                if (result.docs.length > 0) {
                    res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                } else {
                    res.status(200).json({ status: false, msg: "Dữ liệu không tồn tại" });
                }
            }
        })
    }
}
exports.CreateDiem = async (req, res) => {
    try {
        req.checkBody('HocKy_id', 'Học kỳ trống !').notEmpty();
        req.checkBody('MonHoc_id', 'Môn học trống !').notEmpty();
        req.checkBody('LopHoc_id', 'Lớp trống !').notEmpty();
        req.checkBody('Khoi_id', 'Khối trống !').notEmpty();
        req.checkBody('NamHoc_id', 'Năm học chưa được chọn !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_DIEM' });
        } else {
            let phanLop = await PhanLop.findOne({
                LopHoc_id: req.body.LopHoc_id,
                NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id
            });
            if (phanLop.HocSinhs.length > 0) {
                phanLop.HocSinhs.map(async (e, i) => {
                    let diemCheck = await Diem.findOne({
                        HocSinh_id: e, NamHoc_id: req.body.NamHoc_id,
                        LopHoc_id: req.body.LopHoc_id,
                        HocKy_id: req.body.HocKy_id,
                        MonHoc_id: req.body.MonHoc_id
                    });
                    if (!diemCheck) {
                        let diem = new Diem({
                            HocSinh_id: e,
                            NamHoc_id: req.body.NamHoc_id,
                            LopHoc_id: req.body.LopHoc_id,
                            HocKy_id: req.body.HocKy_id,
                            MonHoc_id: req.body.MonHoc_id
                        })
                        await diem.save();
                    }
                })
                res.status(200).json({ status: true, msg: 'Tạo mới điểm thành công!' })
            } else {
                res.status(200).json({ status: false, msg: "Danh sách học sinh rỗng !", code: 'ERR_CREATE_DIEM' })
            }
            // var diem = new Diem({
            //     HocSinh_id: req.body.HocSinh_id,
            //     HocKy_id: req.body.HocKy_id,
            //     MonHoc_id: req.body.MonHoc_id,
            //     Lop_id: req.body.Lop_id,
            //     LoaiDiem_id: req.body.LoaiDiem_id,
            //     Diem: req.body.Diem,
            // });
            // await diem.save((error, result) => {
            //     if (error)
            //         res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_DIEM' })
            //     res.status(200).json({ status: true, msg: 'Tạo mới điểm thành công!', data: result })
            // })
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_DIEM' })
    }
}
exports.UpdateDiem = async (req, res) => {
    req.checkBody('HocSinh_id', 'Học sinh trống !').notEmpty();
    req.checkBody('HocKy_id', 'Học kỳ trống !').notEmpty();
    req.checkBody('MonHoc_id', 'Môn học trống !').notEmpty();
    req.checkBody('LopHoc_id', 'Lớp trống !').notEmpty();
    req.checkBody('Khoi_id', 'Khối trống !').notEmpty();
    req.checkBody('NamHoc_id', 'Năm học chưa được chọn !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_DIEM' });
    } else {
        try {
            const diem = await Diem.findOne({
                HocSinh_id: req.body.HocSinh_id,
                NamHoc_id: req.body.NamHoc_id,
                LopHoc_id: req.body.LopHoc_id,
                HocKy_id: req.body.HocKy_id,
                MonHoc_id: req.body.MonHoc_id
            });
            if (diem) {
                diem.set(req.body);
                diem.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_DIEM' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới điểm thành công!', data: diem })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_DIEM' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_DIEM' })
        }
    }
}
//Tự sinh điểm
exports.DeleteDiem = (req, res) => {
    req.checkParams('id', 'id điểm trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_DIEM' });
    } else {
        Diem.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_DIEM' });
            res.status(200).json({ status: true, msg: 'Xoá điểm ' + result.TenDiem + ' thành công!' });
        })
    }
}