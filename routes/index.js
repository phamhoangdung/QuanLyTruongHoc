const GiaoVien = require('../controllers/GiaoVien.controller');
const MonHoc = require('../controllers/MonHoc.controller');
const NamHoc = require('../controllers/NamHoc.controller');
const Khoi = require('../controllers/Khoi.controller');
const HocKy = require('../controllers/HocKy.controller');

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
  app.get('/mon-hoc',(req,res)=>{
    res.render('MonHoc');
  })
  app.get('/hknhk',(req,res)=>{
    res.render('HocKyNamHocKhoi');
  })
  // router.post('create',GiaoVien.CreateGiaoVien);
  router.prefix('/giao-vien',(route)=>{
    route.get('/get',GiaoVien.GetGiaoVien);
    route.post('/create',GiaoVien.CreateGiaoVien);
    route.put('/update/:id',GiaoVien.UpdateGiaoVien);
    route.delete('/delete/:id',GiaoVien.DeleteGiaoVien);
  })

  //api for MonHoc
  router.prefix('/mon-hoc',(route)=>{
    route.post('/get',MonHoc.GetMonHoc);
    route.post('/create',MonHoc.CreateMonHoc);
    route.put('/update/:id',MonHoc.UpdateMonHoc);
    route.delete('/delete/:id',MonHoc.DeleteMonHoc);
  })
    //api for MonHoc
    router.prefix('/nam-hoc',(route)=>{
      route.post('/get',NamHoc.GetNamHoc);
      route.post('/create',NamHoc.CreateNamHoc);
      route.put('/update/:id',NamHoc.UpdateNamHoc);
      route.delete('/delete/:id',NamHoc.DeleteNamHoc);
    })
      //api for Khoi
  router.prefix('/khoi',(route)=>{
    route.post('/get',Khoi.GetKhoi);
    route.post('/create',Khoi.CreateKhoi);
    route.put('/update/:id',Khoi.UpdateKhoi);
    route.delete('/delete/:id',Khoi.DeleteKhoi);
  })
    //api for MonHoc
    router.prefix('/hoc-ky',(route)=>{
      route.post('/get',HocKy.GetHocKy);
      route.post('/create',HocKy.CreateHocKy);
      route.put('/update/:id',HocKy.UpdateHocKy);
      route.delete('/delete/:id',HocKy.DeleteHocKy);
    })
  app.use('/api/v1', router);
};
