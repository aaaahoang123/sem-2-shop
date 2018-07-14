function MyChart(option) {
    this.datatype = (typeof option.datatype === 'undefined')?'order_quantity':option.datatype;
    this.group = (typeof option.group === 'undefined')?'$dayOfWeek':option.group;
    this.ofrom = (typeof option.ofrom === 'undefined')?'':option.ofrom;
    this.oto = (typeof option.oto === 'undefined')?'':option.oto;
    this.ORDER_QUANTITY_ELEM = 'bar_chart';
    this.RATIO_ELEM = 'donut_chart';
    this.REVENUE_ELEM = 'line_chart';
}

MyChart.prototype = {

    order_quantity: function () {
        var self= this;
        this.Promise.then(function (res) {
            var data = res[0].order_quantity;
            var keys = Object.keys(data[0]);
            $('#'+self.ORDER_QUANTITY_ELEM).html('');
            Morris.Bar({
                element: self.ORDER_QUANTITY_ELEM,
                data: data,
                xkey: keys[0],
                ykeys: [keys[1]],
                barColors: ['rgb(0, 188, 212)'],
                gridTextColor: ['rgb(233, 30, 99)'],
                labels: ['Order']
            });
            return self.Promise;
        });
        return this;
    },

    ratio: function() {
        var self = this;
        this.Promise.then(function (res) {
            console.log(res);
            var total = res[0].total_products_quantity[0].quantity;
            var data = [];
            var totalPercent = 0;
            res[0].product_quantity.forEach(function (pr) {
                var percent = Math.floor((pr.quantity/total)*100);
                totalPercent += percent;
                data.push({
                    label: pr.content[0].name,
                    value: percent
                });
            });
            if (totalPercent < 100) {
                data.push({
                    label: 'Others',
                    value: 100 - totalPercent
                })
            }

            $('#'+self.RATIO_ELEM).html('');
            Morris.Donut({
                element: self.RATIO_ELEM,
                data: data,
                colors: ['rgb(233, 30, 99)', 'rgb(0, 188, 212)', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)'],
                formatter: function (y) {
                    return y + '%'
                }
            });
            return self.Promise;
        });
        return this;
    },

    load: function () {
        var self = this;
        this.Promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: '/api/charts?datatype=' + self.datatype + '&group=' + self.group + '&ofrom=' + self.ofrom + '&oto=' + self.oto,
                method: 'GET',
                success: function(res) {
                    resolve(res);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
        return this;
    }
};

var toDay, thisWeekStart, thisMonthStart, lastWeekStart, lastMonthStart;

$(document).ready(function() {
    var now = new Date();
    var first = now.getDate() - now.getDay() + 1;
    //console.log(new Date(now.setDate(first)).toISOString());
    toDay = new Date().toISOString().split('T')[0];
    thisWeekStart = new Date(new Date().setDate(first)).toISOString().split('T')[0];
    thisMonthStart = new Date(new Date().setDate(1)).toISOString().split('T')[0];
    lastWeekStart = new Date(new Date().setDate(first-7)).toISOString().split('T')[0];
    lastMonthStart = new Date(new Date().setMonth(now.getMonth() - 1)).toISOString().split('T')[0];

    new MyChart({
        datatype: 'order_quantity-ratio',
        ofrom: thisWeekStart,
        oto: toDay
    }).load().order_quantity().ratio();

    $('.load-chart-btn').on('click', renderNewChart);
});

function renderNewChart() {
    var dataType = $(this).attr('data-type');
    var from = '', to = '', group = '$dayOfWeek';
    if ($(this).attr('data-time') === 'thisWeek') {
        from = thisWeekStart;
        to = toDay;
    }
    if ($(this).attr('data-time') === 'lastWeek') {
        from = lastWeekStart;
        to = thisWeekStart;
    }
    if ($(this).attr('data-time') === 'thisMonth') {
        from = thisMonthStart;
        to = toDay;
        group = '$week';
    }
    if ($(this).attr('data-time') === 'lastMonth') {
        from = lastMonthStart;
        to = thisMonthStart;
        group = '$week';
    }

    new MyChart({
        datatype: dataType,
        ofrom: from,
        oto: to,
        group: group
    }).load()[dataType]();

    $(this).closest('.header').find('h2').html($(this).attr('data-message'));
}