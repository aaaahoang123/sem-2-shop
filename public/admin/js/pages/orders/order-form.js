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
                            if (select.find(`option[value=${pr._id}]`).length === 0) {
                                var newOption = $('<option>').val(pr._id).append(pr.name).attr('data-price', pr.price);
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
        var up = parseInt($(this).find('option:selected').data('price'));
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
           <tr data-index=${++newestProductIndex}>
               <th scope="row">${newestProductIndex + 1}</th>
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
    }
});