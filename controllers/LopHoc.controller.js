const LopHoc = require('../models/LopHoc.model');

exports.GetLopHoc = (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        collation: {
            locale: 'en'
        }
    };
    LopHoc.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_LOPHOC' });
        } else {
            res.status(200).json({ status: true, data: result })
        }
    })
}
exports.CreateLopHoc = async (req, res) => {
    try {
        req.checkBody('TenLopHoc', 'Tên lớp học trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOPHOC' });
        } else {
            var lopHoc = new LopHoc({
                TenLopHoc: req.body.TenLopHoc,
                SiSo: req.body.SiSo,
                Khoi_id: req.body.Khoi_id,
                NamHoc_id: req.body.NamHoc_id,
                GiaoVienChuNhiem_id: req.body.GiaoVienChuNhiem_id
            });
            await lopHoc.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_LOPHOC' })
                res.status(200).json({ status: true, msg: 'Tạo mới lớp học thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_LOPHOC' })
    }
}
exports.UpdateLopHoc = async (req, res) => {
    req.checkBody('TenLopHoc', 'Tên lớp học trống !').notEmpty();
    req.checkParams('id', 'id lớp học trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOPHOC' });
    } else {
        try {
            const lopHoc = await LopHoc.findById(req.params.id);
            if (lopHoc) {
                lopHoc.set(req.body);
                lopHoc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_LOPHOC' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới lớp học thành công!', data: lopHoc })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_LOPHOC' })
            }
        } catch (error) {
            console.log(error);

            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_LOPHOC' })
        }
    }
}
exports.DeleteLopHoc = (req, res) => {
    req.checkParams('id', 'id lớp học trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOPHOC' });
    } else {
        LopHoc.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_LOPHOC' });
            res.status(200).json({ status: true, msg: 'Xoá lớp học ' + result.TenLopHoc + ' thành công!' });
        })
    }
}