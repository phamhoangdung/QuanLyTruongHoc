const DanToc = require('../models/DanToc.model');

exports.selectDanToc = async (req, res) => {
    let data;
    console.log(req.query.search);
    if (req.query.search) {
        data = await DanToc.find({ $text: { $search: req.query.search } });
    } else {
        data = await DanToc.find({});
    }
    let result = [];
    data.map((e, i) => {
        result.push({ "id": e._id, "text": e.TenDanToc });
    })
    res.status(200).json(result);
}
exports.GetDanToc = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    DanToc.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_DANTOC' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit , recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateDanToc = async (req, res) => {
    try {
        req.checkBody('TenDanToc', 'Tên dân tộc trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_DANTOC' });
        } else {
            var danToc = new DanToc({
                TenDanToc: req.body.TenDanToc,
            });
            await danToc.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_DANTOC' })
                res.status(200).json({ status: true, msg: 'Tạo mới dân tộc thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_DANTOC' })
    }
}
exports.UpdateDanToc = async (req, res) => {
    req.checkBody('TenDanToc', 'Tên dân tộc trống !').notEmpty();
    req.checkParams('id', 'id dân tộc trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_DANTOC' });
    } else {
        try {
            const danToc = await DanToc.findById(req.params.id);
            if (danToc) {
                danToc.set(req.body);
                danToc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_DANTOC' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới dân tộc thành công!', data: danToc })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_DANTOC' })
            }
        } catch (error) {
            console.log(error);

            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_DANTOC' })
        }
    }
}
exports.DeleteDanToc = (req, res) => {
    req.checkParams('id', 'id dân tộc trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_DANTOC' });
    } else {
        DanToc.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_DANTOC' });
            res.status(200).json({ status: true, msg: 'Xoá dân tộc ' + result.TenDanToc + ' thành công!' });
        })
    }
}