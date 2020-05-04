function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
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
            Object.assign(d, getUrlVars());
            return d;
        },
        "dataSrc": function (json) {
            if (json.status) {
                json.data.forEach(element => {
                    element.XepLoai = 0;
                });

                return json.data;
            } else {

                if (Array.isArray(json.msg)) {
                    json.msg.forEach((e, i) => {
                        toastr["error"]("Xảy ra lỗi: " + e.msg);
                    })
                }
                toastr["info"]('Không tìm thấy thông tin !');
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
            "render": (data, type, row) => {
                return data == -1 ? "" : data
            },
            "width": "50px",
            "orderable": false,
            "targets": [5,6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
        },
        {
            "className": "text-center",
            "render": (data, type, row) => {
                return data == -1 ? "" : data
            },
            "orderable": false,
            "targets": [16, 17]
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
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});