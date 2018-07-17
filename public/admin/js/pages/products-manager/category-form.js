$(document).ready(function () {
    $(".dropdown .dropdown-menu li a").click();
    // console.log($('#level-selector').val())

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

    if(location.search.includes('message=add-success')){
        showNotification("alert-success", "Add Category Successfully", "top", "center", "animated bounceIn", "animated bounceOut");
    }

    if(location.search.includes('message=edit-success')){
        showNotification("alert-success", "Edit Category Successfully", "top", "center", "animated bounceIn", "animated bounceOut");
    }

    function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) {
        if (colorName === null || colorName === '') { colorName = 'bg-black'; }
        if (text === null || text === '') { text = 'Turning standard Bootstrap alerts'; }
        if (animateEnter === null || animateEnter === '') { animateEnter = 'animated fadeInDown'; }
        if (animateExit === null || animateExit === '') { animateExit = 'animated fadeOutUp'; }
        var allowDismiss = true;

        $.notify({
                message: text
            },
            {
                type: colorName,
                allow_dismiss: allowDismiss,
                newest_on_top: true,
                timer: 1000,
                placement: {
                    from: placementFrom,
                    align: placementAlign
                },
                animate: {
                    enter: animateEnter,
                    exit: animateExit
                },
                template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
            });
    }
});

