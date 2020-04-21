const GiaoVien = require('../controllers/GiaoVien.controller');
const MonHoc = require('../controllers/MonHoc.controller');
const NamHoc = require('../controllers/NamHoc.controller');
const Khoi = require('../controllers/Khoi.controller');
const KhoiModel = require('../models/Khoi.model');
const HocSinhModel = require('../models/HocSinh.model');
const HocKy = require('../controllers/HocKy.controller');
const DanToc = require('../controllers/DanToc.controller');
const TonGiao = require('../controllers/TonGiao.controller');
const LopHoc = require('../controllers/LopHoc.controller');
const HocSinh = require('../controllers/HocSinh.controller');
const PhanLop = require('../controllers/PhanLop.controller');

module.exports = (app) => {
  let express = require('express');
  let router = express.Router();
  express.application.prefix = express.Router.prefix = function (path, configure) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
  };
  /* GET home page. */
  app.get('/', function (req, res, next) {
    res.render('index');
  });
  app.get('/mon-hoc', (req, res) => {
    res.render('MonHoc');
  });
  app.get('/hknhk', (req, res) => {
    res.render('HocKyNamHocKhoi');
  });
  app.get('/dantoc-tongiao', (req, res) => {
    res.render('DanTocTonGiao');
  });
  app.get('/lop-hoc', async (req, res) => {
    res.render('LopHoc');
  });
  app.get('/giao-vien', async (req, res) => {
    res.render('GiaoVien');
  });
  app.get('/hoc-sinh', async (req, res) => {
    res.render('HocSinh');
  });
  app.get('/phan-lop', async (req, res) => {
    let result = await HocSinhModel.find({isClass:false})
    res.render('PhanLop',{HocSinh:result});
  });
  // router.post('create',GiaoVien.CreateGiaoVien);
  router.prefix('/giao-vien', (route) => {
    route.get('/select-giao-vien', GiaoVien.selectGiaoVien);
    route.post('/get', GiaoVien.GetGiaoVien);
    route.post('/create', GiaoVien.CreateGiaoVien);
    route.put('/update/:id', GiaoVien.UpdateGiaoVien);
    route.delete('/delete/:id', GiaoVien.DeleteGiaoVien);
  })

  //api for MonHoc
  router.prefix('/mon-hoc', (route) => {
    route.get('/select-mon-hoc', MonHoc.selectMonHoc);
    route.post('/get', MonHoc.GetMonHoc);
    route.post('/create', MonHoc.CreateMonHoc);
    route.put('/update/:id', MonHoc.UpdateMonHoc);
    route.delete('/delete/:id', MonHoc.DeleteMonHoc);
  })
  //api for NamHoc
  router.prefix('/nam-hoc', (route) => {
    route.get('/select-nam-hoc', NamHoc.selectNamHoc);
    route.post('/get', NamHoc.GetNamHoc);
    route.post('/create', NamHoc.CreateNamHoc);
    route.put('/update/:id', NamHoc.UpdateNamHoc);
    route.delete('/delete/:id', NamHoc.DeleteNamHoc);
  })
  //api for Khoi
  router.prefix('/khoi', (route) => {
    route.get('/select-khoi', Khoi.selectKhoi);
    route.post('/get', Khoi.GetKhoi);
    route.post('/create', Khoi.CreateKhoi);
    route.put('/update/:id', Khoi.UpdateKhoi);
    route.delete('/delete/:id', Khoi.DeleteKhoi);
  })
  //api for MonHoc
  router.prefix('/hoc-ky', (route) => {
    route.post('/get', HocKy.GetHocKy);
    route.post('/create', HocKy.CreateHocKy);
    route.put('/update/:id', HocKy.UpdateHocKy);
    route.delete('/delete/:id', HocKy.DeleteHocKy);
  })
  //api for DanToc
  router.prefix('/dan-toc', (route) => {
    route.get('/select-dan-toc', DanToc.selectDanToc);
    route.post('/get', DanToc.GetDanToc);
    // route.post('/create', HocKy.CreateHocKy);
    // route.put('/update/:id', HocKy.UpdateHocKy);
    // route.delete('/delete/:id', HocKy.DeleteHocKy);
  })
  //api for TonGiao
  router.prefix('/ton-giao', (route) => {
    route.get('/select-ton-giao', TonGiao.selectTonGiao);
    route.post('/get', TonGiao.GetTonGiao);
    // route.post('/create', HocKy.CreateHocKy);
    // route.put('/update/:id', HocKy.UpdateHocKy);
    // route.delete('/delete/:id', HocKy.DeleteHocKy);
  })
  //api for LopHoc
  router.prefix('/lop-hoc', (route) => {
    route.get('/select-lop-hoc', LopHoc.selectLopHoc);
    route.post('/get', LopHoc.GetLopHoc);
    route.post('/create', LopHoc.CreateLopHoc);
    route.put('/update/:id', LopHoc.UpdateLopHoc);
    route.delete('/delete/:id', LopHoc.DeleteLopHoc);
  })
  //api for HocSinh
  router.prefix('/hoc-sinh', (route) => {
    route.post('/get', HocSinh.GetHocSinh);
    route.post('/create', HocSinh.CreateHocSinh);
    route.put('/update/:id', HocSinh.UpdateHocSinh);
    route.delete('/delete/:id', HocSinh.DeleteHocSinh);
  })
  //api for PhanLop
  router.prefix('/phan-lop', (route) => {
    route.post('/get', PhanLop.GetLopHocSinh);
    route.post('/create', PhanLop.CreateLopHocSinh);
    route.put('/update', PhanLop.UpdateLopHocSinh);
    route.delete('/delete/:id', PhanLop.DeleteLopHocSinh);
  })
  app.use('/api/v1', router);
};
