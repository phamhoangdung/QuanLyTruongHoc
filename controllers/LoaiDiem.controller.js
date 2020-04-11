const LoaiDiem = require('../models/LoaiDiem.model');

exports.GetLoaiDiem = (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        collation: {
            locale: 'en'
        }
    };
    LoaiDiem.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_LOAIDIEM' });
        } else {
            res.status(200).json({ status: true, data: result })
        }
    })
}
exports.CreateLoaiDiem = async (req, res) => {
    try {
        req.checkBody('TenLoaiDiem', 'Tên Loại điểm trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOAIDIEM' });
        } else {
            var loaiDiem = new LoaiDiem({
                TenLoaiDiem: req.body.TenLoaiDiem,
                HeSo: req.body.HeSo
            });
            await loaiDiem.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_LOAIDIEM' })
                res.status(200).json({ status: true, msg: 'Tạo mới Loại điểm thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_LOAIDIEM' })
    }
}
exports.UpdateLoaiDiem = async (req, res) => {
    req.checkBody('TenLoaiDiem', 'Tên Loại điểm trống !').notEmpty();
    req.checkParams('id', 'id Loại điểm trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOAIDIEM' });
    } else {
        try {
            const loaiDiem = await LoaiDiem.findById(req.params.id);
            if (loaiDiem) {
                loaiDiem.set(req.body);
                loaiDiem.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_LOAIDIEM' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới Loại điểm thành công!', data: loaiDiem })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_LOAIDIEM' })
            }
        } catch (error) {
            console.log(error);

            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_LOAIDIEM' })
        }
    }
}
exports.DeleteLoaiDiem = (req, res) => {
    req.checkParams('id', 'id Loại điểm trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOAIDIEM' });
    } else {
        LoaiDiem.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_LOAIDIEM' });
            res.status(200).json({ status: true, msg: 'Xoá Loại điểm ' + result.TenLoaiDiem + ' thành công!' });
        })
    }
}