var User = require('../models/user.model');
var HocSinh = require('../models/HocSinh.model');
var GiaoVien = require('../models/GiaoVien.model');

const ControllerUpload = require('../controllers/Multer.controller');
//khai báo middleware multer ở đây
const uploadMulter = require('../models/Multer');


exports.GetUser = (req, res) => {
    try {
        const options = {
            offset: req.body.start,
            page: req.body.draw,
            sort: { Khoi_id: 1 },
            limit: req.body.length,
            collation: {
                locale: 'en'
            }
        };
        User.paginate({}, options, (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_USER' });
            } else {
                res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
            }
        })
    } catch (error) {
        console.log(error);
    }
}
exports.CreateUser = async (req, res) => {
    try {
        req.checkBody('email', 'Tên đăng nhập trống !').notEmpty();
        req.checkBody('password', 'Mật khẩu trống !').notEmpty();
        req.checkBody('role', 'Quyền trống !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_USER' });
        } else {
            let emailCheck = await User.findOne({ email: req.body.email });
            if (emailCheck) {
                res.status(200).json({ status: false, msg: "Tên đăng nhập đã tồn tại", code: 'ERR_CREATE_USER' })
            } else {
                var user = new User({
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role,
                });
                await user.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_USER' })
                    res.status(200).json({ status: true, msg: 'Tạo mới tài khoản thành công!', data: result })
                })
            }
        }
    }
    catch (err) {
        res.status(500).json({ status: false, msg: err, code: 'ERR_CREATE_USER' })
    }
}
exports.UpdateUser = async (req, res) => {
    req.checkParams('id', 'ID trống !').notEmpty();
    req.checkBody('email', 'Tên đăng nhập trống !').notEmpty();
    req.checkBody('password', 'Mật khẩu trống !').notEmpty();
    req.checkBody('role', 'Quyền trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_UPDATE_USER' });
    } else {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                const usercheck = await User.findOne({ email: req.body.email });
                if (user.email === req.body.email) {
                    user.set(req.body);
                    user.save((error, result) => {
                        if (error)
                            res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_USER' })
                        else
                            res.status(200).json({ status: true, msg: 'Cập nhật tài khoản thành công!', data: user })
                    })
                } else {
                    if (!usercheck) {
                        user.set(req.body);
                        user.save((error, result) => {
                            if (error)
                                res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_USER' })
                            else
                                res.status(200).json({ status: true, msg: 'Cập nhật tài khoản thành công!', data: user })
                        })
                    } else {
                        res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_USER' })
                    }
                }
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_USER' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_USER' })
        }
    }
}
// exports.DeleteMonHoc = async (req, res) => {
//     req.checkParams('id', 'id môn học trống !').notEmpty();
//     const errors = req.validationErrors();
//     if (errors) {
//         res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_MONHOC' });
//     } else {
//         let giaoVien = await GiaoVien.findOne({ MonHoc_id: req.params.id });
//         let diem = await Diem.findOne({ MonHoc_id: req.params.id });
//         if (giaoVien || diem) {
//             res.status(200).json({ status: false, msg: "Môn học đang được sử dụng !", code: 'ERR_DELETE_MONHOC' });
//         } else {
//             MonHoc.findByIdAndDelete(req.params.id, (error, result) => {
//                 if (error)
//                     res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_MONHOC' });
//                 res.status(200).json({ status: true, msg: 'Xoá môn học ' + result.TenMonHoc + ' thành công!' });
//             })
//         }
//     }
// }