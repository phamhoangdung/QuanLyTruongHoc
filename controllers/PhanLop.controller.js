const HocSinh = require('../models/HocSinh.model');
const LopHoc = require('../models/LopHoc.model');
const NamHoc = require('../models/NamHoc.model');
const Khoi = require('../models/Khoi.model');
const PhanLop = require('../models/PhanLop.model');

exports.GetLopHocSinh = async (req, res) => {
    if (req.body.LopHoc_id && req.body.NamHoc_id && req.body.Khoi_id) {
        console.log(req.body.update);

        if (req.body.update) {
            const options = {
                offset: req.body.start,
                page: req.body.draw,
                limit: req.body.length,
                populate: [{ path: "DanToc_id", select: "_id TenDanToc" },
                { path: "TonGiao_id", select: "_id TenTonGiao" }],
                collation: {
                    locale: 'en'
                }
            };
            let phanLop = await PhanLop.findOne({ LopHoc_id: req.body.LopHoc_id, NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id });
            // HocSinh.find({ $or: [{ _id: { $in: phanLop.HocSinhs } }, { isClass: false }] }, (error, result) => {
            //     if (error) {
            //         res.status(200).json({ status: false, msg: error, code: 'ERR_GET_HOCSINH' });
            //     } else {
            //         res.status(200).json({ status: true, data: result })
            //     }
            // })
            HocSinh.paginate({ $or: [{ _id: { $in: phanLop.HocSinhs } }, { isClass: false }] }, options, (error, result) => {
                if (error) {
                    res.status(200).json({ status: false, msg: error, code: 'ERR_GET_HOCSINH' });
                } else {
                    res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                }
            })
        } else {
            PhanLop.findOne({ LopHoc_id: req.body.LopHoc_id, NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id })
                .populate({
                    path: "HocSinhs", populate:
                        [{ path: 'DanToc_id' }, { path: "TonGiao_id" }]
                })
                .lean()
                .exec((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error.message, code: 'ERR_GET_HOCSINH_CLASS' })
                    else {
                        if (!result)
                            res.status(200).json({ status: false, msg: "Không có dữ liệu, hoặc danh sách chưa được tạo !", code: 'ERR_GET_HOCSINH_CLASS' })
                        else
                            res.status(200).json({ status: true, msg: 'thành công!', data: result.HocSinhs, recordsFiltered: result.HocSinhs.length })
                    }

                })
        }
    } else {
        const options = {
            offset: req.body.start,
            page: req.body.draw,
            limit: req.body.length,
            populate: [{ path: "DanToc_id", select: "_id TenDanToc" },
            { path: "TonGiao_id", select: "_id TenTonGiao" }],
            collation: {
                locale: 'en'
            }
        };
        if (req.body.create) {
            HocSinh.paginate({ isClass: false }, options, (error, result) => {
                if (error) {
                    res.status(200).json({ status: false, msg: error, code: 'ERR_GET_HOCSINH' });
                } else {
                    res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                }
            })
        } else {
            HocSinh.paginate({}, options, (error, result) => {
                if (error) {
                    res.status(200).json({ status: false, msg: error, code: 'ERR_GET_HOCSINH' });
                } else {
                    res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                }
            })
        }
    }
}
exports.CreateLopHocSinh = async (req, res) => {
    try {
        req.checkBody('LopHoc_id', 'Lớp học trống !').notEmpty().isMongoId();
        req.checkBody('NamHoc_id', 'Năm học trống !').notEmpty().isMongoId();
        req.checkBody('Khoi_id', 'Khối trống !').notEmpty().isMongoId();
        req.checkBody('HocSinhs', 'Danh sách học sinh sai định dạng !').isArray();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_ADD_HOCSINH_TO_CLASS' });
        } else {
            let checkHocSinh = await HocSinh.findOne({ _id: { $in: req.body.HocSinhs }, isClass: true });
            let checkPhanLop = await PhanLop.findOne({ LopHoc_id: req.body.LopHoc_id, NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id });
            let lopHoc = await LopHoc.findOne({ _id: req.body.LopHoc_id, NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id, status: 1 });
            if (lopHoc && !checkPhanLop) {
                if (!checkHocSinh) {
                    var phanLop = new PhanLop({
                        LopHoc_id: req.body.LopHoc_id,
                        NamHoc_id: req.body.NamHoc_id,
                        Khoi_id: req.body.Khoi_id,
                        HocSinhs: req.body.HocSinhs,
                    });
                    if (req.body.HocSinhs.length) {
                        console.log(req.body.HocSinhs.length);
                        HocSinh.updateMany({ _id: { $in: req.body.HocSinhs } }, { "$set": { "isClass": true } }, { "multi": true }, (err, writeResult) => {
                            if (err)
                                console.log(err);
                        });
                    }
                    await phanLop.save((error, result) => {
                        if (error)
                            res.status(200).json({ status: false, msg: error.message, code: 'ERR_ADD_HOCSINH_TO_CLASS' })
                        res.status(200).json({ status: true, msg: 'thêm danh sách học sinh vào lớp thành công!', data: result })
                    })
                } else {
                    res.status(200).json({ status: false, msg: "Danh sách học sinh có chứa học sinh đã được phân lớp, Hoặc danh sách đã tồn tại !", code: 'ERR_ADD_HOCSINH_TO_CLASS' })
                }
            } else {
                res.status(200).json({ status: false, msg: "Thông tin lớp học không tồn tại, Hoặc đã được tạo !", code: 'ERR_ADD_HOCSINH_TO_CLASS' })
            }
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_ADD_HOCSINH_TO_CLASS' })
    }
}
exports.UpdateLopHocSinh = async (req, res) => {
    req.checkBody('LopHoc_id', 'Lớp học trống !').notEmpty().isMongoId();
    req.checkBody('NamHoc_id', 'Năm học trống !').notEmpty().isMongoId();
    req.checkBody('Khoi_id', 'Khối trống !').notEmpty().isMongoId();
    req.checkBody('HocSinhs', 'Danh sách học sinh sai định dạng !').isArray();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_HOCSINH' });
    } else {
        try {
            let phanLop = await PhanLop.findOne({ LopHoc_id: req.body.LopHoc_id, NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id });
            if (phanLop) {
                await HocSinh.updateMany({ _id: { $in: phanLop.HocSinhs } }, { "$set": { "isClass": false } }, { "multi": true }, (err, writeResult) => {
                    if (err)
                        console.log(err);
                });
                let checkHocSinh = await HocSinh.findOne({ _id: { $in: req.body.HocSinhs }, isClass: true });
                console.log(checkHocSinh);
                if (!checkHocSinh) {
                    await HocSinh.updateMany({ _id: { $in: req.body.HocSinhs } }, { "$set": { "isClass": true } }, { "multi": true }, (err, writeResult) => {
                        if (err)
                            console.log(err);
                    });
                    phanLop.set({ HocSinhs: req.body.HocSinhs });
                    phanLop.save((error, result) => {
                        if (error) {
                            res.status(200).json({ status: false, msg: error.message, code: 'ERR_UPDATE_HOCSINH' })
                        }
                        else
                            res.status(200).json({ status: true, msg: 'Cập nhật mới học sinh thành công!', data: phanLop })
                    })
                } else {
                    res.status(200).json({ status: false, msg: "Danh sách học sinh có chứa học sinh đã được phân lớp !", code: 'ERR_ADD_HOCSINH_TO_CLASS' })
                }

            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_HOCSINH' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: "Lỗi: " + error, code: 'ERR_UPDATE_HOCSINH' })
        }
    }
}
exports.DeleteLopHocSinh = (req, res) => {
    req.checkBody('LopHoc_id', 'Lớp học trống !').notEmpty().isMongoId();
    req.checkBody('NamHoc_id', 'Năm học trống !').notEmpty().isMongoId();
    req.checkBody('Khoi_id', 'Khối trống !').notEmpty().isMongoId();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_HOCSINH' });
    } else {
        try {
            PhanLop.findByIdAndDelete({ LopHoc_id: req.body.LopHoc_id, NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id }, (error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_HOCSINH' });
                res.status(200).json({ status: true, msg: 'Xoá học sinh ' + result.Ho + " " + result.Ten + ' thành công!' });
            })
        } catch (error) {
            res.status(500).json({ status: false, msg: "Lỗi: " + error, code: 'ERR_UPDATE_HOCSINH' })
        }
    }
}