const GiaoVien = require('../controllers/GiaoVien.controller');
const MonHoc = require('../controllers/MonHoc.controller');

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
  app.use('/api/v1', router);
};
