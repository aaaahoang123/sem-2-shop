
$('#btn-clear').on('click', function () {
    $('.select-clear select').val('default');
    $('.select-clear select').selectpicker('refresh');
});

$('#btn-reset').on('click', function () {
    location.reload();
});