const Diem = require('../models/Diem.model');
const PhanLop = require('../models/PhanLop.model');
const PhanMon = require('../models/PhanMon.model');
const HocSinh = require('../models/HocSinh.model');
var xl = require('excel4node');

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
    if (!errors) {
        const conditions = {
            NamHoc_id: req.body.NamHoc_id,
            LopHoc_id: req.body.LopHoc_id,
            HocKy_id: req.body.HocKy_id,
            MonHoc_id: req.body.MonHoc_id
        }
        Diem.paginate(conditions, options, async (error, result) => {
            if (error) {
                res.status(200).json({ status: false, msg: error, code: 'ERR_GET_DIEM' });
            } else {
                if (result.docs.length > 0) {
                    let table = await PhanMon.findOne(conditions).populate({ path: "GiaoVien_id", select: "Ho Ten" });
                    res.status(200).json({ status: true, data: result.docs, GiaoVien: table, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
                } else {
                    res.status(200).json({ status: false, msg: "Dữ liệu không tồn tại" });
                }
            }
        })
    } else {
        res.status(200).json({ status: true, data: [] })
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
                    await phanLop.HocSinhs.map(async (e, i) => {
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

                    res.status(200).json({ status: true, msg: 'Tạo mới điểm thành công' })
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
function TinhDiemTBC(Diem) {
    let hs1 = [
        Diem.Diem_m01 == '' ? -1 : Diem.Diem_m01,
        Diem.Diem_m02 == '' ? -1 : Diem.Diem_m02,
        Diem.Diem_m03 == '' ? -1 : Diem.Diem_m03,
        Diem.Diem_m04 == '' ? -1 : Diem.Diem_m04,
        Diem.Diem_15p01 == '' ? -1 : Diem.Diem_15p01,
        Diem.Diem_15p02 == '' ? -1 : Diem.Diem_15p02,
        Diem.Diem_15p03 == '' ? -1 : Diem.Diem_15p03,
        Diem.Diem_15p04 == '' ? -1 : Diem.Diem_15p04,
    ];
    let demhs1 = 0;
    let sumhs1 = 0;
    hs1.map((e, i) => {
        if (e >= 0) {
            demhs1++;
            sumhs1 += parseInt(e);
        }
    })
    let hs2 = [
        Diem.Diem_1t01 == '' ? -1 : Diem.Diem_1t01,
        Diem.Diem_1t02 == '' ? -1 : Diem.Diem_1t02,
        Diem.Diem_1t03 == '' ? -1 : Diem.Diem_1t03,
        Diem.Diem_1t04 == '' ? -1 : Diem.Diem_1t04,
    ];
    let demhs2 = 0;
    let sumhs2 = 0;
    hs2.map((e, i) => {
        if (e >= 0) {
            demhs2++;
            sumhs2 += parseInt(e);
        }
    })
    let hs3 = Diem.Diem_HK == '' ? -1 : Diem.Diem_HK;
    if (hs3 >= 0) {
        return (Math.round((sumhs1 + sumhs2 * 2 + hs3 * 3) / (demhs1 + demhs2 * 2 + 3) * 4) / 4).toFixed(2);
    } else {
        return (Math.round((sumhs1 + sumhs2 * 2) / (demhs1 + demhs2 * 2) * 4) / 4).toFixed(2);
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
                // console.log( TinhDiemTBC(req.body));
                diem.set({
                    Diem_m01: req.body.Diem_m01,
                    Diem_m02: req.body.Diem_m02,
                    Diem_m03: req.body.Diem_m03,
                    Diem_m04: req.body.Diem_m04,
                    Diem_15p01: req.body.Diem_15p01,
                    Diem_15p02: req.body.Diem_15p02,
                    Diem_15p03: req.body.Diem_15p03,
                    Diem_15p04: req.body.Diem_15p04,
                    Diem_1t01: req.body.Diem_1t01,
                    Diem_1t02: req.body.Diem_1t02,
                    Diem_1t03: req.body.Diem_1t03,
                    Diem_1t04: req.body.Diem_1t04,
                    Diem_HK: req.body.Diem_HK,
                    Diem_TBC: TinhDiemTBC(req.body)
                });
                // res.status(200).json({ status: true, msg: 'Tạo mới điểm thành công!' })
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
exports.excelExport = async (req, res) => {
    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1');
    var style = wb.createStyle({
        border: {
            left: {
                style: 'thin',
                color: 'black',
            },
            right: {
                style: 'thin',
                color: 'black',
            },
            top: {
                style: 'thin',
                color: 'black',
            },
            bottom: {
                style: 'thin',
                color: 'black',
            },
            outline: false,
        },
        font: {
            size: 12,
        },
    });
    var styleHead = wb.createStyle({
        border: {
            left: {
                style: 'thin',
                color: 'black',
            },
            right: {
                style: 'thin',
                color: 'black',
            },
            top: {
                style: 'thin',
                color: 'black',
            },
            bottom: {
                style: 'thin',
                color: 'black',
            },
            outline: false,

        },
        font: {
            size: 12,
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        },
    });

    var data = Diem.find({
        NamHoc_id: req.query.NamHoc_id,
        LopHoc_id: req.query.LopHoc_id,
        HocKy_id: req.query.HocKy_id,
        MonHoc_id: req.query.MonHoc_id
    })
        .populate([{ path: "HocSinh_id", select: "Ho Ten" }, { path: "MonHoc_id", select: "TenMonHoc" }, { path: "LopHoc_id", select: "TenLopHoc" }])
        .lean()
        .exec((error, result) => {
            ws.cell(2, 1).string("Môn học");
            ws.cell(2, 2).string(result[0].MonHoc_id.TenMonHoc);
            ws.cell(3, 1).string("Lớp học");
            ws.cell(3, 2).string(result[0].LopHoc_id.TenLopHoc);
            ws.cell(4, 1).string("Họ").style(styleHead);
            ws.cell(4, 2).string("Tên").style(styleHead);
            ws.cell(4, 3, 4, 6, true).string('Điểm miệng').style(styleHead);
            ws.cell(4, 7, 4, 10, true).string("Điểm 15 phút").style(styleHead);
            ws.cell(4, 11, 4, 14, true).string("Điểm 1 tiết").style(styleHead);
            ws.cell(4, 15).string("Điểm HK").style(styleHead);
            ws.cell(4, 16).string("Điểm TBC").style(styleHead);
            if (error)
                console.log(error);
            else
                result.map((e, i) => {
                    ws.cell(i + 5, 1).string(e.HocSinh_id.Ho).style(style);
                    ws.cell(i + 5, 2).string(e.HocSinh_id.Ten).style(style);
                    ws.cell(i + 5, 3).string(e.Diem_m01.toString()).style(style);
                    ws.cell(i + 5, 4).string(e.Diem_m02.toString()).style(style);
                    ws.cell(i + 5, 5).string(e.Diem_m03.toString()).style(style);
                    ws.cell(i + 5, 6).string(e.Diem_m04.toString()).style(style);
                    ws.cell(i + 5, 7).string(e.Diem_15p01.toString()).style(style);
                    ws.cell(i + 5, 8).string(e.Diem_15p02.toString()).style(style);
                    ws.cell(i + 5, 9).string(e.Diem_15p03.toString()).style(style);
                    ws.cell(i + 5, 10).string(e.Diem_15p04.toString()).style(style);
                    ws.cell(i + 5, 11).string(e.Diem_1t01.toString()).style(style);
                    ws.cell(i + 5, 12).string(e.Diem_1t02.toString()).style(style);
                    ws.cell(i + 5, 13).string(e.Diem_1t03.toString()).style(style);
                    ws.cell(i + 5, 14).string(e.Diem_1t04.toString()).style(style);
                    ws.cell(i + 5, 15).string(e.Diem_HK.toString()).style(style);
                    ws.cell(i + 5, 16).string(e.Diem_TBC.toString()).style(style);
                })
            wb.write('ExcelFile.xlsx', res);
        })
}