const GiaoVien = require('../controllers/GiaoVien.controller');
const MonHoc = require('../controllers/MonHoc.controller');
const NamHoc = require('../controllers/NamHoc.controller');
const Khoi = require('../controllers/Khoi.controller');
const HocKy = require('../controllers/HocKy.controller');
const DanToc = require('../controllers/DanToc.controller');
const TonGiao = require('../controllers/TonGiao.controller');
const LopHoc = require('../controllers/LopHoc.controller');
const HocSinh = require('../controllers/HocSinh.controller');
const PhanLop = require('../controllers/PhanLop.controller');
const Diem = require('../controllers/Diem.controller');
const User = require('../controllers/User.controller');

const ControllerUpload = require('../controllers/Multer.controller');
//khai báo middleware multer ở đây
const uploadMulter = require('../models/Multer')

var AuthenticationController = require('../controllers/authentication.controller'),
  passportService = require('../configs/passport.config'),
  passport = require('passport');

var requireAuth = passport.authenticate('jwt', { session: false }),
  // requireLogin = passport.authenticate('local', { session: false });
  requireLogin = passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  });
// requireLogin = passport.authenticate('local', {
//   successRedirect: '/quan-ly-diem',
//   failureRedirect: 'api/v1/auth/login',
//   failureFlash: true
// });


module.exports = (app) => {
  let express = require('express');
  let router = express.Router(),
    authRoutes = express.Router();

  app.use(passport.initialize());
  app.use(passport.session());
  passportService(passport);
  router.use('/auth', authRoutes);

  authRoutes.post('/register', AuthenticationController.register);
  authRoutes.post('/login', requireLogin, AuthenticationController.login);
  // authRoutes.post('/login', requireLogin);

  authRoutes.get('/protected', requireAuth, function (req, res) {
    res.send({ content: 'Success' });
  });

  express.application.prefix = express.Router.prefix = function (path, configure) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
  };
  /* GET home page. */
  app.get('/', isLoggedIn, function (req, res, next) {
    res.render('index', { user: req.user });
  });
  app.get('/mon-hoc', isLoggedIn, AuthenticationController.roleAuthorization(['admin']), (req, res) => {
    res.render('MonHoc', { user: req.user });
  });
  app.get('/hknhk', isLoggedIn, AuthenticationController.roleAuthorization(['admin']), (req, res) => {
    res.render('HocKyNamHocKhoi', { user: req.user });
  });
  app.get('/dantoc-tongiao', isLoggedIn, AuthenticationController.roleAuthorization(['admin']), (req, res) => {
    res.render('DanTocTonGiao', { user: req.user });
  });
  app.get('/lop-hoc', isLoggedIn, AuthenticationController.roleAuthorization(['admin']), async (req, res) => {
    res.render('LopHoc', { user: req.user });
  });
  app.get('/giao-vien', isLoggedIn, AuthenticationController.roleAuthorization(['admin']), async (req, res) => {
    res.render('GiaoVien', { user: req.user });
  });
  app.get('/hoc-sinh', isLoggedIn, AuthenticationController.roleAuthorization(['admin', 'teacher']), async (req, res) => {
    res.render('HocSinh', { user: req.user });
  });
  app.get('/phan-lop', isLoggedIn, AuthenticationController.roleAuthorization(['admin']), async (req, res) => {
    res.render('PhanLop', { user: req.user });
  });
  app.get('/quan-ly-diem', isLoggedIn, AuthenticationController.roleAuthorization(['admin', 'teacher']), async (req, res) => {
    res.render('QuanLyDiem', { user: req.user });
  });
  app.get('/ds-hoc-sinh', isLoggedIn, AuthenticationController.roleAuthorization(['admin', 'teacher']), (req, res) => {
    res.render('DanhSachHocSinh', { user: req.user });
  });
  app.get('/ds-giao-vien', isLoggedIn, AuthenticationController.roleAuthorization(['admin', 'teacher','student']), (req, res) => {
    res.render('DanhSachGiaoVien', { user: req.user });
  });
  app.get('/quan-ly-tai-khoan', isLoggedIn, AuthenticationController.roleAuthorization(['admin']), async (req, res) => {
    res.render('QuanLyTaiKhoan', { user: req.user });
  });
  app.get('/tra-cuu', isLoggedIn, AuthenticationController.roleAuthorization(['student']), (req, res) => {
    res.render('TraCuuDiem', { user: req.user });
  });
  app.get('/change-password', isLoggedIn, (req, res) => {
    res.render('ChangePassword', { layout: false, user: req.user });
  });
  app.get('/tra-cuu-mon-hoc', (req, res) => {
    res.render('TraCuuTheoMon', { user: req.user });
    // Diem.TraCuuMonHoc;
  });
  app.get('/login', (req, res) => {
    res.render('Login', { layout: false, title: 'login', message: req.flash('message') });
  });
  app.get('/logout', function (req, res) {
    req.logout();
    // delete req.session;
    res.redirect('/login');

    // req.session.destroy(function (err) {
    //    //Inside a callback… bulletproof!
    // });
  });

  function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    // console.log(req.user);
    if (req.isAuthenticated())
      return next();
    res.redirect('/login');
  }

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
    // route.get('/select-mon-hoc', isLoggedIn, AuthenticationController.roleAuthorization(['admin']), MonHoc.selectMonHoc);
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
    route.get('/select-hoc-ky', HocKy.selectHocKy);
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
    route.get('/export-excel', PhanLop.excelExport);
  })
  //api for Diem
  router.prefix('/diem', (route) => {
    route.get('/export-excel', Diem.excelExport);
    route.post('/tra-cuu', Diem.TraCuuForHocSinh);
    route.post('/get', Diem.GetDiem);
    route.post('/create', Diem.CreateDiem);
    route.put('/update/:id', Diem.UpdateDiem);
    route.delete('/delete/:id', Diem.DeleteDiem);
  })
  //api for QuanLyTaiKhoan
  router.prefix('/quan-ly-tai-khoan', (route) => {
    route.post('/get', User.GetUser);
    route.post('/create', User.CreateUser);
    route.post('/change-password', User.changePassword);
    route.put('/update/:id', User.UpdateUser);
    // route.delete('/delete/:id', User.DeleteDiem);
  })

  app.post('/uploadSingle', uploadMulter.single('avatar'), ControllerUpload.uploadSingleFile);
  app.use('/api/v1', router);
};
