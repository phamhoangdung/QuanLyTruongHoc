var table = $('#tblresult').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/diem/get",
        "type": "POST",
        "dataType": "json",
        // 'beforeSend': function (request) {
        //     request.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        // },
        "cache": true,
        "data": function (d) {
            Object.assign(d, {
                "NamHoc_id": $('#NamHoc_idFilter').val(),
                "Khoi_id": $('#Khoi_idFilter').val(),
                "LopHoc_id": $('#LopHoc_idFilter').val(),
                "MonHoc_id": $('#MonHoc_idFilter').val(),
                "HocKy_id": $('#HocKy_idFilter').val(),
            });
            return d;
        },
        "dataSrc": function (json) {
            if (json.status) {
                json.data.forEach(element => {
                    element.Method = `<a class=" my-method-button btnEdit fa-hover"    title="Sửa tài khoản" ><i class="fa fa-edit"></i></a> &nbsp`;
                    element.XepLoai = 0;
                });

                return json.data;
            } else {

                if (Array.isArray(json.msg)) {
                    json.msg.forEach((e, i) => {
                        toastr["error"]("Xảy ra lỗi: " + e.msg);
                    })
                }
                toastr["info"]('Chọn nút "Tạo bảng điểm" để tạo !');
                return [];
            }

        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": [1, 2] },
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
            "targets": 20
        },
        {
            "className": "text-center",
            "render": (data, type, row) => {
                return data == -1 ? "" : data
            },
            "width": "50px",
            "orderable": false,
            "targets": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        },
        {
            "className": "text-center",
            "render": (data, type, row) => {
                return data == -1 ? "" : data
            },
            "orderable": false,
            "targets": [17, 18]
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
        { "data": 'HocSinh_id._id' },
        { "data": 'HocSinh_id.Ho' },
        { "data": 'HocSinh_id.Ten' },
        { "data": 'Diem_m01' },
        { "data": 'Diem_m02' },
        { "data": 'Diem_m03' },
        { "data": 'Diem_m04' },
        { "data": 'Diem_15p01' },
        { "data": 'Diem_15p02' },
        { "data": 'Diem_15p03' },
        { "data": 'Diem_15p04' },
        { "data": 'Diem_1t01' },
        { "data": 'Diem_1t02' },
        { "data": 'Diem_1t03' },
        { "data": 'Diem_1t04' },
        { "data": 'Diem_HK' },
        { "data": 'Diem_TBC' },
        { "data": 'XepLoai' },
        { "data": 'Method' }
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});

// insert
$('#btnFind').on('click', () => {
    if ($('#MonHoc_idFilter').val() && $('#Khoi_idFilter').val() && $('#NamHoc_idFilter').val() && $('#LopHoc_idFilter').val()) {
        $('#tblresult').DataTable().ajax.reload();
    }
})

$("#btnAdd").click(function () {
    let form = [
        { name: 'NamHoc_id', value: $('#NamHoc_idFilter').val() },
        { name: 'LopHoc_id', value: $('#LopHoc_idFilter').val() },
        { name: 'HocKy_id', value: $('#HocKy_idFilter').val() },
        { name: 'MonHoc_id', value: $('#MonHoc_idFilter').val() },
        { name: 'Khoi_id', value: $('#Khoi_idFilter').val() },
    ]
    $.ajax({
        url: "/api/v1/diem/create",
        method: "POST",
        data: form,
        dataType: 'json'
    })
        .done((data) => {
            if (data.status) {
                $('#tblresult').DataTable().ajax.reload();
                // $("#editmodal").modal('hide');
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
            // $("#editmodal").modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
});


$('#frmPost').submit((e) => {
    e.preventDefault();
    let form = $('#frmPost').serializeArray();
    $.ajax({
        url: "/api/v1/mon-hoc/create",
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
    $('#editModal h4').html(obj.HocSinh_id.Ho + " " + obj.HocSinh_id.Ten);
    $("#Diem_m01").val(obj.Diem_m01 == -1 ? "" : obj.Diem_m01);
    $("#Diem_m02").val(obj.Diem_m02 == -1 ? "" : obj.Diem_m02);
    $("#Diem_m03").val(obj.Diem_m03 == -1 ? "" : obj.Diem_m03);
    $("#Diem_m04").val(obj.Diem_m04 == -1 ? "" : obj.Diem_m04);
    $("#Diem_15p01").val(obj.Diem_15p01 == -1 ? "" : obj.Diem_15p01);
    $("#Diem_15p02").val(obj.Diem_15p02 == -1 ? "" : obj.Diem_15p02);
    $("#Diem_15p03").val(obj.Diem_15p03 == -1 ? "" : obj.Diem_15p03);
    $("#Diem_15p04").val(obj.Diem_15p04 == -1 ? "" : obj.Diem_15p04);
    $("#Diem_1t01").val(obj.Diem_1t01 == -1 ? "" : obj.Diem_1t01);
    $("#Diem_1t02").val(obj.Diem_1t02 == -1 ? "" : obj.Diem_1t02);
    $("#Diem_1t03").val(obj.Diem_1t03 == -1 ? "" : obj.Diem_1t03);
    $("#Diem_1t04").val(obj.Diem_1t04 == -1 ? "" : obj.Diem_1t04);
    $("#Diem_HK").val(obj.Diem_HK == -1 ? "" : obj.Diem_HK);
    $("#Diem_TBC").val(obj.Diem_TBC == -1 ? "" : obj.Diem_TBC);
    // if (obj.Khoi_id) {
    //     var $KhoiOption = $("<option selected='selected'></option>").val(obj.Khoi_id._id).text(obj.Khoi_id.TenKhoi);
    //     $(".Khoi_id").empty().append($KhoiOption).trigger('change');
    // }
    // $('#u_id').val(obj._id);
    // $('#u_TenMonHoc').val(obj.TenMonHoc);
    // $('#u_SoTiet').val(obj.SoTiet);
    $("#editModal").modal('show');
});

// update
$('#frmPut').submit((e) => {
    var id = $('#u_id').val();
    e.preventDefault();
    let form = $('#frmPut').serializeArray();
    $.ajax({
        url: "/api/v1/diem/update/" + id,
        method: "PUT",
        data: form,
        dataType: 'json'
    })
        .done((data) => {
            if (data.status) {
                $('#tblresult').DataTable().ajax.reload();
                $("#editModal").modal('hide');
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
            $("#editModal").modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
    $("#btnSubmitUpdate").removeAttr("disabled");
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
$(".LopHoc_id").select2({
    tags: "true",
    width: 'resolve',
    placeholder: "Chọn lớp học ...",
    theme: 'bootstrap4',
    multiple: false,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/lop-hoc/select-lop-hoc',
        dataType: 'json',
        data: function (params) {
            var query = {
                search: params.term,
                NamHoc_id: $('#NamHoc_idFilter').val(),
                Khoi_id: $('#Khoi_idFilter').val()
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
$(".MonHoc_id").select2({
    tags: "true",
    width: 'resolve',
    placeholder: "Chọn môn học ...",
    theme: 'bootstrap4',
    multiple: false,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/mon-hoc/select-mon-hoc',
        dataType: 'json',
        data: function (params) {
            var query = {
                search: params.term,
                // NamHoc_id: $('#NamHoc_idFilter').val(),
                Khoi_id: $('#Khoi_idFilter').val()
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
$(".HocKy_id").select2({
    tags: "true",
    width: 'resolve',
    placeholder: "Chọn học kỳ...",
    theme: 'bootstrap4',
    multiple: false,
    allowClear: true,
    delay: 250,
    ajax: {
        url: '/api/v1/hoc-ky/select-hoc-ky',
        dataType: 'json',
        data: function (params) {
            var query = {
                search: params.term,
                // NamHoc_id: $('#NamHoc_idFilter').val(),
                Khoi_id: $('#HocKy_idFilter').val()
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
function selectdis() {
    if ($('#Khoi_idFilter').val() && $('#NamHoc_idFilter').val()) {
        $('#LopHoc_idFilter').prop("disabled", false);
    } else {
        $('#LopHoc_idFilter').prop("disabled", true);
    }
    if ($('#Khoi_idFilter').val()) {
        $('#MonHoc_idFilter').prop("disabled", false);
    } else {
        $('#MonHoc_idFilter').prop("disabled", true);
    }
}
$('#MonHoc_idFilter').prop("disabled", true);
$('#LopHoc_idFilter').prop("disabled", true);
$('#Khoi_idFilter').on("select2:close", (e) => {
    selectdis();
});
$('#NamHoc_idFilter').on("select2:close", (e) => {
    selectdis();
});
$('#Khoi_idFilter').on("change", (e) => {
    selectdis();
    $('#MonHoc_idFilter').empty();
    $(".LopHoc_id").empty();
});
$('#NamHoc_idFilter').on("change", (e) => {
    selectdis();
    $(".LopHoc_id").empty();
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