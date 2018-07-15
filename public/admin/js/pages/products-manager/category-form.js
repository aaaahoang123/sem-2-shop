$(document).ready(function () {
    $(".dropdown .dropdown-menu li a").click();
    console.log($('#level-selector').val())
});
$('#level-selector').change(function () {
    location.href = '/manager/products-manager/categories/create?level=' + (Number($(this).val()));
});
$('#parent-selector').change(function () {
    $(this).find('option[value=""]').attr('disabled', true);
    $('#parent-selector').selectpicker('refresh');
    var selected = JSON.parse($(this).find('option[value=' + $(this).val() + ']').attr('data-category'));
    console.log(selected.children.length);
    $('#childrenOfParent').html('');
    if (selected.children.length !== 0) {
        for (var i = 0; i < selected.children.length; i++) {
            $('#childrenOfParent').append('<p>' + selected.children[i].name + '</p>');
        }
    }
    $('.parent-name').text(selected.name);
    $('.parent-description').text(selected.description);
    $('#parent-table').removeClass('hidden');
});

$('#category-form').on('submit', function (e) {
    var levelValue = $('#level-selector').val();
    var hasErr = false;
    if (levelValue === null || levelValue === '') {
        $('.level-err').text('Category level can not null');
        hasErr = true;
    }
    var parentValue;
    try {
        parentValue = $('#parent-selector').val();
    }
    catch (e) {
        parentValue = null;
    }
    if (parseInt(levelValue) !== 1 && (parentValue === null || parentValue === '')) {
        console.log(parentValue);
        $('.parent-err').text('Category parent can not null when level is 2 or 3');
        hasErr = true;
    }
    var nameValue = $('#inp-name').val();
    if (nameValue === null || nameValue === '') {
        $('.name-err').text('Category Name can not null');
        hasErr = true;
    }
    var descriptionValue = $('#inp-description').val();
    if (descriptionValue === null || descriptionValue === '') {
        $('.description-err').text('Category Description can not null');
        hasErr = true;
    }
    if (hasErr) {
        e.preventDefault();
    }
});
