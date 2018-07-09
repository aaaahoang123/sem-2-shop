CKEDITOR.replace('ckeditor');
CKEDITOR.config.height = 300;

$('#btn-reset').on('click', function () {
    CKEDITOR.instances.ckeditor.setData('');
    document.forms['form-blog']['title'].value = '';
});

$('#form1').submit(function (e) {
    $('#content').val(CKEDITOR.instances.ckeditor.getData());
});
