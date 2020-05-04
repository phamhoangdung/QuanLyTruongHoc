const Diem = require('../models/Diem.model');
const PhanLop = require('../models/PhanLop.model');
const HocSinh = require('../models/HocSinh.model');
const excel = require('node-excel-export');

exports.ExportExcel = async (req, res) => {

    const specification = {
        customer_name: { // <- the key should match the actual data key
            displayName: 'Customer', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: function (value, row) { // <- style renderer function
                return (row.status_id == 1) ? styles.cellGreen : { fill: { fgColor: { rgb: 'FFFF0000' } } }; // <- Inline cell style is possible 
            },
            width: 120 // <- width in pixels
        },
        status_id: {
            displayName: 'Status',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
                return (value == 1) ? 'Active' : 'Inactive';
            },
            width: '10' // <- width in chars (when the number is passed as string)
        },
        note: {
            displayName: 'Description',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        }
    }

    const dataset = [
        { customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown' },
        { customer_name: 'HP', status_id: 0, note: 'some note' },
        { customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown' }
    ]

    const merges = [
        { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
        { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
        { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
    ]

    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'Report', // <- Specify sheet name (optional)
                heading: heading, // <- Raw heading array (optional)
                merges: merges, // <- Merge cell ranges
                specification: specification, // <- Report specification
                data: dataset // <-- Report data
            }
        ]
    );

    res.attachment('report.xlsx'); 
    return res.send(report);
}
exports.TraCuuForHocSinh = async (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        populate: [{ path: "MonHoc_id", select: "_id TenMonHoc" },
        { path: "NamHoc_id", select: "_id" },
        { path: "LopHoc_id", select: "_id" },
        { path: "HocKy_id", select: "_id" }],
        // sort: { HocSinh_id.Ten: 1 },
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    if (req.user && req.user.role == "student") {
        let hocSinh = await HocSinh.findOne({ TaiKhoan: req.user._id });
        let phanLop = await PhanLop.findOne({ HocSinhs: hocSinh._id });

        if (phanLop) {
            Diem.paginate({
                HocSinh_id: hocSinh._id,
                NamHoc_id: phanLop.NamHoc_id,
                LopHoc_id: phanLop.LopHoc_id,
            }, options, (error, result) => {
                if (error) {
                    res.status(200).json({ status: false, msg: error, code: 'ERR_GET_DIEM' });
                } else {
                    if (result.docs.length > 0) {
                        res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                    } else {
                        res.status(200).json({ status: false, msg: "Dữ liệu không tồn tại" });
                    }
                }
            })
        } else {
            res.status(200).json({ status: false, msg: "Chưa có dữ liệu về học sinh này !" });
        }
    } else {
        res.status(200).json({ status: false, msg: "Không xác định được người dùng !" });
    }
}
exports.GetDiem = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        populate: { path: "HocSinh_id", select: "_id Ho Ten" },
        // sort: { HocSinh_id.Ten: 1 },
        limit: req.body.length,
        collation: {
            locale: 'en'
        }
    };
    req.checkBody('HocKy_id', 'Học kỳ chưa được chọn !').notEmpty();
    req.checkBody('MonHoc_id', 'Môn học chưa được chọn !').notEmpty();
    req.checkBody('LopHoc_id', 'Lớp học chưa được chọn !').notEmpty();
    req.checkBody('NamHoc_id', 'Năm học chưa được chọn !').notEmpty();
    const errors = req.validationErrors();
    if (!req.body.HocKy_id && !req.body.MonHoc_id && !req.body.LopHoc_id && !req.body.NamHoc_id) {
        Diem.paginate({}, options, (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_DIEM' });
            } else {
                if (result.docs.length > 0) {
                    res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                } else {
                    res.status(200).json({ status: false, msg: "Dữ liệu không tồn tại" });
                }
            }
        })
    } else {
        const conditions = {
            NamHoc_id: req.body.NamHoc_id,
            Lop_id: req.body.Lop_id,
            HocKy_id: req.body.HocKy_id,
            MonHoc_id: req.body.MonHoc_id
        }
        Diem.paginate(conditions, options, (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_DIEM' });
            } else {
                if (result.docs.length > 0) {
                    res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                } else {
                    res.status(200).json({ status: false, msg: "Dữ liệu không tồn tại" });
                }
            }
        })
    }
}
exports.CreateDiem = async (req, res) => {
    try {
        req.checkBody('HocKy_id', 'Học kỳ trống !').notEmpty();
        req.checkBody('MonHoc_id', 'Môn học trống !').notEmpty();
        req.checkBody('LopHoc_id', 'Lớp trống !').notEmpty();
        req.checkBody('Khoi_id', 'Khối trống !').notEmpty();
        req.checkBody('NamHoc_id', 'Năm học chưa được chọn !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_DIEM' });
        } else {
            let phanLop = await PhanLop.findOne({
                LopHoc_id: req.body.LopHoc_id,
                NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id
            });
            if (phanLop) {
                if (phanLop.HocSinhs.length > 0) {
                    phanLop.HocSinhs.map(async (e, i) => {
                        let diemCheck = await Diem.findOne({
                            HocSinh_id: e, NamHoc_id: req.body.NamHoc_id,
                            LopHoc_id: req.body.LopHoc_id,
                            HocKy_id: req.body.HocKy_id,
                            MonHoc_id: req.body.MonHoc_id
                        });
                        if (!diemCheck) {
                            let diem = new Diem({
                                HocSinh_id: e,
                                NamHoc_id: req.body.NamHoc_id,
                                LopHoc_id: req.body.LopHoc_id,
                                HocKy_id: req.body.HocKy_id,
                                MonHoc_id: req.body.MonHoc_id
                            })
                            await diem.save();
                        }
                    })
                    res.status(200).json({ status: true, msg: 'Tạo mới điểm thành công!' })
                } else {
                    res.status(200).json({ status: false, msg: "Danh sách học sinh rỗng !", code: 'ERR_CREATE_DIEM' })
                }
            } else {
                res.status(200).json({ status: false, msg: "Lớp học chưa có học sinh !", code: 'ERR_CREATE_DIEM' })
            }

            // var diem = new Diem({
            //     HocSinh_id: req.body.HocSinh_id,
            //     HocKy_id: req.body.HocKy_id,
            //     MonHoc_id: req.body.MonHoc_id,
            //     Lop_id: req.body.Lop_id,
            //     LoaiDiem_id: req.body.LoaiDiem_id,
            //     Diem: req.body.Diem,
            // });
            // await diem.save((error, result) => {
            //     if (error)
            //         res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_DIEM' })
            //     res.status(200).json({ status: true, msg: 'Tạo mới điểm thành công!', data: result })
            // })
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_DIEM' })
    }
}
exports.UpdateDiem = async (req, res) => {
    req.checkParams('id', 'id trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_DIEM' });
    } else {
        try {
            const diem = await Diem.findById(req.params.id);
            if (diem) {
                diem.set(req.body);
                diem.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_DIEM' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới điểm thành công!', data: diem })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_DIEM' })
            }
        } catch (error) {
            console.log(error);

            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_DIEM' })
        }
    }
}
//Tự sinh điểm
exports.DeleteDiem = (req, res) => {
    req.checkParams('id', 'id điểm trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_DIEM' });
    } else {
        Diem.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_DIEM' });
            res.status(200).json({ status: true, msg: 'Xoá điểm ' + result.TenDiem + ' thành công!' });
        })
    }
}