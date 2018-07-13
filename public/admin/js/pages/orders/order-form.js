$(document).ready(function () {
    const Product = function () {
        this.code = '';
        this.quantity = 1;
    };

    var searchProductTimeout = null;
    var usedQuery = [];
    var newestProductIndex = 0;
    $('body').on('keyup', '.bs-searchbox > input.form-control', function () {
        var el = this;
        if (searchProductTimeout !== null) {
            clearTimeout(searchProductTimeout);
            searchProductTimeout = null;
        }
        searchProductTimeout = setTimeout(function () {
            var q = $(el).val();
            if (!usedQuery.includes(q) && q !== '') {
                $.ajax({
                    url: '/api/products?q=' + q,
                    method: 'GET',
                    success: function (res) {
                        console.log('Load new product: ', res);
                        usedQuery.push(q);
                        var select = $(el).closest('td').find('select.select-product');
                        res.forEach(function (pr) {
                            if (select.find(`option[value=${pr.code}]`).length === 0) {
                                var newOption = $('<option>').val(pr.code).append(pr.name).attr('data-price', pr.price);
                                $('select.select-product').append(newOption);
                            }
                        });
                        $('select.select-product').selectpicker('refresh');
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            } else console.log('This query has been used, not load more product!')
        }, 500)
    });

    $('body').on('change', 'select.select-product', function () {
        var up = parseInt($(this).find('option:selected').attr('data-price'));
        var row = $(this).closest('tr');
        row.attr('data-price', up);
        var quantity = row.find('input.input-quantity').val();
        row.find('.unit-price').html(up);
        row.find('.total-price').html(up*quantity);
        mathTotalPrice();
    });

    $('body').on('change', '.input-quantity', function () {
        var el = this;
        if (searchProductTimeout !== null) {
            clearTimeout(searchProductTimeout);
            searchProductTimeout = null;
        }
        searchProductTimeout = setTimeout(function () {
            var row = $(el).closest('tr');
            row.find('.total-price').html($(el).val() * parseInt(row.data('price')));
            mathTotalPrice();
        }, 300);
    });

    $('#add-product-btn').click(function () {
        var innerOption = document.querySelector('#product-table select.select-product').outerHTML;
        var row = `
           <tr data-index=${++newestProductIndex} data-price=0>
               <th scope="row" class="text-center">${newestProductIndex + 1}</th>
               <td>${innerOption}</td>
               <td><div class="form-group" style='margin-bottom: 0'><div class="form-line"><input type="number" data-index=${newestProductIndex} class="input-quantity form-control" placeholder="Quantity" value=1></div></div></td>
               <td class='unit-price' data-index=${newestProductIndex}></td>
               <td class='total-price' data-index=${newestProductIndex}></td>
           </tr>
       `;
        $('#product-table').append(row);
        $('.select-product').selectpicker('refresh');
        $.AdminBSB.input.activate();
    });

    const mathTotalPrice = function () {
        var total = 0;
        $('.total-price').get().forEach(function (el) {
            total += parseInt($(el).text());
        });
        $('#order-total-price').html(total);
        $('#total-price-input').val(total);
    };

    $('#select-city').change(function () {
        var id = $(this).val();
        $.ajax({
            url: '/api/districts?cid=' + id,
            type: 'GET',
            success: function (res) {
                var selectDistrict = $('#select-district');
                selectDistrict.attr('disabled', false).html('').append(`<option selected disabled>Choose district</option>`);
                res.forEach(function (district) {
                    selectDistrict.append(`<option value="${district.ID}">${district.Title}</option>`);
                });
                selectDistrict.selectpicker('refresh');
            },
            error: function (res) {
                console.log(res)
            }
        })
    });
    
    $('form[name="order-form"]').submit(function (e) {
        var cart = {};
        var isValid = true;
        $('#product-table tr').get().forEach(function (el) {
            if ($(el).attr('data-price') !== '0') {
                var code = $(el).find('select.select-product').val();
                var quantity = parseInt($(el).find('.input-quantity').val());
                var price = parseInt($(el).attr('data-price'));
                cart[code] = {
                    quantity: quantity,
                    price: price,
                    selected: true
                }
            }
        });
        console.log('cart', cart);
        if (Object.keys(cart).length === 0) {
            isValid = false;
            $('#alert-product').css('display', '');
        } else $('#alert-product').css('display', 'none');

        var form = $('form[name="order-form"]');

        if (form.find('input[name="receiver_email"]').val() === '') {
            isValid = false;
            form.find('input[name="receiver_email"]').closest('.input-group').find('label').html('Must have an email!');
        } else form.find('input[name="receiver_email"]').closest('.input-group').find('label').html('');

        if (form.find('input[name="receiver_phone"]').val() === '') {
            isValid = false;
            form.find('input[name="receiver_phone"]').closest('.input-group').find('label').html('Must have a phone to contact!');
        } else form.find('input[name="receiver_phone"]').closest('.input-group').find('label').html('');

        if (form.find('select[name="receiver_city"]').val() === '') {
            isValid = false;
            form.find('select[name="receiver_city"]').closest('.input-group').find('label').html('Please choose a city!');
        } else form.find('select[name="receiver_city"]').closest('.input-group').find('label').html('');

        if (form.find('select[name="receiver_district"]').val() === '') {
            isValid = false;
            form.find('select[name="receiver_district"]').closest('.input-group').find('label').html('Please choose a district!');
        } else form.find('select[name="receiver_district"]').closest('.input-group').find('label').html('');

        if (form.find('input[name="receiver_address"]').val() === '') {
            isValid = false;
            form.find('input[name="receiver_address"]').closest('.input-group').find('label').html('Please enter the address!');
        } else form.find('input[name="receiver_address"]').closest('.input-group').find('label').html('');

        if (!isValid) {
            e.preventDefault();
            return;
        }

        Cookies.set('cart', cart);
    });
});