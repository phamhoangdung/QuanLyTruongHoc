const MonHoc = require('../models/MonHoc.model');

exports.GetMonHoc = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    MonHoc.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_MONHOC' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit , recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateMonHoc = async (req, res) => {
    try {
        req.checkBody('TenMonHoc', 'Tên môn học trống !').notEmpty();
        req.checkBody('SoTiet', 'Số tiết trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_MONHOC' });
        } else {
            var monHoc = new MonHoc({
                TenMonHoc: req.body.TenMonHoc,
                SoTiet: req.body.SoTiet
            });
            await monHoc.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_MONHOC' })
                res.status(200).json({ status: true, msg: 'Tạo mới môn học thành công!', data: result })
            })
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
exports.DeleteMonHoc = (req, res) => {
    req.checkParams('id', 'id môn học trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_MONHOC' });
    } else {
        MonHoc.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_MONHOC' });
            res.status(200).json({ status: true, msg: 'Xoá môn học ' + result.TenMonHoc + ' thành công!' });
        })
    }
}