var table = $('#tblresult').DataTable({
    "processing": true,
    "serverSide": true,
    "pageLength": 50,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/phan-mon/get",
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
                "HocKy_id": $('#HocKy_idFilter').val(),
            });
            return d;
        },
        "dataSrc": function (json) {
            if (json.data.length > 0) {

                json.data.forEach(element => {
                    console.log(element.GiaoVien_id);
                    element.GiaoVien_id = element.GiaoVien_id == undefined ? { _id: "", TenGiaoVien: `<p style="color: cadetblue;">Chưa được phân công</p>` } : element.GiaoVien_id
                    element.Method = `<a class=" my-method-button btnEdit fa-hover"    title="Gán giáo viên" ><i class="fa fa-edit"></i></a>`;
                });
            }


            return json.data;
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": [1, 3, 6] },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": [0, 5]
        },
        {
            // "className": "text-center",
            "width": "20%",
            "orderable": false,
            "targets": 2
        },
        // {
        //     "className": "text-center",
        //     "width": "60px",
        //     "orderable": false,
        //     "targets": 6
        // }
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
        { "data": 'MonHoc_id._id' },
        { "data": 'MonHoc_id.TenMonHoc' },
        { "data": 'GiaoVien_id._id' },
        { "data": 'GiaoVien_id.TenGiaoVien' },
        { "data": 'Method' },
        { "data": '_id' }
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});
$('#btnFind').on('click', () => {
    if ($('#Khoi_idFilter').val() && $('#NamHoc_idFilter').val() && $('#LopHoc_idFilter').val()) {
        $('#tblresult').DataTable().ajax.reload();
    }
})
// insert

$("#btnAdd").click(function () {
    $('#c_TenMonHoc').val(null);
    $('#c_SoTiet').val(null);
    $('#c_Khoi_id').empty();
    $("#editmodal").modal('show');
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
    if (obj.Khoi_id) {
        var $KhoiOption = $("<option selected='selected'></option>").val(obj.Khoi_id._id).text(obj.Khoi_id.TenKhoi);
        $(".Khoi_id").empty().append($KhoiOption).trigger('change');
    }
    $('#u_id').val(obj._id);
    $('#u_TenMonHoc').val(obj.TenMonHoc);
    $('#u_SoTiet').val(obj.SoTiet);
    $("#updatemodal").modal('show');
});

// update
$('#frmPut').submit((e) => {
    var id = $('#u_id').val();
    e.preventDefault();
    let form = $('#frmPut').serializeArray();
    $.ajax({
        url: "/api/v1/mon-hoc/update/" + id,
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
//================================================================================================

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
}
$('#LopHoc_idFilter').prop("disabled", true);
$('#Khoi_idFilter').on("select2:close", (e) => {
    selectdis();
});
$('#NamHoc_idFilter').on("select2:close", (e) => {
    selectdis();
});
$('#Khoi_idFilter').on("change", (e) => {
    selectdis();
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