const LopHoc = require('../models/LopHoc.model');
const PhanLop = require('../models/PhanLop.model');

exports.selectLopHoc = async (req, res) => {
    let data;
    if (req.query.search) {
        data = await LopHoc.find({ $text: { $search: req.query.search }, Khoi_id: req.query.Khoi_id, NamHoc_id: req.query.NamHoc_id });
    } else {
        data = await LopHoc.find({ Khoi_id: req.query.Khoi_id, NamHoc_id: req.query.NamHoc_id });
    }
    let result = [];
    data.map(async (e, i) => {
        // let phanLop = await PhanLop.findOne({ LopHoc_id: e._id, NamHoc_id: req.query.NamHoc_id, Khoi_id: req.query.Khoi_id });
        // console.log(phanLop.HocSinhs.length);

        result.push({ "id": e._id, "text": e.TenLopHoc });
    })
    console.log(result);

    res.status(200).json(result);
}
exports.GetLopHoc = (req, res) => {
    const options = {
        offset: req.body.start,
        page: req.body.draw,
        sort: { created_at: -1 },
        limit: req.body.length,
        populate: [{ path: "NamHoc_id", select: "_id TenNamHoc" }, { path: "Khoi_id", select: "_id TenKhoi" },
        { path: "GiaoVien_id", select: "_id Ho Ten" }],
        //populate: {path:"Khoi_id",select:"_id TenKhoi"},
        // populate: {path:"GiaoVienChuNhiem_id",select:"_id TenGiaoVien"},
        collation: {
            locale: 'en'
        }
    };
    LopHoc.paginate({}, options, (error, result) => {
        if (error) {
            res.status(200).json({ status: false, msg: error, code: 'ERR_GET_LOPHOC' });
        } else {
            res.status(200).json({ status: true, data: result.docs, recordsTotal: result.limit, recordsFiltered: result.totalDocs })
        }
    })
}
exports.CreateLopHoc = async (req, res) => {
    try {
        console.log(req.body);

        req.checkBody('TenLopHoc', 'Tên lớp học trống !').notEmpty();
        req.checkBody('SiSo', 'Sĩ số trống !').notEmpty();
        req.checkBody('Khoi_id', 'Khối chưa được chọn !').notEmpty().isMongoId();
        req.checkBody('NamHoc_id', 'Năm học chưa đưỢc chọn !').notEmpty().isMongoId();
        req.checkBody('GiaoVien_id', 'Giáo viên chủ nhiệm chưa đưỢc chọn !').notEmpty().isMongoId();
        req.checkBody('status', 'Trạng thái chưa đưỢc chọn !').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_LOPHOC' });
        } else {
            var lopHoc = new LopHoc({
                TenLopHoc: req.body.TenLopHoc,
                SiSo: req.body.SiSo,
                Khoi_id: req.body.Khoi_id,
                NamHoc_id: req.body.NamHoc_id,
                GiaoVien_id: req.body.GiaoVien_id,
                status: req.body.status
            });
            await lopHoc.save((error, result) => {
                if (error)
                    res.status(200).json({ status: false, msg: error, code: 'ERR_CREATE_LOPHOC' })
                res.status(200).json({ status: true, msg: 'Tạo mới lớp học thành công!', data: result })
            })
        }
    }
    catch (err) {
        res.status(200).json({ status: false, msg: err, code: 'ERR_CREATE_LOPHOC' })
    }
}
exports.UpdateLopHoc = async (req, res) => {
    req.checkBody('TenLopHoc', 'Tên lớp học trống !').notEmpty();
    req.checkBody('SiSo', 'Sĩ số trống !').notEmpty();
    req.checkBody('Khoi_id', 'Khối chưa được chọn !').notEmpty();
    req.checkBody('NamHoc_id', 'Năm học chưa đưỢc chọn !').notEmpty();
    req.checkBody('GiaoVien_id', 'Giáo viên chủ nhiệm chưa đưỢc chọn !').notEmpty();
    req.checkBody('status', 'Trạng thái chưa đưỢc chọn !').notEmpty();
    req.checkParams('id', 'id lớp học trống !').isMongoId();
    const errors = req.validationErrors();
    if (errors) {

        res.status(200).json({ status: false, msg: errors, code: 'ERR_CREATE_LOPHOC' });
    } else {
        try {
            const lopHoc = await LopHoc.findById(req.params.id);
            if (lopHoc) {
                await PhanLop.findOneAndUpdate({ LopHoc_id: lopHoc._id }, { NamHoc_id: req.body.NamHoc_id, Khoi_id: req.body.Khoi_id })
                lopHoc.set(req.body);
                lopHoc.save((error, result) => {
                    if (error)
                        res.status(200).json({ status: false, msg: error, code: 'ERR_UPDATE_LOPHOC' })
                    res.status(200).json({ status: true, msg: 'Cập nhật mới lớp học thành công!', data: lopHoc })
                })
            } else {
                res.status(200).json({ status: false, msg: 'Không có dữ liệu', code: 'ERR_UPDATE_LOPHOC' })
            }
        } catch (error) {
            res.status(500).json({ status: false, msg: error, code: 'ERR_UPDATE_LOPHOC' })
        }
    }
}
exports.DeleteLopHoc = (req, res) => {
    req.checkParams('id', 'id lớp học trống !').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.status(200).json({ status: false, msg: errors[0], code: 'ERR_CREATE_LOPHOC' });
    } else {
        LopHoc.findByIdAndDelete(req.params.id, (error, result) => {
            if (error)
                res.status(200).json({ status: false, msg: error, code: 'ERR_DELETE_LOPHOC' });
            res.status(200).json({ status: true, msg: 'Xoá lớp học ' + result.TenLopHoc + ' thành công!' });
        })
    }
}