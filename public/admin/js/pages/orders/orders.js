(function () {
    $('button.btn.btn-link.waves-effect[data-t="2"]').on('click', function (){showAjaxLoaderMessage('accept', this)});
    $('button.btn.btn-link.waves-effect[data-t="1"]').on('click', function (){showAjaxLoaderMessage('done', this)});
    $('button.btn.btn-link.waves-effect[data-t="-1"]').on('click', function (){showAjaxLoaderMessage('reject', this)});
    $('#show-chart-btn').click(function () {
        var href = '/manager/dashboard?',
            ofrom = $('input.query-input.form-control[data-query="ofrom"]').val(),
            oto = $('input.query-input.form-control[data-query="oto"]').val();
        if (ofrom) href += 'ofrom=' + ofrom + '&';
        if (oto) href += 'oto=' + oto + '&';
        href = href.slice(0, href.length - 1);
        location.href = href;
    })
})();

function showAjaxLoaderMessage(type, el) {
    var _id = $(el).data('b');
    swal({
        title: "Do you want to " + type + " orders: " + _id,
        text: "Submit to " + type + " this orders",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function () {
        $.ajax({
            url: '/manager/orders/' + type + '/' + _id,
            type: 'PUT',
            success: function (res) {
                console.log(res);
                setTimeout(function () {
                    swal({title: "Successfully!"}, function () {
                        location.reload();
                    });
                }, 1000);
            },
            error: function (res) {
                console.log(res);
                setTimeout(function () {
                    swal("Fail. Please check log!");
                }, 1000);
            }
        })
    });
}

$('#search-btn').click(function () {

    var search = '';
    $('input.query-input, select.query-input').get().forEach(function (el) {
        console.log(el, $(el).data('query'), $(el).val());
       if($(el).val() !== '' && $(el).val() !== null && $(el).val() !== undefined) {
          search += ($(el).data('query') + '=' +$(el).val() + '&');
       }
    });

    if(search !== '') location.search = search.slice(0, search.length-1);
    else location.search = '';
});

var searchArray = location.search.replace('?', '').split('&');
function paginate(el) {
    var newSearch = '';
    for(s of searchArray){
        if(!s.includes('cpage=')){
            newSearch += s + '&';
        }
    }
    newSearch += 'cpage=' + $(el).attr('data-page');
    location.search = newSearch;
}

$('.paginate_button:not(.disabled) > a').click(function () {
   paginate(this);
});

var district = $('#select-district').attr('data-district');
var city = $('#select-district').attr('data-city');
if(district !== '' || city !== ''){
    $.ajax({
        url: '/api/districts?cid=' + city,
        method: 'GET',
        success: function (res) {
            var s = $('#select-district');
            s.html('');
            s.append($('<option>').val('').text('--District Choose--'));
            res.forEach(function (d) {
                var selected = (d.ID.toString()=== district);
                s.append($('<option>').attr('selected', (d.ID.toString()===district)).val(d.ID).text(d.Title))
            });
            s.removeAttr('disabled');
            s.selectpicker('refresh');
        },
        error: function (err) {
            console.log(err);
        }
    });
}


