const HocSinh = require('../models/HocSinh.model');

exports.GetHocSinh = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    HocSinh.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_HOCSINH' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateHocSinh = async (req, res) => {
    try {
        req.checkBody('TenHocSinh', 'Tên học sinh trống !').notEmpty();
        req.checkBody('GioTinh', 'Giới tính trống !').notEmpty();
        req.checkBody('DiaChi', 'Địa chỉ trống !').notEmpty();
        req.checkBody('DienThoai', 'Điện thoại trống !').notEmpty();
        req.checkBody('Email', 'Email trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_HOCSINH' });
        } else {
            var hocSinh = new HocSinh({
                Ho: req.body.Ho,
                Ten: req.body.Ten,
                GioiTinh: req.body.GioiTinh,
                NgaySinh: req.body.NgaySinh,
                DiaChi: req.body.DiaChi,
                QueQuan: req.body.QueQuan,
                AnhDaiDien: req.body.AnhDaiDien,
                // DanToc_id: req.body.DanToc_id,
                // TonGiao_id: req.body.TonGiao_id,
                // TaiKhoan_id: req.body.TaiKhoan_id,
            });
            await hocSinh.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_HOCSINH' })
                res.status(200).json({ status: true, msg: 'Tạo mới học sinh thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_HOCSINH' })
    }
}
exports.UpdateHocSinh = async (req, res) => {
    req.checkParams('id', 'id học sinh trống !').isMongoId();
    req.checkBody('TenHocSinh', 'Tên học sinh trống !').notEmpty();
    req.checkBody('GioTinh', 'Giới tính trống !').notEmpty();
    req.checkBody('DiaChi', 'Địa chỉ trống !').notEmpty();
    req.checkBody('DienThoai', 'Điện thoại trống !').notEmpty();
    req.checkBody('Email', 'Email trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_HOCSINH' });
    } else {
        try {
            const hocSinh = await HocSinh.findById(req.params.id);
            if (hocSinh) {
                hocSinh.set(req.body);
                hocSinh.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_HOCSINH' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới học sinh thành công!', data: hocSinh })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_HOCSINH' })
            }
        } catch (error) {
            console.log(error);

            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_HOCSINH' })
        }
    }
}
exports.DeleteHocSinh = (req, res) => {
    req.checkParams('id', 'id học sinh trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_HOCSINH' });
    } else {
        HocSinh.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_HOCSINH' });
            res.status(200).json({ status: true, msg: 'Xoá học sinh ' + result.TenHocSinh + ' thành công!' });
        })
    }
}