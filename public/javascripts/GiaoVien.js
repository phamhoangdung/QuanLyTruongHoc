var table = $('#tblresult').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/giao-vien/get",
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
        { "visible": false, "targets": [1,8,9,11,13] },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": 0
        },
        {
            "className": "text-center",
            "width": "60px",
            "orderable": false,
            "targets": 15
        },
        {
            "className": "text-center",
            "render": (data, type, row) => {
                return data == 1 ? 'Nam' : 'Nữ'
            },
            "orderable": false,
            "width": "60px",
            "targets": 4
        },
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
        { "data": 'Ho' },
        { "data": 'Ten' },
        { "data": 'GioTinh' },
        { "data": 'DiaChi' },
        { "data": 'DienThoai' },
        { "data": 'Email' },
        { "data": 'AnhDaiDien' },
        { "data": 'MonHoc_id._id' },
        { "data": 'MonHoc_id.TenMonHoc' },
        { "data": 'DanToc_id._id' },
        { "data": 'DanToc_id.TenDanToc' },
        { "data": 'TonGiao_id._id' },
        { "data": 'TonGiao_id.TenTonGiao' },
        { "data": 'Method' }
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});

// insert

$("#btnAdd").click(function () {
    $('#c_id').val(null);
    $('#c_Ho').val(null);
    $('#c_Ten').val(null);
    $('#c_DiaChi').val(null);
    $('#c_DienThoai').val(null);
    $('#c_Email').val(null);
    $(".MonHoc_id").empty();
    $(".DanToc_id").empty();
    $(".TonGiao_id").empty();
    $("#editmodal").modal('show');
});


$('#frmPost').submit((e) => {
    e.preventDefault();
    let form = $('#frmPost').serializeArray();
    $.ajax({
        url: "/api/v1/giao-vien/create",
        method: "POST",
        data: form,
        dataType: 'json'
    })
        .done((data) => {
            if (data.status) {
                $('#tblresult').DataTable().ajax.reload();
                $("#editmodal").modal('hide');
                toastr["success"](data.msg);
            }
            else {
                if (Array.isArray(data.msg)) {
                    data.msg.forEach((e, i) => {
                        toastr["error"]("Lỗi số " + (i + 1) + " :" + e.msg);
                    })
                } else {
                    toastr["warning"](data.msg);
                }
            }
        })
        .fail(() => {
            $("#editmodal").modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
    $("#btnSubmitConfirm").removeAttr("disabled");
});

$("#tblresult").on("click", ".btnEdit", function () {
    var obj = $('#tblresult').DataTable().row($(this).parents('tr')).data();
    $('#u_id').val(obj._id);
    $('#u_Ho').val(obj.Ho);
    $('#u_Ten').val(obj.Ten);
    $('#u_GioTinh').val(obj.GioTinh);
    obj.GioTinh == 1 ? $('#u_Nam').prop("checked", true) : $('#u_Nu').prop("checked", true)
    $('#u_DiaChi').val(obj.DiaChi);
    $('#u_DienThoai').val(obj.DienThoai);
    $('#u_Email').val(obj.Email);
    if(obj.MonHoc_id && obj.DanToc_id &&obj.TonGiao_id)
    {
        var $Option1 = $("<option selected='selected'></option>").val(obj.MonHoc_id._id).text(obj.MonHoc_id.TenMonHoc);
        var $Option2 = $("<option selected='selected'></option>").val(obj.DanToc_id._id).text(obj.DanToc_id.TenDanToc);
        var $Option3 = $("<option selected='selected'></option>").val(obj.TonGiao_id._id).text(obj.TonGiao_id.TenTonGiao);
        $(".MonHoc_id").empty().append($Option1).trigger('change');
        $(".DanToc_id").empty().append($Option2).trigger('change');
        $(".TonGiao_id").empty().append($Option3).trigger('change');
    }
    $("#updatemodal").modal('show');
});

// update
$('#frmPut').submit((e) => {
    var id = $('#u_id').val();
    e.preventDefault();
    let form = $('#frmPut').serializeArray();
    $.ajax({
        url: "/api/v1/giao-vien/update/" + id,
        method: "PUT",
        data: form,
        dataType: 'json'
    })
        .done((data) => {
            if (data.status) {
                $('#tblresult').DataTable().ajax.reload();
                $("#updatemodal").modal('hide');
                toastr["success"](data.msg);
            }
            else {
                if (Array.isArray(data.msg)) {
                    data.msg.forEach((e, i) => {
                        toastr["error"]("Lỗi số " + (i + 1) + " :" + e.msg);
                    })
                } else {
                    toastr["warning"](data.msg);
                }
            }
        })
        .fail(() => {
            $("#updatemodal").modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
    $("#btnSubmitUpdate").removeAttr("disabled");
});

//---- remove 
$("#tblresult").on("click", ".btnDelete", function () {
    var obj = $('#tblresult').DataTable().row($(this).parents('tr')).data();
    $("#r_id").val(obj._id);
    $('#deletemodal h4').html("Xoá giao viên");
    let q = "Bạn có chắc chắn muốn xoá <b>" + obj.Ho + " " + obj.Ten + " " + "</b> không?";
    $("#btnSubmitDetail").html("Xóa")
    $('#deletemodal h5').html(q);
    $("#deletemodal").modal('show');
});

$('#frmDelete').submit((e) => {
    e.preventDefault();
    $("#btnSubmitConfirm").attr("disabled", true);
    var id = $('#r_id').val();
    $.ajax({
        url: "/api/v1/giao-vien/delete/" + id,
        method: "delete",
    })
        .done((data) => {
            if (data.status) {
                $('#tblresult').DataTable().ajax.reload();
                $("#deletemodal").modal('hide');
                toastr["success"](data.msg);
            }
            else {
                if (Array.isArray(data.msg)) {
                    data.msg.forEach((e, i) => {
                        toastr["error"]("Lỗi số " + (i + 1) + " :" + e.msg);
                    })
                } else {
                    toastr["warning"](data.msg);
                }
            }
        })
        .fail(() => {
            $("#deletemodal").modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
    $("#btnSubmitConfirm").removeAttr("disabled");
});
$(".MonHoc_id").select2({
    tags: "true",
    width: 'resolve',
    placeholder: "Chọn môn học ...",
    multiple: false,
    theme: 'bootstrap4',
    maximumSelectionSize: 1,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/mon-hoc/select-mon-hoc',
        dataType: 'json',
        data: function (params) {
            var query = {
                search: params.term,
            }
            // Query parameters will be ?search=[term]&type=public
            return query;
        },
        processResults: function (results) {
            // Transforms the top-level key of the response object from 'items' to 'results'
            return {
                results: results
            };
        }
    }
});
$(".DanToc_id").select2({
    tags: "true",
    width: 'resolve',
    multiple: false,
    placeholder: "Chọn dân tộc ...",
    theme: 'bootstrap4',
    maximumSelectionSize: 1,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/dan-toc/select-dan-toc',
        dataType: 'json',
        data: function (params) {
            var query = {
                search: params.term,
            }
            // Query parameters will be ?search=[term]&type=public
            return query;
        },
        processResults: function (results) {
            // Transforms the top-level key of the response object from 'items' to 'results'
            return {
                results: results
            };
        }
    }
});
$(".TonGiao_id").select2({
    tags: "true",
    width: 'resolve',
    placeholder: "Chọn tôn giáo ...",
    theme: 'bootstrap4',
    multiple: false,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/ton-giao/select-ton-giao',
        dataType: 'json',
        data: function (params) {
            var query = {
                search: params.term,
            }
            // Query parameters will be ?search=[term]&type=public
            return query;
        },
        processResults: function (results) {
            // Transforms the top-level key of the response object from 'items' to 'results'
            return {
                results: results
            };
        }
    },
});
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
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