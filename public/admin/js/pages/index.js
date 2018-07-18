function MyChart(option) {
    this.datatype = option.datatype&&typeof option.datatype==='object'?option.datatype.toString().replace(/,/g, '-'):option.datatype || 'order_quantity-revenue-ratio-city_revenue_ratio-order_quantity_in_hour';
    this.group = option.group || '$dayOfWeek';
    this.ofrom = !option.ofrom?'':moment(option.ofrom).format('x');
    this.oto = !option.oto?'':moment(option.oto).add(1, 'day').format('x');
    this.ORDER_QUANTITY_ELEM = 'bar_chart';
    this.RATIO_ELEM = 'donut_chart';
    this.REVENUE_ELEM = 'line_chart';
    this.CITY_RATIO_ELEM = 'city_ratio_chart';
    this.ORDER_QUANTITY_HOUR_ELEM = 'order_quantity_in_hour';
}

MyChart.prototype = {

    render: function() {
        var dataArr = this.datatype.split('-');
        for (var d of dataArr) {
            this[d]();
        }
        return this;
    },

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
                } else {
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
                        colors: ['#077a1e', '#ff4300', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)'],
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

    order_quantity_in_hour: function() {
        var self = this;
        this.Promise
            .then(function (res) {
                if(res[0].order_quantity_in_hour.length !== 0) {
                    var data = res[0].order_quantity_in_hour;
                    var keys = Object.keys(data[0]);
                    $('#' + self.ORDER_QUANTITY_HOUR_ELEM).html('');
                    Morris.Line({
                        element: self.ORDER_QUANTITY_HOUR_ELEM,
                        data: data,
                        xkey: keys[0],
                        parseTime: false,
                        ykeys: [keys[1]],
                        labels: ['Total'],
                        xLabelAngle: 30,
                        lineColors: ['#ff6600'],
                    });
                } else {
                    $('#'+self.ORDER_QUANTITY_HOUR_ELEM).html('Can not found any data');
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

    load: function () {
        var self = this;
        this.Promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: '/api/charts?datatype=' + self.datatype + '&group=' + self.group + '&ofrom=' + self.ofrom + '&oto=' + self.oto,
                method: 'GET',
                success: function(res) {
                    console.log('Load data success', res);
                    resolve(res);
                },
                error: reject
            });
        });
        return this;
    }
};

$(document).ready(function() {
    new MyChart({
        ofrom: moment().millisecond(0).second(0).minute(0).hour(0).weekday(0).subtract(new Date().getTimezoneOffset(), 'm').format(),
        oto: moment()
    }).load().render();

    $('#load-charts-btn').on('click', function() {
        new MyChart({
            ofrom: $('input[name="input-ofrom"]').val(),
            oto: $('input[name="input-oto"]').val(),
            group: $('select[name="select-group"]').val(),
            datatype: $('select[name="select-datatype"]').val()
        }).load().render();
    });

    var chartDetails = {
        revenue: ['Revenue', 'Revenue, or total price of orders! This charts will show the revenue of the shop through all the time you choose. Each point will show the revenue in a group of time! The default group is Date'],
        ratio: '',
        order_quantity: '',
        order_quantity_in_hour: '',
        city_revenue_ratio: ''
    };

    $('.chart-detail-btn').click(function() {
        var data = chartDetails[$(this).attr('data-detail')];
        swal(data[0], data[1], 'info');
    })
});