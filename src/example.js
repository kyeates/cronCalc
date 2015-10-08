//include the calculator and Cron object
var CronCalc = require('./index');
var Cron = require('./model/Cron');

//set the date range we want
var start = new Date();
start.setFullYear(2012);

var end = new Date();

//instantiate the calculator
var c = new CronCalc();
//call list dates to get a list of all dates that match the epxress between the dates
//var dates  = c.listDates('*/2 * * * *', start, end, 120);

var dates  = c.findByNumberAfter('2 1 * * * 2015', new Date(), 100);
console.log('out', dates);
