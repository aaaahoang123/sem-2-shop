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

$('.btn.btn-outline-primary.waves-effect').click(function () {
    var category = $("input:checked[name='category']").val();
    var brand = $("input:checked[name='brand']").val();
    var minValue = $( "#slider-range" ).slider("values", 0);
    var maxValue = $( "#slider-range" ).slider("values", 1);
    var sort = '';
     if($('input:checkbox[name="sort"]:checked').val() === "priceUp") sort = 'price_1';
     if($('input:checkbox[name="sort"]:checked').val() === "priceDown") sort = 'price_-1';

     changeSearchByInput(category, brand, minValue, maxValue, sort);
});

var searchArray = location.search.replace('?', '').split('&');

function changeSearchByInput(category, brand, minValue, maxValue, sort) {
    var search = '';
    for(s of searchArray){
        if(s.includes('q=')){
            search += s + '&';
        }
    }
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