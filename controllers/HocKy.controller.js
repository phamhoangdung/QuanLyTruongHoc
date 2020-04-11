const HocKy = require('../models/HocKy.model');

exports.GetHocKy = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    HocKy.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_HOCKY' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateHocKy = async (req, res) => {
    try {
        req.checkBody('TenHocKy', 'Tên Học kỳ trống !').notEmpty();
        req.checkBody('HeSo', 'Hệ số trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_HOCKY' });
        } else {
            var monHoc = new HocKy({
                TenHocKy: req.body.TenHocKy,
                HeSo: req.body.HeSo
            });
            await monHoc.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_HOCKY' })
                res.status(200).json({ status: true, msg: 'Tạo mới Học kỳ thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(500).json({ status: false, msg: err, code: 'ERR_CREATE_HOCKY' })
    }
}
exports.UpdateHocKy = async (req, res) => {
    req.checkBody('TenHocKy', 'Tên Học kỳ trống !').notEmpty();
    req.checkParams('id', 'id Học kỳ trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_UPDATE_HOCKY' });
    } else {
        try {
            const monHoc = await HocKy.findById(req.params.id);
            if (monHoc) {
                monHoc.set(req.body);
                monHoc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_HOCKY' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới Học kỳ thành công!', data: monHoc })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_HOCKY' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_HOCKY' })
        }
    }
}
exports.DeleteHocKy = (req, res) => {
    req.checkParams('id', 'id Học kỳ trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_HOCKY' });
    } else {
        HocKy.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_HOCKY' });
            res.status(200).json({ status: true, msg: 'Xoá Học kỳ ' + result.TenHocKy + ' thành công!' });
        })
    }
}