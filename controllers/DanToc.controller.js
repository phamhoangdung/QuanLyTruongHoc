const DanToc = require('../models/DanToc.model');

exports.GetDanToc = (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        collation: {
            locale: 'en'
        }
    };
    DanToc.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_LOAIDIEM' });
        } else {
            res.status(200).json({ status: true, data: result })
        }
    })
}
exports.CreateDanToc = async (req, res) => {
    try {
        req.checkBody('TenDanToc', 'Tên dân tộc trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOAIDIEM' });
        } else {
            var danToc = new DanToc({
                TenDanToc: req.body.TenDanToc,
            });
            await danToc.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_LOAIDIEM' })
                res.status(200).json({ status: true, msg: 'Tạo mới dân tộc thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_LOAIDIEM' })
    }
}
exports.UpdateDanToc = async (req, res) => {
    req.checkBody('TenDanToc', 'Tên dân tộc trống !').notEmpty();
    req.checkParams('id', 'id dân tộc trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOAIDIEM' });
    } else {
        try {
            const danToc = await DanToc.findById(req.params.id);
            if (danToc) {
                danToc.set(req.body);
                danToc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_LOAIDIEM' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới dân tộc thành công!', data: danToc })
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
exports.DeleteDanToc = (req, res) => {
    req.checkParams('id', 'id dân tộc trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOAIDIEM' });
    } else {
        DanToc.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_LOAIDIEM' });
            res.status(200).json({ status: true, msg: 'Xoá dân tộc ' + result.TenDanToc + ' thành công!' });
        })
    }
}