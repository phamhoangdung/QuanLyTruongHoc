const TonGiao = require('../models/TonGiao.model');

exports.selectTonGiao = async (req, res) => {
    let data;
    console.log(req.query.search);
    if (req.query.search) {
        data = await TonGiao.find({ $text: { $search: req.query.search } });
    } else {
        data = await TonGiao.find({});
    }
    let result = [];
    data.map((e, i) => {
        result.push({ "id": e._id, "text": e.TenTonGiao });
    })
    res.status(200).json(result);
}
exports.GetTonGiao = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        sort: { created_at: -1 },
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    TonGiao.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_TONGIAO' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateTonGiao = async (req, res) => {
    try {
        req.checkBody('TenTonGiao', 'Tên Tôn giáo trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_TONGIAO' });
        } else {
            var tonGiao = new TonGiao({
                TenTonGiao: req.body.TenTonGiao,
            });
            await tonGiao.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_TONGIAO' })
                res.status(200).json({ status: true, msg: 'Tạo mới Tôn giáo thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(500).json({ status: false, msg: err, code: 'ERR_CREATE_TONGIAO' })
    }
}
exports.UpdateTonGiao = async (req, res) => {
    req.checkBody('TenTonGiao', 'Tên Tôn giáo trống !').notEmpty();
    req.checkParams('id', 'id Tôn giáo trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_UPDATE_TONGIAO' });
    } else {
        try {
            const tonGiao = await TonGiao.findById(req.params.id);
            if (tonGiao) {
                tonGiao.set(req.body);
                tonGiao.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_TONGIAO' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới Tôn giáo thành công!', data: tonGiao })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_TONGIAO' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_TONGIAO' })
        }
    }
}
exports.DeleteTonGiao = (req, res) => {
    req.checkParams('id', 'id Tôn giáo trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_TONGIAO' });
    } else {
        TonGiao.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_TONGIAO' });
            res.status(200).json({ status: true, msg: 'Xoá Tôn giáo ' + result.TenTonGiao + ' thành công!' });
        })
    }
}