const GiaoVien = require('../models/GiaoVien.model');

exports.GetGiaoVien = (req, res) => {
    const options = {
        page: 1,
        limit: 10,
        collation: {
            locale: 'en'
        }
    };
    GiaoVien.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_GIAOVIEN' });
        } else {
            res.status(200).json({ status: true, data: result })
        }
    })
}
exports.CreateGiaoVien = async (req, res) => {
    try {
        req.checkBody('TenGiaoVien', 'Tên giáo viên trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_GIAOVIEN' });
        } else {
            var giaoVien = new GiaoVien({
                TenGiaoVien: req.body.TenGiaoVien,
                GioTinh: req.body.GioTinh,
                DiaChi: req.body.DiaChi,
                DienThoai: req.body.DienThoai,
                Email: req.body.Email,
                AnhDaiDien: req.body.AnhDaiDien,
                // MonHoc_id: req.body.MonHoc_id,
                // DanToc_id: req.body.DanToc_id,
                // TonGiao_id: req.body.TonGiao_id,
            });
            await giaoVien.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_GIAOVIEN' })
                res.status(200).json({ status: true, msg: 'Tạo mới giáo viên thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_GIAOVIEN' })
    }
}
exports.UpdateGiaoVien = async (req, res) => {
    req.checkBody('TenGiaoVien', 'Tên giáo viên trống !').notEmpty();
    req.checkParams('id', 'id giáo viên trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_GIAOVIEN' });
    } else {
        try {
            const giaoVien = await GiaoVien.findById(req.params.id);
            if (giaoVien) {
                giaoVien.set(req.body);
                giaoVien.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_GIAOVIEN' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới giáo viên thành công!', data: giaoVien })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_GIAOVIEN' })
            }
        } catch (error) {
            console.log(error);
            
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_GIAOVIEN' })
        }
    }
}
exports.DeleteGiaoVien = (req, res) => {
    req.checkParams('id', 'id giáo viên trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_GIAOVIEN' });
    } else {
        GiaoVien.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_GIAOVIEN' });
            res.status(200).json({ status: true, msg: 'Xoá giáo viên ' + result.TenGiaoVien + ' thành công!' });
        })
    }
}