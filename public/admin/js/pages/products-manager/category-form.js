$( document ).ready(function() {
    $(".dropdown .dropdown-menu li a").click();
    console.log($('#level-selector').val())
});
$('#level-selector').change(function () {
    location.href = '/manager/dashboard/products-manager/categories/create?lv=' + $(this).val();
});
$('#parent-selector').change(function () {
    var selected = JSON.parse($(this).find('option[value='+ $(this).val() +']').attr('data-category'));
    $('#childrenOfParent').html('');
    // for(var children in selected.children)
    $('.parent-name').text(selected.name);
    $('.parent-description').text(selected.description);
    $('#parent-table').removeClass('hidden');
    console.log(selected.children);
});
