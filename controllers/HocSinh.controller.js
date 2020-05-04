const HocSinh = require('../models/HocSinh.model');
const user = require('../models/user.model');
const { makeUserName } = require('../services/system.sevice');

exports.GetHocSinh = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        limit: req.body.length,
        populate: [{ path: "DanToc_id", select: "_id TenDanToc" },
        { path: "TonGiao_id", select: "_id TenTonGiao" }, { path: "TaiKhoan", select: "_id email" }],
        collation: {
            locale: 'en'
        }
    };
    console.log(req.body.search)
    if (req.body.search) {
        HocSinh.paginate({ $text: { $search: req.body.search } }, options, (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_HOCSINH' });
            } else {
                res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
            }
        })
    }else{
        HocSinh.paginate({}, options, (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_HOCSINH' });
            } else {
                res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
            }
        })
    }
}
exports.CreateHocSinh = async (req, res) => {
    try {
        req.checkBody('Ho', 'Họ trống !').notEmpty();
        req.checkBody('Ten', 'Tên trống !').notEmpty();
        req.checkBody('GioiTinh', 'Giới tính trống !').notEmpty();
        req.checkBody('NgaySinh', 'Ngày sinh trống !').notEmpty();
        req.checkBody('DiaChi', 'Địa chỉ trống !').notEmpty();
        req.checkBody('QueQuan', 'Quê quán trống !').notEmpty();
        req.checkBody('DanToc_id', 'Dân tộc chưa được chọn !').notEmpty();
        req.checkBody('TonGiao_id', 'Tôn giáo chưa được chọn !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_HOCSINH' });
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
                    password: "123456",
                    role: "student"
                })
            }
            let tksv = await taiKhoan.save();
            var hocSinh = new HocSinh({
                Ho: req.body.Ho,
                Ten: req.body.Ten,
                GioiTinh: req.body.GioiTinh,
                NgaySinh: req.body.NgaySinh,
                DiaChi: req.body.DiaChi,
                QueQuan: req.body.QueQuan,
                DanToc_id: req.body.DanToc_id,
                TonGiao_id: req.body.TonGiao_id,
                AnhDaiDien: req.body.AnhDaiDien,
                TaiKhoan: tksv._id
            });
            await hocSinh.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_HOCSINH' })
                else {
                    res.status(200).json({ status: true, msg: 'Tạo mới học sinh thành công!', data: result })
                }
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_HOCSINH' })
    }
}
exports.UpdateHocSinh = async (req, res) => {
    console.log(req.body);
    
    req.checkParams('id', 'id trống !').notEmpty();
    req.checkBody('Ho', 'Họ trống !').notEmpty();
    req.checkBody('Ten', 'Tên trống !').notEmpty();
    req.checkBody('GioiTinh', 'Giới tính trống !').notEmpty();
    req.checkBody('NgaySinh', 'Ngày sinh trống !').notEmpty();
    req.checkBody('DiaChi', 'Địa chỉ trống !').notEmpty();
    req.checkBody('QueQuan', 'Quê quán trống !').notEmpty();
    req.checkBody('DanToc_id', 'Dân tộc chưa được chọn !').notEmpty();
    req.checkBody('TonGiao_id', 'Tôn giáo chưa được chọn !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_HOCSINH' });
    } else {
        try {
            const hocSinh = await HocSinh.findById(req.params.id);
            if (hocSinh) {
                hocSinh.set(req.body);
                hocSinh.save((error, result) => {
                    if (error) {
                        res.status(200).json({ status: false, msg: error.message, code: 'ERR_UPDATE_HOCSINH' })
                    }

                    else
                        res.status(200).json({ status: true, msg: 'Cập nhật mới học sinh thành công!', data: hocSinh })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_HOCSINH' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: "Lỗi: " + error, code: 'ERR_UPDATE_HOCSINH' })
        }
    }
}
exports.DeleteHocSinh = (req, res) => {
    req.checkParams('id', 'id học sinh trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_HOCSINH' });
    } else {
        HocSinh.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_HOCSINH' });
            res.status(200).json({ status: true, msg: 'Xoá học sinh ' + result.Ho + " " + result.Ten + ' thành công!' });
        })
    }
}