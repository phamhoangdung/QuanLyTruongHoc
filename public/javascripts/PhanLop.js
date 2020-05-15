//Bootstrap Duallistbox
$('.duallistbox').bootstrapDualListbox({
    filterTextClear: 'Hiện thị tất cả',
    infoText: 'Hiện thị tất cả của {0} bản ghi',
    filterPlaceHolder: 'Tìm kiếm ...',
    moveSelectedLabel: 'Move selected',
    moveAllLabel: 'Chọn tất cả',
    removeSelectedLabel: 'Remove selected',
    removeAllLabel: 'Bỏ chọn tất cả',
    selectorMinimalHeight: 300
})
var table = $('#tblresult').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/phan-lop/get",
        "type": "POST",
        "dataType": "json",
        // 'beforeSend': function (request) {
        //     request.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        // },
        "data": function (d) {
            Object.assign(d, {
                "NamHoc_id": $('#NamHoc_idFilter').val(),
                "Khoi_id": $('#Khoi_idFilter').val(),
                "LopHoc_id": $('#LopHoc_idFilter').val()
            });
            return d;
        },
        "cache": true,
        "dataSrc": function (json) {
            if (json.status) {
                json.data.forEach(element => {
                    let date = new Date(element.NgaySinh)
                    element.NgaySinh = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
                });
                return json.data;
            } else {
                toastr["error"]("Xảy ra lỗi: " + json.msg);
                toastr["info"]('Chọn nút "Tạo DS" để tạo !');
                return [];
            }
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": [1, 8, 9, 11] },
        {
            "className": "text-center",
            "width": "50px",
            "orderable": false,
            "targets": 0
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
        { "data": 'GioiTinh' },
        { "data": 'NgaySinh' },
        { "data": 'DiaChi' },
        { "data": 'QueQuan' },
        { "data": 'AnhDaiDien' },
        { "data": 'DanToc_id._id' },
        { "data": 'DanToc_id.TenDanToc' },
        { "data": 'TonGiao_id._id' },
        { "data": 'TonGiao_id.TenTonGiao' },
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});
var tableCreate = $('#tblresultCreate').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/phan-lop/get",
        "type": "POST",
        "dataType": "json",
        // 'beforeSend': function (request) {
        //     request.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        // },
        "cache": true,
        "data": function (d) {
            Object.assign(d, {
                "create": true
            });
            return d;
        },
        "dataSrc": function (json) {
            if (json.status) {
                json.data.forEach(element => {
                    let date = new Date(element.NgaySinh)
                    element.NgaySinh = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
                });
                return json.data;
            } else {
                toastr["error"]("Xảy ra lỗi: " + json.msg);
                return [];
            }
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": [1, 8, 9, 11] },
        // {
        //     "className": "text-center",
        //     "width": "50px",
        //     "orderable": false,
        //     "targets": 0
        // },
        {
            'orderable': false,
            "className": "text-center",
            'render': function (data, type, full, meta) {
                return '<input type="checkbox" name="_id" value="' + $('<div/>').text(data._id).html() + '">';
            },
            'targets': 0,
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
        { "data": 'GioiTinh' },
        { "data": 'NgaySinh' },
        { "data": 'DiaChi' },
        { "data": 'QueQuan' },
        { "data": 'AnhDaiDien' },
        { "data": 'DanToc_id._id' },
        { "data": 'DanToc_id.TenDanToc' },
        { "data": 'TonGiao_id._id' },
        { "data": 'TonGiao_id.TenTonGiao' },
    ],
    bAutoWidth: false,
    'order': [[1, 'asc']]
    // fnRowCallback: (nRow, aData, iDisplayIndex) => {
    //     $("td:first", nRow).html(iDisplayIndex + 1);
    //     return nRow;
    // },
});

var tableUpdate = $('#tblresultUpdate').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "cache": "false",
        "url": "/api/v1/phan-lop/get",
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
                "update": true
            });
            return d;
        },
        "dataSrc": function (json) {
            if (json.status) {
                json.data.forEach(element => {
                    let date = new Date(element.NgaySinh)
                    element.NgaySinh = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
                });
                return json.data;
            } else {
                toastr["error"]("Xảy ra lỗi: " + json.msg);
                return [];
            }
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": [1, 8, 9, 11] },
        // {
        //     "className": "text-center",
        //     "width": "50px",
        //     "orderable": false,
        //     "targets": 0
        // },
        {
            'orderable': false,
            "className": "text-center",
            'render': function (data, type, full, meta) {
                if (data.isClass) {
                    return '<input type="checkbox" checked name="_id" value="' + $('<div/>').text(data._id).html() + '">';
                } else {
                    return '<input type="checkbox" name="_id" value="' + $('<div/>').text(data._id).html() + '">';
                }
            },
            'targets': 0,
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
        { "data": 'GioiTinh' },
        { "data": 'NgaySinh' },
        { "data": 'DiaChi' },
        { "data": 'QueQuan' },
        { "data": 'AnhDaiDien' },
        { "data": 'DanToc_id._id' },
        { "data": 'DanToc_id.TenDanToc' },
        { "data": 'TonGiao_id._id' },
        { "data": 'TonGiao_id.TenTonGiao' },
    ],
    bAutoWidth: false,
    'order': [[1, 'asc']]
    // fnRowCallback: (nRow, aData, iDisplayIndex) => {
    //     $("td:first", nRow).html(iDisplayIndex + 1);
    //     return nRow;
    // },
});

// ==============================================================================================================//

$('#select-all-create').on('click', function () {
    // Get all rows with search applied
    var rows = tableCreate.rows({ 'search': 'applied' }).nodes();
    // Check/uncheck checkboxes for all rows in the table
    $('input[type="checkbox"]', rows).prop('checked', this.checked);
});
// Handle click on checkbox to set state of "Select all" control
$('#tblresultCreate tbody').on('change', 'input[type="checkbox"]', function () {
    // If checkbox is not checked
    if (!this.checked) {
        var el = $('.select-all').get(0);
        // If "Select all" control is checked and has 'indeterminate' property
        if (el && el.checked && ('indeterminate' in el)) {
            // Set visual state of "Select all" control
            // as 'indeterminate'
            el.indeterminate = true;
        }
    }
});
$('#tblresultUpdate tbody').on('change', 'input[type="checkbox"]', function () {
    // If checkbox is not checked
    if (!this.checked) {
        var el = $('#select-all-update').get(0);
        // If "Select all" control is checked and has 'indeterminate' property
        if (el && el.checked && ('indeterminate' in el)) {
            // Set visual state of "Select all" control
            // as 'indeterminate'
            el.indeterminate = true;
        }
    }
});
$('#btnSync').on("click", () => {
    $("#NamHoc_idFilter").empty();
    $("#LopHoc_idFilter").empty();
    $("#Khoi_idFilter").empty();
    table.ajax.reload();
})
// insert

$("#btnAdd").click(function () {
    if ($('#Khoi_idFilter').val() && $('#NamHoc_idFilter').val() && $('#LopHoc_idFilter').val()) {
        $("#createModal").modal('show');
    } else {
        toastr["warning"]("Khối, năm học, lớp học chưa được chọn !");
    }
});
$("#btnUpdate").click(function () {
    if ($('#Khoi_idFilter').val() && $('#NamHoc_idFilter').val() && $('#LopHoc_idFilter').val()) {
        tableUpdate.ajax.reload();
        $('#select-all-update').on('click', function () {
            var rows = $('#tblresultUpdate').DataTable().rows({ 'search': 'applied' }).nodes();
            $('input[type="checkbox"]', rows).prop('checked', this.checked);
        });
        $("#updateModal").modal('show');
    } else {
        toastr["warning"]("Khối, năm học, lớp học chưa được chọn !");
    }
});

function sendData(options, form) {
    $.ajax({
        url: options.uri,
        method: options.method,
        data: JSON.stringify(form),
        contentType: 'application/json'
    })
        .done((data) => {
            if (data.status) {
                $('#tblresult').DataTable().ajax.reload();
                //$('#tblresultCreate').DataTable().ajax.reload();
                $(options.modal).modal('hide');
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
            $(options.modal).modal('hide');
            toastr["error"]("Xảy ra lỗi, vui lòng tải lại trang!");
        });
    $("#btnSubmitConfirm").removeAttr("disabled");
}
//============================================Create form submit==========================================================
$('#frmPost').submit((e) => {
    e.preventDefault();
    var form = this;

    // // Encode a set of form elements from all pages as an array of names and values
    // var params = table.$('input,select,textarea').serializeArray();

    // // Iterate over all form elements
    // $.each(params, function () {
    //     // If element doesn't exist in DOM
    //     if (!$.contains(document, form[this.name])) {
    //         // Create a hidden element
    //         $(form).append(
    //             $('<input>')
    //                 .attr('type', 'hidden')
    //                 .attr('name', this.name)
    //                 .val(this.value)
    //         );
    //     }
    // });
    tableCreate.$('input[type="checkbox"]').each(function () {
        // If checkbox doesn't exist in DOM
        if (!$.contains(document, this)) {
            // If checkbox is checked
            if (this.checked) {
                // Create a hidden element
                $(form).append(
                    $('<input>')
                        .attr('type', 'hidden')
                        .attr('name', this.name)
                        .val(this.value)
                );
            }
        }
    })
    let stoctData = $('#frmPost').serializeArray();
    let HocSinhs = [];
    stoctData.map((e, i) => {
        if (e.name == "_id") {
            HocSinhs.push(e.value);
        }
    })
    var options = {
        uri: "/api/v1/phan-lop/create",
        method: "POST",
        modal: "#createModal"
    }
    sendData(options, {
        "NamHoc_id": $('#NamHoc_idFilter').val(),
        "Khoi_id": $('#Khoi_idFilter').val(),
        "LopHoc_id": $('#LopHoc_idFilter').val(),
        "HocSinhs": HocSinhs
    });
});

//============================================Update form submit==========================================================
$('#frmPut').submit((e) => {
    e.preventDefault();
    var form = this;
    tableUpdate.$('input[type="checkbox"]').each(function () {
        // If checkbox doesn't exist in DOM
        if (!$.contains(document, this)) {
            // If checkbox is checked
            if (this.checked) {
                // Create a hidden element
                $(form).append(
                    $('<input>')
                        .attr('type', 'hidden')
                        .attr('name', this.name)
                        .val(this.value)
                );
            }
        }
    })
    let stoctData = $('#frmPut').serializeArray();
    let HocSinhs = [];
    stoctData.map((e, i) => {
        if (e.name == "_id") {
            HocSinhs.push(e.value);
        }
    })
    var options = {
        uri: "/api/v1/phan-lop/update",
        method: "PUT",
        modal: "#updateModal"
    }
    sendData(options, {
        "NamHoc_id": $('#NamHoc_idFilter').val(),
        "Khoi_id": $('#Khoi_idFilter').val(),
        "LopHoc_id": $('#LopHoc_idFilter').val(),
        "HocSinhs": HocSinhs
    });
});

//============================================Delete form submit==========================================================
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

//================================================Select2 setting=================================================================
$('#btnFind').on('click', () => {
    if ($('#Khoi_idFilter').val() && $('#NamHoc_idFilter').val() && $('#LopHoc_idFilter').val()) {
        $('#tblresult').DataTable().ajax.reload();
        console.log($('#LopHoc_idFilter option:selected').text());
        
        $('#headertext').text("Danh sách học sinh " + $('#LopHoc_idFilter option:selected').text())
        //table.clear().draw();
        //table.rows.add(NewlyCreatedData); // Add new data
        //table.columns.adjust().draw();

    }
})

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
//==========================================================export excel==========================================================

$('#btnExcel').on('click', () => {
    if ($('#Khoi_idFilter').val() && $('#NamHoc_idFilter').val() && $('#LopHoc_idFilter').val()) {
        window.open("/api/v1/phan-lop/export-excel?Khoi_id=" + $('#Khoi_idFilter').val() + "&NamHoc_id=" + $('#NamHoc_idFilter').val() + "&LopHoc_id=" + $('#LopHoc_idFilter').val());
    } else {
        toastr["warning"]("Khối, năm học, lớp học chưa được chọn !");
    }
})

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