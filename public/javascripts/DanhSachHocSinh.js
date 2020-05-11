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
        {
            "className": "text-center",
            "render": (data, type, row) => {
                return data == 1 ? '<i class="fa fa-toggle-on" title="Đã được thêm vào lớp" style="color:green"></i>' : '<i class="fa fa-toggle-off" title="Chưa được thêm vào lớp nào"></i>'
            },
            "orderable": false,
            "width": "50px",
            "targets": 13
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
        { "data": 'isClass' },
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

//================================================Select2 setting=================================================================

$('#btnFind').on('click', () => {
    if ($('#Khoi_idFilter').val() && $('#NamHoc_idFilter').val() && $('#LopHoc_idFilter').val()) {
        $('#tblresult').DataTable().ajax.reload();
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