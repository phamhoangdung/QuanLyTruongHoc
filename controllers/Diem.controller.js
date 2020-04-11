const Diem = require('../models/Diem.model');

exports.GetDiem = (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        collation: {
            locale: 'en'
        }
    };
    Diem.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_DIEM' });
        } else {
            res.status(200).json({ status: true, data: result })
        }
    })
}
exports.CreateDiem = async (req, res) => {
    try {
        req.checkBody('HocSinh_id', 'Học sinh trống !').notEmpty();
        req.checkBody('HocKy_id', 'Học kỳ trống !').notEmpty();
        req.checkBody('MonHoc_id', 'Môn học trống !').notEmpty();
        req.checkBody('Lop_id', 'Lớp trống !').notEmpty();
        req.checkBody('LoaiDiem_id', 'Loại điểm trống !').notEmpty();
        req.checkBody('Diem', 'Điểm trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_DIEM' });
        } else {
            var diem = new Diem({
                HocSinh_id: req.body.HocSinh_id,
                HocKy_id: req.body.HocKy_id,
                MonHoc_id: req.body.MonHoc_id,
                Lop_id: req.body.Lop_id,
                LoaiDiem_id: req.body.LoaiDiem_id,
                Diem: req.body.Diem,
            });
            await diem.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_DIEM' })
                res.status(200).json({ status: true, msg: 'Tạo mới điểm thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_DIEM' })
    }
}
exports.UpdateDiem = async (req, res) => {
    req.checkBody('TenDiem', 'Tên điểm trống !').notEmpty();
    req.checkParams('id', 'id điểm trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_DIEM' });
    } else {
        try {
            const diem = await Diem.findById(req.params.id);
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
            console.log(error);

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