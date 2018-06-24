$(document).ready(function () {
    $(".dropdown .dropdown-menu li a").click();

    $('#check-all').change(function () {
        $('.item-checkbox').prop('checked', $(this).prop('checked'))
    });

    $('.item-checkbox').change(function () {
        if (!$(this).prop('checked')) $('#check-all').prop('checked', false);
    });

    $('#select-limit').change(function () {
        changeSearchByInput(this, 'limit=')
    });

    $('#select-type').change(function () {
        changeSearchByInput(this, 'type=')
    });

    $('#search-btn').click(function () {
        changeSearchByInput('#input-search', 'q=')
    });

    $('#input-search').keyup(function (e) {
        if (e.keyCode === 13 || e.which === 13) {
            changeSearchByInput(this, 'q=')
        }
    })
});

function changeSearchByInput(el, except) {
    var searchArray = location.search.split('&');
    var href = '?';
    for (var i = 0; i < searchArray.length; i++) {
        if (!searchArray[i].includes('page=') && !searchArray[i].includes(except) && searchArray[i] !== "") {
            href += searchArray[i].replace("?", "") + '&';
        }
    }
    href += except + $(el).val();
    location.search = href;
}