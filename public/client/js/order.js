$('.city-select').change(function () {
    var id = $(this).val();
    $.ajax({
        url: '/api/districts?cid=' + id,
        type: 'GET',
        success: function (res) {
            $('.district-select').attr('disabled', false).html('').append(`<option selected disabled>-- Choose your district --</option>`);
            res.forEach(function (district) {
                $('.district-select').append(`<option value="${district.ID}">${district.Title}</option>`);
            })
        },
        error: function (res) {
            console.log(res)
        }
    })
});

$('.btn-re').click(function () {
    $('.district-select').attr('disabled', true);
});

$(document).ready(function () {
    if ($('.city-select.form-control').val()) {
        $.ajax({
            url: '/api/districts?cid=' + $('.city-select.form-control').val(),
            type: 'GET',
            success: function (res) {
                var dataSelected = parseInt($('.district-select.form-control').attr('data-selected'));
                $('.district-select').attr('disabled', false).html('').append(`<option selected disabled>-- Choose your district --</option>`);
                res.forEach(function (district) {
                    console.log(typeof  district.ID, district.ID, typeof dataSelected, dataSelected);
                    console.log(district.ID===parseInt(dataSelected));
                    $('.district-select').append(`<option value="${district.ID}" ${district.ID===dataSelected?'selected':''}>${district.Title}</option>`);
                })
            },
            error: function (res) {
                console.log(res)
            }
        })
    }
});