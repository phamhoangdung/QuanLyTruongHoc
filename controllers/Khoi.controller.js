const Khoi = require('../models/Khoi.model');

exports.selectKhoi = async (req, res) => {
    let data;
    if (req.query.search) {
        data = await Khoi.find({ $text: { $search: req.query.search } });
    } else {
        data = await Khoi.find({});
    }
    let result = [];
    data.map((e, i) => {
        result.push({ "id": e._id, "text": e.TenKhoi });
    })
    res.status(200).json(result);
}
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
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateKhoi = async (req, res) => {
    try {
        req.checkBody('TenKhoi', 'Tên khối trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_KHOI' });
        } else {
            var khoi = new Khoi({
                TenKhoi: req.body.TenKhoi,
            });
            await khoi.save((error, result) => {
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
            const khoi = await Khoi.findById(req.params.id);
            if (khoi) {
                khoi.set(req.body);
                khoi.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_KHOI' })
                    res.status(200).json({ status: true, msg: 'Cập nhật thành công!', data: khoi })
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
            res.status(200).json({ status: true, msg: 'Xoá ' + result.TenKhoi + ' thành công!' });
        })
    }
}