//include the calculator and Cron object
var CronCalc = require('./index');
var Cron = require('./model/Cron');

//set the date range we want
var start = new Date();
start.setFullYear(2012);

var end = new Date();

//instanciate the calculator
var c = new CronCalc();
//call list dates to get a list of all dates that match the epxress between the dates
console.log('out', c.listDates('* 1 1 1 ? 2013', start, end));
