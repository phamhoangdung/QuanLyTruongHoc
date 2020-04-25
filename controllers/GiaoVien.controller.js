const GiaoVien = require('../models/GiaoVien.model');
const LopHoc = require('../models/LopHoc.model');
const { makeUserName } = require('../services/system.sevice');
const user = require('../models/user.model');

exports.selectGiaoVien = async (req, res) => {
    let data;
    if (req.query.search) {
        data = await GiaoVien.find({ $text: { $search: req.query.search } });
    } else {
        data = await GiaoVien.find({});
    }
    let result = [];
    data.map((e, i) => {
        result.push({ "id": e._id, "text": e.Ho + " " + e.Ten });
    })
    res.status(200).json(result);
}
exports.GetGiaoVien = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        sort: { created_at: -1 },
        limit: req.body.length,
        populate: [{ path: "MonHoc_id", select: "_id TenMonHoc" }, { path: "DanToc_id", select: "_id TenDanToc" },
        { path: "TonGiao_id", select: "_id TenTonGiao" },{ path: "TaiKhoan", select: "_id email" }],
        collation: {
            locale: 'en'
        }
    };
    GiaoVien.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_GIAOVIEN' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateGiaoVien = async (req, res) => {
    try {
        req.checkBody('Ho', 'Tên giáo viên trống !').notEmpty();
        req.checkBody('Ten', 'Tên giáo viên trống !').notEmpty();
        req.checkBody('GioTinh', 'Giới tính trống !').notEmpty();
        req.checkBody('NgaySinh', 'Ngày sinh trống !').notEmpty();
        req.checkBody('DiaChi', 'Địa chỉ trống !').notEmpty();
        req.checkBody('DienThoai', 'Điện thoại trống !').notEmpty();
        req.checkBody('Email', 'Email trống !').notEmpty();
        req.checkBody('DanToc_id', 'Dân tộc chưa được chọn !').notEmpty();
        req.checkBody('TonGiao_id', 'Tôn giáo chưa được chọn !').notEmpty();
        req.checkBody('MonHoc_id', 'Môn học chưa được chọn !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_GIAOVIEN' });
        } else {
            let username = makeUserName(req.body.Ho, req.body.Ten, req.body.NgaySinh);
            let usercheck = await user.findOne({ email: username });
            if (usercheck) {
                var taiKhoan = new user({
                    email: makeUserName(req.body.Ho, req.body.Ten, req.body.NgaySinh) + Math.random().toString(36).substring(2, 6),
                    password: "123456",
                    role: "student"
                })
            } else {
                var taiKhoan = new user({
                    email: makeUserName(req.body.Ho, req.body.Ten, req.body.NgaySinh),
                    password: "1234567@",
                    role: "teacher"
                })
            }
            let tksv = await taiKhoan.save();
            var giaoVien = new GiaoVien({
                Ho: req.body.Ho,
                Ten: req.body.Ten,
                NgaySinh: req.body.NgaySinh,
                GioTinh: req.body.GioTinh,
                DiaChi: req.body.DiaChi,
                DienThoai: req.body.DienThoai,
                Email: req.body.Email,
                AnhDaiDien: req.body.AnhDaiDien,
                MonHoc_id: req.body.MonHoc_id,
                DanToc_id: req.body.DanToc_id,
                TonGiao_id: req.body.TonGiao_id,
                TaiKhoan: tksv._id
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
    req.checkParams('id', 'id giáo viên trống !').isMongoId();
    req.checkBody('Ho', 'Tên giáo viên trống !').notEmpty();
    req.checkBody('Ten', 'Tên giáo viên trống !').notEmpty();
    req.checkBody('GioTinh', 'Giới tính trống !').notEmpty();
    req.checkBody('NgaySinh', 'Ngày sinh trống !').notEmpty();
    req.checkBody('DiaChi', 'Địa chỉ trống !').notEmpty();
    req.checkBody('DienThoai', 'Điện thoại trống !').notEmpty();
    req.checkBody('Email', 'Email trống !').notEmpty();
    req.checkBody('DanToc_id', 'Dân tộc chưa được chọn !').notEmpty();
    req.checkBody('TonGiao_id', 'Tôn giáo chưa được chọn !').notEmpty();
    req.checkBody('MonHoc_id', 'Môn học chưa được chọn !').notEmpty();
    req.checkBody('TaiKhoan', 'id tài khoản không chính xác !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_GIAOVIEN' });
    } else {
        try {
            const giaoVien = await GiaoVien.findById(req.params.id);
            const userCh = await user.findById(req.body.TaiKhoan);
            if (giaoVien && userCh) {
                giaoVien.set(req.body);
                giaoVien.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_GIAOVIEN' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới giáo viên thành công!', data: giaoVien })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu hoặc tài khoản không tồn tại', code: 'ERR_UPDATE_GIAOVIEN' })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_GIAOVIEN' })
        }
    }
}
exports.DeleteGiaoVien = async (req, res) => {
    req.checkParams('id', 'id giáo viên trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_GIAOVIEN' });
    } else {
        let lophoc = await LopHoc.findOne({ GiaoVien_id: req.params.id });
        if (lophoc) {
            res.status(200).json({ status: false, msg: "Giáo viên này đang được sử dụng, không thể xoá !", code: 'ERR_DELETE_GIAOVIEN' });
        } else {
            GiaoVien.findByIdAndDelete(req.params.id, (error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_GIAOVIEN' });
                res.status(200).json({ status: true, msg: 'Xoá giáo viên ' + result.Ho + " " + result.Ten + ' thành công!' });
            })
        }
    }
}