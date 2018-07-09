$('#btn-clear').on('click', function () {
    var forms = document.forms['form-contact'];
    forms['email'].value = '';
    forms['phone'].value = '';
    forms['address'].value = '';
    forms['facebook'].value = '';
    forms['instagram'].value = '';
    forms['twitter'].value = '';
});