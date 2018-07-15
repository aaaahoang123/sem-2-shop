(function () {
    $('button.btn.btn-link.waves-effect[data-t="2"]').on('click', function (){showAjaxLoaderMessage('accept', this)});
    $('button.btn.btn-link.waves-effect[data-t="1"]').on('click', function (){showAjaxLoaderMessage('done', this)});
    $('button.btn.btn-link.waves-effect[data-t="-1"]').on('click', function (){showAjaxLoaderMessage('reject', this)});
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

