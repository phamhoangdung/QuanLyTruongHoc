var table = $('#tblresult').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/quan-ly-tai-khoan/get",
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
        // { "visible": false, "targets": [1,4]},
        // {
        //     "className": "text-center",
        //     "width": "50px",
        //     "orderable": false,
        //     "targets": 0
        // },
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
        { "data": '_id' },
        { "data": 'email' },
        { "data": 'password' },
        { "data": 'role' },
        { "data": 'AnhDaiDien' },
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
    $('#c_email').val(null);
    $('#c_password').val(null);
    $('#c_role').val(null);
    $('#c_AnhDaiDien').val(null);
    $("#editmodal").modal('show');
});
//---form upload image
$('#formPostUpload').submit((e) => {
    e.preventDefault();
    let formipload = $('#formPostUpload')[0];
    var data = new FormData(formipload);
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "uploadSingle",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000
    }).done((data) => {
        console.log(data);
        $('#c_AnhDaiDien').val(data.path);
        if (data.status) {
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
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
})
$('#formPutUpload').submit((e) => {
    e.preventDefault();
    let formipload = $('#formPutUpload')[0];
    var data = new FormData(formipload);
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "uploadSingle",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000
    }).done((data) => {
        console.log(data);
        $('#u_AnhDaiDien').val(data.path);
        if (data.status) {
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
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
})

$('#frmPost').submit((e) => {
    e.preventDefault();
    let form = $('#frmPost').serializeArray();
    $.ajax({
        url: "/api/v1/quan-ly-tai-khoan/create",
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
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.blah').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}
$(".imgInp").change(function () {
    readURL(this);
});
$("#tblresult").on("click", ".btnEdit", function () {
    var obj = $('#tblresult').DataTable().row($(this).parents('tr')).data();
    $('#u_id').val(obj._id);
    $('#u_email').val(obj.email);
    $('#u_password').val(obj.password);
    $('#u_role').val(obj.role);
    $('#u_AnhDaiDien').val(obj.AnhDaiDien);
    $('.blah').attr('src', obj.AnhDaiDien.replace(/\\/g,'/'));
    $("#updatemodal").modal('show');
});

// update
$('#frmPut').submit((e) => {
    var id = $('#u_id').val();
    e.preventDefault();
    let form = $('#frmPut').serializeArray();
    $.ajax({
        url: "/api/v1/quan-ly-tai-khoan/update/" + id,
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