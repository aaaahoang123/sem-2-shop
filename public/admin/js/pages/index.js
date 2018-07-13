function MyChart(option) {
    this.datatype = (typeof option.datatype === 'undefined')?'order_quantity':option.datatype;
    this.group = (typeof option.group === 'undefined')?'$dayOfWeek':option.group;
    this.ofrom = (typeof option.ofrom === 'undefined')?'':option.ofrom;
    this.oto = (typeof option.oto === 'undefined')?'':option.oto;
    this.ORDER_QUANTITY_ELEM = 'bar_chart';
}

MyChart.prototype = {

    renderQuantity: function () {
        var self= this;
        this.Promise.then(function (res) {
            var data = res[0].order_quantity;
            var keys = Object.keys(data[0]);
            $('#'+this.ORDER_QUANTITY_ELEM).html('');
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

    renderRatio: function() {
        var self = this;
        this.Promise.then(function (res) {
            var data = res[0].order_quantity;
            var keys = Object.keys(data[0]);
            $('#donut_chart').html('');
            Morris.Bar({
                element: 'donut_chart',
                data: data,
                xkey: keys[0],
                ykeys: [keys[1]],
                barColors: ['rgb(0, 188, 212)'],
                gridTextColor: ['rgb(233, 30, 99)'],
                labels: ['Order']
            });
        });
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

$(document).ready(function() {
    var now = new Date();
    var first = now.getDate() - now.getDay() + 1;
    //console.log(new Date(now.setDate(first)).toISOString());
    var start = new Date(now.setDate(first)).toISOString().split('T')[0];
    var end = new Date().toISOString().split('T')[0];

    new MyChart({
        datatype: 'order_quantity',
        ofrom: start,
        oto: end
    }).load().renderQuantity().renderRatio();
});