const NamHoc = require('../models/NamHoc.model');

exports.selectNamHoc = async (req, res) => {
    let data;
    
    if (req.query.search) {
        data = await NamHoc.find({ $text: { $search: req.query.search } });
    } else {
        data = await NamHoc.find({}).sort({created_at:-1});
    }
    let result = [];
    data.map((e, i) => {
        result.push({ "id": e._id, "text": e.TenNamHoc });
    })
    res.status(200).json(result);
}
exports.GetNamHoc = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        sort: { created_at: -1 },
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    NamHoc.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_NAMHOC' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateNamHoc = async (req, res) => {
    try {
        req.checkBody('TenNamHoc', 'Tên Năm học trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_NAMHOC' });
        } else {
            var namHoc = new NamHoc({
                TenNamHoc: req.body.TenNamHoc,
            });
            await namHoc.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_NAMHOC' })
                res.status(200).json({ status: true, msg: 'Tạo mới Năm học thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(500).json({ status: false, msg: err, code: 'ERR_CREATE_NAMHOC' })
    }
}
exports.UpdateNamHoc = async (req, res) => {
    req.checkBody('TenNamHoc', 'Tên Năm học trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_UPDATE_NAMHOC' });
    } else {
        try {
            const namHoc = await NamHoc.findById(req.params.id);
            if (namHoc) {
                namHoc.set(req.body);
                namHoc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_NAMHOC' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới Năm học thành công!', data: namHoc })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_NAMHOC' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_NAMHOC' })
        }
    }
}
exports.DeleteNamHoc = (req, res) => {
    req.checkParams('id', 'id Năm học trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_NAMHOC' });
    } else {
        NamHoc.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_NAMHOC' });
            res.status(200).json({ status: true, msg: 'Xoá Năm học ' + result.TenNamHoc + ' thành công!' });
        })
    }
}