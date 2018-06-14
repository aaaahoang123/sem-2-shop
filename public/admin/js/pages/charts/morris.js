$(function () {
    getMorris('line', 'line_chart');
    getMorris('bar', 'bar_chart');
    getMorris('donut', 'donut_chart');
});


function getMorris(type, element) {
    if (type === 'line') {
        Morris.Line({
            element: 'line_chart',
            data: [
                {d: '2012-10-11', value: 10},
                {d: '2012-10-12', value: 2},
                {d: '2012-10-13', value: 5},
                {d: '2012-10-14', value: 7},
                {d: '2012-10-15', value: 8},
                {d: '2012-10-16', value: 20},
                {d: '2012-10-17', value: 14},
            ],
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