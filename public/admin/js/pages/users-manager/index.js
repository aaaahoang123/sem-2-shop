$(document).ready(function () {
    $(".dropdown .dropdown-menu li a").click();

    var form = document.forms['user-form'];
    form.action = '/manager/dashboard/users-manager/users/' + $(form).data('mid') + '?_method=PUT';
    form.onsubmit = editUser;

    var aform = document.forms['account-form'];
    aform.action = '/manager/dashboard/users-manager/users/account/'+ $(aform).data('update') + '?_method=PUT';
    aform.onsubmit = editAcc;
});

function editAcc(e) {
    var hasErr = false;
    if(this.username.value.length < 8) {
        $('#err-username').text('Username is required and must have at least 8 character!');
        hasErr = true;
    }

    if(!['1','2'].includes(this.type.value)) {
        $('#err-type').text('Please choose type of account');
        hasErr = true;
    }

    if(this.password.value.length < 8) {
        $('#err-password').text('Password is required and must have at least 8 character!');
        hasErr = true;
    }

    if(this.password.value !== $('#compare-password').val()) {
        $('#alert-compare-password').text('Password not match');
        hasErr = true;
    }

    if (hasErr) e.preventDefault();
}

function editUser(e) {
    var hasErr = false;
    if(this.full_name.value.length === 0) {
        $('#err-fullname').text('Please do not skip the full name!');
        hasErr = true;
    }

    if(!['0','1'].includes(this.gender.value)) {
        $('#err-gender').text('Gender is required');
        hasErr =true
    }

    if (new Date(this.birthday.value) > Date.now()) {
        $('#err-birthday').text('Your birthday must be sooner than today!');
        hasErr = true;
    }

    if(this.address.value === '') {
        $('#err-address').text('Address is required');
        hasErr = true;
    }

    if(this.email.value === '') {
        $('#err-email').text('Email is required');
        hasErr = true;
    }
    else {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!pattern.test(this.email.value.toLowerCase())) {
            $('#err-email').text('Please enter a correct email!');
            hasErr = true;
        }
    }

    if(this.phone.value === '') {
        $('#err-phone').text('Phone is required');
        hasErr = true;
    }

    if (hasErr) e.preventDefault();
}