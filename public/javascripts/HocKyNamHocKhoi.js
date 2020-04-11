var tableNamHoc = $('#tblresultNamHoc').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/nam-hoc/get",
        "type": "POST",
        "dataType": "json",
        // 'beforeSend': function (request) {
        //     request.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        // },
        "cache": true,
        "dataSrc": function (json) {
            console.log(json.data);

            json.data.forEach(element => {
                element.Method = `<a class=" my-method-button btnEdit fa-hover"    title="Sửa tài khoản" ><i class="fa fa-edit"></i></a> &nbsp
                                <a class=" my-method-button btnDelete fa-hover"    title="Xóa tài khoản" ><i class="fa fa-trash"></i></a>`;
            });

            return json.data;
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": 1 },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": 0
        },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": 3
        }
    ],
    "language": {
        "sLengthMenu": "Số bản ghi hiển thị trên 1 trang _MENU_ ",
        "sInfo": "Hiển thị từ _START_ đến _END_ của _TOTAL_ bản ghi",
        "search": "Tìm kiếm:",
        "oPaginate": {
            "sFirst": "Đầu",
            "sPrevious": "Trước",
            "sNext": "Tiếp",
            "sLast": "Cuối"
        }
    },
    columns: [
        { "data": null },
        { "data": '_id' },
        { "data": 'TenNamHoc' },
        { "data": 'Method' }
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});
var tableKhoi = $('#tblresultKhoi').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/khoi/get",
        "type": "POST",
        "dataType": "json",
        // 'beforeSend': function (request) {
        //     request.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        // },
        "cache": true,
        "dataSrc": function (json) {
            console.log(json.data);

            json.data.forEach(element => {
                element.Method = `<a class=" my-method-button btnEdit fa-hover"    title="Sửa tài khoản" ><i class="fa fa-edit"></i></a> &nbsp
                                <a class=" my-method-button btnDelete fa-hover"    title="Xóa tài khoản" ><i class="fa fa-trash"></i></a>`;
            });

            return json.data;
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": 1 },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": 0
        },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": 3
        }
    ],
    "language": {
        "sLengthMenu": "Số bản ghi hiển thị trên 1 trang _MENU_ ",
        "sInfo": "Hiển thị từ _START_ đến _END_ của _TOTAL_ bản ghi",
        "search": "Tìm kiếm:",
        "oPaginate": {
            "sFirst": "Đầu",
            "sPrevious": "Trước",
            "sNext": "Tiếp",
            "sLast": "Cuối"
        }
    },
    columns: [
        { "data": null },
        { "data": '_id' },
        { "data": 'TenKhoi' },
        { "data": 'Method' }
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});
var tableHocKy = $('#tblresultHocKy').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/hoc-ky/get",
        "type": "POST",
        "dataType": "json",
        // 'beforeSend': function (request) {
        //     request.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        // },
        "cache": true,
        "dataSrc": function (json) {
            console.log(json.data);

            json.data.forEach(element => {
                element.Method = `<a class=" my-method-button btnEdit fa-hover"    title="Sửa tài khoản" ><i class="fa fa-edit"></i></a> &nbsp
                                <a class=" my-method-button btnDelete fa-hover"    title="Xóa tài khoản" ><i class="fa fa-trash"></i></a>`;
            });

            return json.data;
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": 1 },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": 0
        },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": 3
        }
    ],
    "language": {
        "sLengthMenu": "Số bản ghi hiển thị trên 1 trang _MENU_ ",
        "sInfo": "Hiển thị từ _START_ đến _END_ của _TOTAL_ bản ghi",
        "search": "Tìm kiếm:",
        "oPaginate": {
            "sFirst": "Đầu",
            "sPrevious": "Trước",
            "sNext": "Tiếp",
            "sLast": "Cuối"
        }
    },
    columns: [
        { "data": null },
        { "data": '_id' },
        { "data": 'TenHocKy' },
        { "data": 'HeSo' },
        { "data": 'Method' }
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});

// insert

$("#btnAddNamHoc").click(function () {
    $('#c_TenNonHoc').val(null);
    $("#createModalNamHoc").modal('show');
});
$("#btnAddHocKy").click(function () {
    $('#c_TenHocKy').val(null);
    $('#c_HeSo').val(null);
    $("#createModalHocKy").modal('show');
});
$("#btnAddKhoi").click(function () {
    $('#c_TenKhoi').val(null);
    $("#createModalKhoi").modal('show');
});

function sendData(option, data) {
    $.ajax({
        url: "/api/v1/" + option.uri,
        method: option.method,
        data: data,
        dataType: 'json'
    })
        .done((data) => {
            if (data.status) {
                $(option.tableName).DataTable().ajax.reload();
                $(option.modalName).modal('hide');
                toastr["success"](data.msg);
            }
            else {
                console.log(data.msg);
                data.msg.forEach((e, i) => {
                    toastr["error"]("Lỗi số " + (i + 1) + " :" + e.msg);
                })
            }
        })
        .fail(() => {
            $(modalName).modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
    $("#btnSubmitConfirm").removeAttr("disabled");
}
$('#frmPostNamHoc').submit((e) => {
    let option = {
        uri: 'nam-hoc/create',
        method: "POST",
        tableName: "#tblresultNamHoc",
        modalName: "#createModalNamHoc"
    }
    e.preventDefault();
    let form = $('#frmPostNamHoc').serializeArray();
    sendData(option, form)
});
$('#frmPostHocKy').submit((e) => {
    e.preventDefault();
    let option = {
        uri: 'hoc-ky/create',
        method: "POST",
        tableName: "#tblresultHocKy",
        modalName: "#createModalHocKy"
    }
    let form = $('#frmPostHocKy').serializeArray();
    sendData(option, form)
});
$('#frmPostKhoi').submit((e) => {
    e.preventDefault();
    let option = {
        uri: 'khoi/create',
        method: "POST",
        tableName: "#tblresultKhoi",
        modalName: "#createModalKhoi"
    }
    let form = $('#frmPostKhoi').serializeArray();
    sendData(option, form)
});

$("#tblresultNamHoc").on("click", ".btnEdit", function () {
    var obj = $('#tblresult').DataTable().row($(this).parents('tr')).data();
    $('#u_id').val(obj._id);
    $('#u_TenNamHoc').val(obj.TenNamHoc);
    $("#updatemodalNamHoc").modal('show');
});
$("#tblresultKhoi").on("click", ".btnEdit", function () {
    var obj = $('#tblresult').DataTable().row($(this).parents('tr')).data();
    $('#u_id').val(obj._id);
    $('#u_TenKhoi').val(obj.TenKhoi);
    $("#updatemodalKhoi").modal('show');
});
$("#tblresultHocKy").on("click", ".btnEdit", function () {
    var obj = $('#tblresult').DataTable().row($(this).parents('tr')).data();
    $('#u_id').val(obj._id);
    $('#u_TenHocKy').val(obj.TenHocKy);
    $('#u_HeSo').val(obj.HeSo);
    $("#updatemodalHocKy").modal('show');
});

// update
$('#frmPutNamHoc').submit((e) => {
    var id = $('#u_id').val();
    let option = {
        uri: 'nam-hoc/update/' + id,
        method: "PUT",
        tableName: "#tblresultNamHoc",
        modalName: "#updateModalNamHoc"
    }
    e.preventDefault();
    let form = $('#frmPutNamHoc').serializeArray();
    sendData(option, form)
});
$('#frmPutHocKy').submit((e) => {
    var id = $('#u_id').val();
    let option = {
        uri: 'hoc-ky/update/' + id,
        method: "PUT",
        tableName: "#tblresultHocKy",
        modalName: "#updateModalHocKy"
    }
    e.preventDefault();
    let form = $('#frmPutHocKy').serializeArray();
    sendData(option, form)
});
$('#frmPutKhoi').submit((e) => {
    var id = $('#u_id').val();
    let option = {
        uri: 'khoi/update/' + id,
        method: "PUT",
        tableName: "#tblresultKhoi",
        modalName: "#updateModalKhoi"
    }
    e.preventDefault();
    let form = $('#frmPutKhoi').serializeArray();
    sendData(option, form)
});
//---- remove 
$("#tblresult").on("click", ".btnDelete", function () {
    var obj = $('#tblresult').DataTable().row($(this).parents('tr')).data();
    $("#r_id").val(obj._id);
    $('#deletemodal h4').html("Xoá môn học");
    let q = "Bạn có chắc chắn muốn môn học <b>" + obj.TenMonHoc + " " + "</b> không?";
    $("#btnSubmitDetail").html("Xóa")
    $('#deletemodal h5').html(q);
    $("#deletemodal").modal('show');
});

$('#frmDelete').submit((e) => {
    e.preventDefault();
    $("#btnSubmitConfirm").attr("disabled", true);
    var id = $('#r_id').val();
    $.ajax({
        url: "/api/v1/mon-hoc/delete/" + id,
        method: "delete",
    })
        .done((data) => {
            if (data.status) {
                $('#tblresult').DataTable().ajax.reload();
                $("#deletemodal").modal('hide');
                toastr["success"](data.msg);
            }
            else {
                toastr["error"]("Xảy ra lỗi: " + data.msg);
            }
        })
        .fail(() => {
            $("#deletemodal").modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
    $("#btnSubmitConfirm").removeAttr("disabled");
});

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}