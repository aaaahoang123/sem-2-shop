// the selector will match all input controls of type :checkbox
// and attach a click event handler
$("input:checkbox").on('click', function() {
    // in the handler, 'this' refers to the box clicked on
    var $box = $(this);
    if ($box.is(":checked")) {
        // the name of the box is retrieved using the .attr() method
        // as it is assumed and expected to be immutable
        var group = "input:checkbox[name='" + $box.attr("name") + "']";
        // the checked state of the group/box on the other hand will change
        // and the current value is retrieved using .prop() method
        $(group).prop("checked", false);
        $box.prop("checked", true);
    } else {
        $box.prop("checked", false);
    }
});


$('.product_code').on('click', function () {
    var code = [];
    var codeArr = JSON.parse(Cookies.get('code'));
    for (let i=0; i<codeArr.length && i<9; i++){
        if (codeArr[i] !== $(this).attr("name")) code.push(codeArr[i])
    }
    code.unshift($(this).attr("name"));
    Cookies.set('code', code, { expires: 3});
    //console.log(Cookies.get('code'));  con o day la js tren trinh duyet lay ra cookie dc luu thoi
});

$('.btn.btn-outline-primary.waves-effect').click(function () {
    var category = $("input:checked[name='category']").val();
    var brand = $("input:checked[name='brand']").val();
    var minValue = $( "#slider-range" ).slider("values", 0);
    var maxValue = $( "#slider-range" ).slider("values", 1);
    var sort = '';
    if($('.sorting_text').text() === "priceUp") sort = 'price_1';
    if($('.sorting_text').text() === "priceDown") sort = 'price_-1';

     changeSearchByInput(category, brand, minValue, maxValue, sort);
});

function changeSearchByInput(category, brand, minValue, maxValue, sort) {
    var search = '';
    if (category !== undefined) {
        search += 'category=' + category.replace("&","%26") + '&'
    }
    if (brand !== undefined) {
        search += 'brand=' + brand + '&'
    }
    if (minValue !== 0) {
        search += 'min=' + minValue + '&'
    }
    if (maxValue !== parseInt($('meta[name="max-price"]').attr("content"))) {
        search += 'max=' + maxValue + '&'
    }
    if (sort !== '') {
        search += 'sort=' + sort + '&'
    }
    location.search = (search === '')?'':search.slice(0, -1)
};

// $('.price_up').click(function () {
//     var s = location.search.split('?');
//     if (s.includes('?')) s = s[1] + '&price=1';
//     s = '?price=1';
//     location.search += s;
// });
//
// $('.price_down').click(function () {
//     var s = location.search.split('?');
//     if (s.includes('?')) s = s[1] + '&price=-1';
//     s = '?price=-1';
//     location.search += s;
// });