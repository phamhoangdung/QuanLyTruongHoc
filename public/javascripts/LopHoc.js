var table = $('#tblresult').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/lop-hoc/get",
        "type": "POST",
        "dataType": "json",
        // 'beforeSend': function (request) {
        //     request.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        // },
        "cache": true,
        "dataSrc": function (json) {
            json.data.forEach(element => {
                element.Method = `<a class=" my-method-button btnEdit fa-hover"    title="Sửa tài khoản" ><i class="fa fa-edit"></i></a> &nbsp
                                <a class=" my-method-button btnDelete fa-hover"    title="Xóa tài khoản" ><i class="fa fa-trash"></i></a>`;
            });
console.log(json);

            return json.data;
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": [1,4,6,8] },
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
            "targets": 11
        },
        {
            "className": "text-center",
            "render": (data, type, row) => {
                return data == 1 ? '<i class="fa fa-toggle-on" title="Hoạt động" style="color:green"></i>' : '<i class="fa fa-toggle-off" title="Không hoạt động"></i>'
            },
            "orderable": false,
            "width": "50px",
            "targets": 10
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
        { "data": 'TenLopHoc' },
        { "data": 'SiSo' },
        { "data": 'Khoi_id._id' },
        { "data": 'Khoi_id.TenKhoi' },
        { "data": 'NamHoc_id._id' },
        { "data": 'NamHoc_id.TenNamHoc' },
        { "data": 'GiaoVien_id._id' },
        { "data": 'GiaoVien_id.TenGiaoVien' },
        { "data": 'status' },
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
    $('#TenLopHoc').val(null);
    $('#SiSo').val(null);
    $('.NamHoc_id').empty();
    $('.Khoi_id').empty();
    $('.GiaoVien_id').empty();
    $('#status').val(true);
    $("#createModal").modal('show');
});

function sendData(options, form) {

    $.ajax({
        url: options.uri,
        method: options.method,
        data: form,
        dataType: 'json'
    })
        .done((data) => {
            console.log(data);

            if (data.status) {
                $('#tblresult').DataTable().ajax.reload();
                $(options.modal).modal('hide');
                toastr["success"](data.msg);
            }
            else {
                data.msg.forEach((e, i) => {
                    toastr["error"]("Lỗi số " + (i + 1) + " :" + e.msg);
                })
            }
        })
        .fail(() => {
            $(options.modal).modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
    $("#btnSubmitConfirm").removeAttr("disabled");
}

$('#frmCreate').submit((e) => {
    e.preventDefault();
    let form = $('#frmCreate').serializeArray();
    var options = {
        uri: "/api/v1/lop-hoc/create",
        method: "POST",
        modal: "#createModal"
    }
    sendData(options, form);
});

$("#tblresult").on("click", ".btnEdit", function () {
    var obj = $('#tblresult').DataTable().row($(this).parents('tr')).data();
    $('#id').val(obj._id);
    $('#TenLopHoc').val(obj.TenLopHoc);
    $('#SiSo').val(obj.SiSo);
    $('#NamHoc_id').val(obj.NamHoc_id);
    var $KhoiOption = $("<option selected='selected'></option>").val(obj.Khoi_id._id).text(obj.Khoi_id.TenKhoi);
    var $NamHocOption = $("<option selected='selected'></option>").val(obj.NamHoc_id._id).text(obj.NamHoc_id.TenNamHoc);
    var $GiaoVienOption = $("<option selected='selected'></option>").val(obj.GiaoVien_id._id).text(obj.GiaoVien_id.TenGiaoVien);
    $(".Khoi_id").empty().append($KhoiOption).trigger('change');
    $(".GiaoVien_id").empty().append($GiaoVienOption).trigger('change');
    $(".NamHoc_id").empty().append($NamHocOption).trigger('change');
    $('#status').val(obj.status);
    $("#editModal").modal('show');
});

// update
$('#frmEdit').submit((e) => {
    var id = $('#id').val();
    let form = $('#frmEdit').serializeArray();
    e.preventDefault();
    var options = {
        uri: "/api/v1/lop-hoc/update/" + id,
        method: "PUT",
        modal: "#editModal"
    }
    sendData(options,form);
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
$(".Khoi_id").select2({
    tags: "true",
    width: 'resolve',
    placeholder: "Chọn khối ...",
    multiple: false,
    theme: 'bootstrap4',
    maximumSelectionSize: 1,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/khoi/select-khoi',
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
$(".NamHoc_id").select2({
    tags: "true",
    width: 'resolve',
    multiple: false,
    placeholder: "Chọn năm học ...",
    theme: 'bootstrap4',
    maximumSelectionSize: 1,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/nam-hoc/select-nam-hoc',
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
$(".GiaoVien_id").select2({
    tags: "true",
    width: 'resolve',
    placeholder: "Chọn giáo viên ...",
    theme: 'bootstrap4',
    multiple: false,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/giao-vien/select-giao-vien',
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