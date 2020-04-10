const Khoi = require('../models/Khoi.model');

exports.GetKhoi = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    Khoi.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_KHOI' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit , recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateKhoi = async (req, res) => {
    try {
        req.checkBody('TenKhoi', 'Tên khối trống !').notEmpty();
        req.checkBody('SoTiet', 'Số tiết trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_KHOI' });
        } else {
            var monHoc = new Khoi({
                TenKhoi: req.body.TenKhoi,
            });
            await monHoc.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_KHOI' })
                res.status(200).json({ status: true, msg: 'Tạo mới khối thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(500).json({ status: false, msg: err, code: 'ERR_CREATE_KHOI' })
    }
}
exports.UpdateKhoi = async (req, res) => {
    req.checkBody('TenKhoi', 'Tên khối trống !').notEmpty();
    req.checkParams('id', 'id khối trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_UPDATE_KHOI' });
    } else {
        try {
            const monHoc = await Khoi.findById(req.params.id);
            if (monHoc) {
                monHoc.set(req.body);
                monHoc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_KHOI' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới khối thành công!', data: monHoc })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_KHOI' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_KHOI' })
        }
    }
}
exports.DeleteKhoi = (req, res) => {
    req.checkParams('id', 'id khối trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_KHOI' });
    } else {
        Khoi.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_KHOI' });
            res.status(200).json({ status: true, msg: 'Xoá khối ' + result.TenKhoi + ' thành công!' });
        })
    }
}