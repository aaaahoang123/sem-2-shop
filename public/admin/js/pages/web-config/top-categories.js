// var selectVal = [];
// $(document).ready(function () {
//     var selects = $('.select-clear select');
//     for(s of selects){
//         selectVal.push(s.value);
//     }
//     console.log(selectVal);
// });

$('#btn-clear').on('click', function () {
    $('.select-clear select').val('default');
    $('.select-clear select').selectpicker('refresh');
});

$('#btn-reset').on('click', function () {
    location.reload();
});