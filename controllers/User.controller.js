var User = require('../models/user.model');

exports.GetUser = (req, res) => {
    try {
        const options = {
            offset: req.body.start,
            page: req.body.draw,
            // populate: { path: "Khoi_id", select: "_id TenKhoi" },
            sort: { Khoi_id: 1 },
            limit: req.body.length,
            collation: {
                locale: 'en'
            }
        };
        User.paginate({}, options, (error, result) => {
            console.log("=>" + result);

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
// exports.CreateMonHoc = async (req, res) => {
//     try {
//         req.checkBody('TenMonHoc', 'Tên môn học trống !').notEmpty();
//         req.checkBody('SoTiet', 'Số tiết trống !').notEmpty();
//         req.checkBody('Khoi_id', 'Khối trống !').notEmpty();
//         const errors = req.validationErrors();
//         if (errors) {
//             res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_MONHOC' });
//         } else {
//             let monHocCheck = await MonHoc.findOne({ TenMonHoc: req.body.TenMonHoc });
//             if (monHocCheck) {
//                 res.status(200).json({ status: false, msg: "Môn học đã tồn tại", code: 'ERR_CREATE_MONHOC' })
//             } else {
//                 var monHoc = new MonHoc({
//                     TenMonHoc: req.body.TenMonHoc,
//                     SoTiet: req.body.SoTiet,
//                     Khoi_id: req.body.Khoi_id,
//                 });
//                 await monHoc.save((error, result) => {
//                     if (error)
//                         res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_MONHOC' })
//                     res.status(200).json({ status: true, msg: 'Tạo mới môn học thành công!', data: result })
//                 })
//             }
//         }
//     }
//     catch (err) {
//         res.status(500).json({ status: false, msg: err, code: 'ERR_CREATE_MONHOC' })
//     }
// }
// exports.UpdateMonHoc = async (req, res) => {
//     req.checkBody('TenMonHoc', 'Tên môn học trống !').notEmpty();
//     req.checkBody('SoTiet', 'Tên số tiết trống !').notEmpty();
//     req.checkParams('id', 'id môn học trống !').isMongoId();
//     req.checkBody('Khoi_id', 'Khối trống !').notEmpty();
//     const errors = req.validationErrors();
//     if (errors) {
//         res.status(200).json({ status: false, msg: errors[0], code: 'ERR_UPDATE_MONHOC' });
//     } else {
//         try {
//             const monHoc = await MonHoc.findById(req.params.id);
//             if (monHoc) {
//                 monHoc.set(req.body);
//                 monHoc.save((error, result) => {
//                     if (error)
//                         res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_MONHOC' })
//                     res.status(200).json({ status: true, msg: 'Cập nhật mới môn học thành công!', data: monHoc })
//                 })
//             } else {
//                 res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_MONHOC' })
//             }
//         } catch (error) {
//             res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_MONHOC' })
//         }
//     }
// }
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