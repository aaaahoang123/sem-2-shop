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