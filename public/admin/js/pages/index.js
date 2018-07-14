function MyChart(option) {
    this.datatype = option.datatype || 'order_quantity-revenue-ratio-city_revenue_ratio';
    this.group = option.group || '$dayOfWeek';
    this.ofrom = option.ofrom || '';
    this.oto = option.oto || '';
    this.ORDER_QUANTITY_ELEM = 'bar_chart';
    this.RATIO_ELEM = 'donut_chart';
    this.REVENUE_ELEM = 'line_chart';
    this.CITY_RATIO_ELEM = 'city_ratio_chart'
}

MyChart.prototype = {

    order_quantity: function () {
        var self = this;
        this.Promise
            .then(function (res) {
                if (res[0].order_quantity.length !== 0) {
                    var data = res[0].order_quantity;
                    if (self.group === '$dayOfWeek') {
                        var dayNames = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        data = data.map(function (d) {
                            d._id = dayNames[d._id];
                            return d;
                        });
                    }
                    var keys = Object.keys(data[0]);
                    $('#'+self.ORDER_QUANTITY_ELEM).html('');
                    Morris.Bar({
                        element: self.ORDER_QUANTITY_ELEM,
                        data: data,
                        xkey: keys[0],
                        ykeys: [keys[1]],
                        barColors: ['rgb(0, 188, 212)'],
                        gridTextColor: ['rgb(233, 30, 99)'],
                        labels: ['Orders']
                    });
                } else {
                    $('#'+self.ORDER_QUANTITY_ELEM).html('Can not found any data');
                }
                return self.Promise;
            })
            .catch(function (err) {
                console.log(err);
                $('#'+self.ORDER_QUANTITY_ELEM).html('Server error, please check logs and contact with us!');
                return self.Promise;
            });
        return this;
    },

    ratio: function() {
        var self = this;
        this.Promise
            .then(function (res) {
                if (res[0].total_products_quantity.length !== 0) {
                    var total = res[0].total_products_quantity[0].quantity;
                    var data = [];
                    var totalPercent = 0;
                    res[0].product_quantity.forEach(function (pr) {
                        var percent =((pr.quantity/total)*100).toFixed(2);
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
                } else {
                    $('#'+self.RATIO_ELEM).html('Can not found any data');
                }
                return self.Promise;
            })
            .catch(function (err) {
                console.log(err);
                $('#'+self.RATIO_ELEM).html('Server error, please check logs and contact with us!');
                return self.Promise;
            });
        return this;
    },

    revenue: function() {
        var self = this;
        this.Promise
            .then(function (res) {
                if(res[0].revenue.length !== 0) {
                    var data = res[0].revenue;
                    console.log(data);
                    if (self.group === '$dayOfWeek') {
                        var dayNames = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        data = data.map(function (d) {
                            d._id = dayNames[d._id];
                            return d;
                        });
                    }
                    var keys = Object.keys(data[0]);
                    $('#' + self.REVENUE_ELEM).html('');
                    Morris.Line({
                        element: self.REVENUE_ELEM,
                        data: data,
                        xkey: keys[0],
                        parseTime: false,
                        ykeys: [keys[1]],
                        labels: ['Total'],
                        xLabelAngle: 59,
                        lineColors: ['#167f39'],
                    });
                }else {
                    $('#'+self.REVENUE_ELEM).html('Can not found any data');
                }
                return self.Promise;
            })
            .catch(function (err) {
                console.log(err);
                $('#'+self.REVENUE_ELEM).html('Server error, please check logs and contact with us!');
                return self.Promise;
            });
        return this;
    },

    city_revenue_ratio: function() {
        var self = this;
        this.Promise
            .then(function(res) {
                console.log(res);
                if (res[0].city_revenue.length !== 0) {
                    var total = res[0].total_revenue[0].revenue;
                    var data = [], totalPercent = 0;
                    res[0].city_revenue.forEach(function (cr) {
                        var percent = ((cr.revenue/total)*100).toFixed(2);
                        data.push({
                            label: cr.city[0].Title,
                            value: percent
                        });
                        totalPercent += percent;
                    });
                    if (totalPercent < 100) {
                        data.push({
                            label: 'Others',
                            value: 100 - totalPercent
                        })
                    }
                    $('#'+self.CITY_RATIO_ELEM).html('');
                    Morris.Donut({
                        element: self.CITY_RATIO_ELEM,
                        data: data,
                        colors: ['rgb(233, 30, 99)', 'rgb(0, 188, 212)', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)'],
                        formatter: function (y) {
                            return y + '%'
                        }
                    });
                } else {
                    $('#'+self.CITY_RATIO_ELEM).html('Can not found any data');
                }
                return self.Promise;
            })
            .catch(function(err) {
                console.log(err);
                $('#'+self.CITY_RATIO_ELEM).html('Server error, please check logs and contact with us!');
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
                success: resolve,
                error: reject
            });
        });
        return this;
    }
};

var toDay, thisWeekStart, thisMonthStart, lastWeekStart, lastMonthStart;

$(document).ready(function() {
    var now = new Date();
    var first = now.getDate() - now.getDay();
    //console.log(new Date(now.setDate(first)).toISOString());
    toDay = new Date().toISOString().split('T')[0];
    thisWeekStart = new Date(new Date().setDate(first)).toISOString().split('T')[0];
    thisMonthStart = new Date(new Date().setDate(1)).toISOString().split('T')[0];
    lastWeekStart = new Date(new Date().setDate(first-7)).toISOString().split('T')[0];
    lastMonthStart = new Date(new Date(thisMonthStart).setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
    new MyChart({
        datatype: 'order_quantity-ratio-revenue-city_revenue_ratio',
        ofrom: thisWeekStart,
        oto: toDay
    }).load().order_quantity().ratio().city_revenue_ratio().revenue();

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