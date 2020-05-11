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
            json.data.forEach(element => {
                let date = new Date(element.NgaySinh);
                element.NgaySinh = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
            });

            return json.data;
        },
    },

    "PaginationType": "bootstrap",
    "columnDefs": [
        { "visible": false, "targets": [1, 9, 10, 12, 14] },
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
            "targets": 5
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
        { "data": 'NgaySinh' },
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
    ],
    bAutoWidth: false,
    fnRowCallback: (nRow, aData, iDisplayIndex) => {
        $("td:first", nRow).html(iDisplayIndex + 1);
        return nRow;
    },
});
$('.NgaySinh').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' })

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