$(function () {
    var today = new Date().toJSON().slice(0,10);
    var monDay = getMonday(today);
    $.ajax({
        url: '/api/charts?ofrom='+ monDay + '&oto=' + today,
        type: "GET",
        success: function(res){
            getMorris('line', 'line_chart', generateDataLineChart(res[0].revenue));
            getMorris('bar', 'bar_chart');
            getMorris('donut', 'donut_chart');
        },
        error: function(res, message){
            console.log(res);
        },
    });

});

function getMorris(type, element, dt) {
    if (type === 'line') {
        Morris.Line({
            element: 'line_chart',
            data: dt,
            xkey: 'd',
            parseTime: false,
            ykeys: ['value'],
            labels: ['Total'],
            xLabelAngle: 59,
            lineColors: ['#167f39'],
        });
    } else if (type === 'bar') {
        Morris.Bar({
            element: element,
            data: [
                {y: 'T2', a: 100},
                {y: 'T3', a: 75},
                {y: 'T4', a: 50},
                {y: 'T5', a: 75},
                {y: 'T6', a: 50},
                {y: 'T7', a: 75},
                {y: 'CN', a: 100}
            ],
            xkey: 'y',
            ykeys: ['a'],
            barColors: ['rgb(0, 188, 212)'],
            gridTextColor: ['rgb(233, 30, 99)'],
            labels: ['Order']
        });
    } else if (type === 'donut') {
        Morris.Donut({
            element: element,
            data: [{
                label: 'Jam',
                value: 25
            }, {
                label: 'Frosted',
                value: 40
            }, {
                label: 'Custard',
                value: 25
            }, {
                label: 'Sugar',
                value: 10
            }],
            colors: ['rgb(233, 30, 99)', 'rgb(0, 188, 212)', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)'],
            formatter: function (y) {
                return y + '%'
            }
        });
    }
}

var generateDataLineChart = function(dt) {
    var data = [];
    for(v of dt){
        data.push({
            d: v._id.year + '-' + v._id.month + '-' + v._id.day,
            value: v.revenue
        });
    }
    return data;
};

var getMonday = function (d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff)).toJSON().slice(0,10);
};