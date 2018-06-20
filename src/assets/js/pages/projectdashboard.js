/*
 *  Document   : base_pages_dashboard_v2.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Dashboard v2 Page
 */

 // Add a helper to format timestamp data
  Date.prototype.formatMMDDYYYY = function() {
      return (this.getMonth() + 1) +
      "/" +  this.getDate() +
      "/" +  this.getFullYear();
  }

var BasePagesDashboardv2 = function() {
    // Chart.js Chart, for more examples you can check out http://www.chartjs.org/docs
    var initDashv2ChartJS = function(){
        // Get Chart Container
        var $dashChartEarningsCon = jQuery('.js-dash-chartjs-earnings')[0].getContext('2d');
        var $dashChartSalesCon    = jQuery('.js-dash-chartjs-sales')[0].getContext('2d');

        // Earnings Chart Data
        var jsonData = $.ajax({
    url: 'http://api.dev/api/datapoints/datapoint1',
    dataType: 'json',
  }).done(function (results) {
    //console.log(results);
     // Split timestamp and data into separate arrays
     var labels = [], data=[];
   results["datapoints"].forEach(function(datapoint) {
        //console.log(datapoint);
       
       if(datapoint.data != null){
        console.log(datapoint.data.register[0]);
        //$d = date("Y-m-d", strtotime(datapoint.date.date));
        //$d = new Date(datapoint.date.date);
        //$d = strtotime(string(datapoint.date.date));
        //$date = new DateTime('2000-01-01');
//echo $date->format('Y-m-d H:i:s');
        //$d = new DateTime('2011-01-01T15:03:01.012345Z');

            //labels.push($d->format('Y-m-d\TH:i'));
            //labels.push(strtotime(datapoint.date.date));
            labels.push(datapoint.date.date);

            //labels.push(d);
            //data.push(parseFloat(datapoint.data.register[0])/16);
            //Get the Temperature register
            data.push((datapoint.data.register[0])/16);
       }
       //data.push(parseFloat(datapoint.data.register[0]));
       console.log(labels);
    });
    var $dashChartEarningsData = {
            //labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            labels: labels,
            datasets: [
                {
                    label: 'This Week',
                    fillColor: 'rgba(68, 180, 166, .07)',
                    strokeColor: 'rgba(68, 180, 166, .25)',
                    pointColor: 'rgba(68, 180, 166, .25)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(68, 180, 166, 1)',
                    //data: [600, 350, 1100, 420, 750, 1050, 670]
                    data: data
                },
                // {
                //     label: 'This Week',
                //     fillColor: 'rgba(68, 180, 166, .25)',
                //     strokeColor: 'rgba(68, 180, 166, .55)',
                //     pointColor: 'rgba(68, 180, 166, .55)',
                //     pointStrokeColor: '#fff',
                //     pointHighlightFill: '#fff',
                //     pointHighlightStroke: 'rgba(68, 180, 166, 1)',
                //     data: [1000, 430, 560, 790, 1200, 950, 1500]
                // }
            ]
        };


        // Sales Chart Data
        var $dashChartSalesData = {
            labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            datasets: [
                {
                    label: 'Last Week',
                    fillColor: 'rgba(164, 138, 212, .07)',
                    strokeColor: 'rgba(164, 138, 212, .25)',
                    pointColor: 'rgba(164, 138, 212, .25)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(164, 138, 212, 1)',
                    data: [60, 40, 90, 35, 85, 65, 77]
                },
                {
                    label: 'This Week',
                    fillColor: 'rgba(164, 138, 212, .25)',
                    strokeColor: 'rgba(164, 138, 212, .55)',
                    pointColor: 'rgba(164, 138, 212, .55)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(164, 138, 212, 1)',
                    data: [50, 33, 25, 82, 120, 95, 150]
                }
            ]
        };

        // Init Earnings Chart
        var $dashChartEarnings = new Chart($dashChartEarningsCon).Line($dashChartEarningsData, {
            scaleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            scaleFontColor: '#999',
            scaleFontStyle: '600',
            tooltipTitleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            tooltipCornerRadius: 3,
            maintainAspectRatio: false,
            responsive: true
        });

        // Init Sales Chart
        var $dashChartSales = new Chart($dashChartSalesCon).Line($dashChartSalesData, {
            scaleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            scaleFontColor: '#999',
            scaleFontStyle: '600',
            tooltipTitleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            tooltipCornerRadius: 3,
            maintainAspectRatio: false,
            responsive: true
        });
  });

    // Split timestamp and data into separate arrays
    // var labels = [], data=[];
    // results["datapoints"].forEach(function(datapoint) {
    //   labels.push(new Date(datapoint.date).formatMMDDYYYY());
    //   data.push(parseFloat(datapoint.register[0]));
    // });

    // // Create the chart.js data structure using 'labels' and 'data'
    // var tempData = {
    //   labels : labels,
    //   datasets : [{
    //       fillColor             : "rgba(151,187,205,0.2)",
    //       strokeColor           : "rgba(151,187,205,1)",
    //       pointColor            : "rgba(151,187,205,1)",
    //       pointStrokeColor      : "#fff",
    //       pointHighlightFill    : "#fff",
    //       pointHighlightStroke  : "rgba(151,187,205,1)",
    //       data                  : data
    //   }]
    // };

    //test loading from web service


       
    };

    return {
        init: function () {
            // Init ChartJS charts
            initDashv2ChartJS();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ BasePagesDashboardv2.init(); });