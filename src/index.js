/**
 * CronCalc
 * Written by: Kieran Yeates
 * Date: 2013-12-14
 *
 * some common calculations for cron expressions
 */
module.exports = function()
{
    var self = this;
    var Cron = require('./model/Cron');
    self.defaultLimit = 1000;

    /**
     * given a cron expression and a date range list all the dates that the cron will run in the range
     *
     * @param expression
     * @param start
     * @param end
     */
    self.listDates = function(expression, start, end, limit)
    {
        if (!limit)
        {
            limit = self.defaultLimit;
        }

        var cron = new Cron(expression);
        if (cron.errors.length > 0)
        {
            throw new Error(cron.errors);
        }

        return self.findAllMatching(cron, start, end, limit);
    };

    self.humanReadable = function(cron)
    {
        return "not implemented";
    };

    /**
     * given a cron expression and a date range list all the dates that the cron will run in the range
     *
     * @param cron = cron object
     * @param start = unix time stamp to start looking at
     * @param end = unix timestamp to stop looking at
     * @returns {*}
     * @param limit
     */
    self.findAllMatching = function(cron, start, end, limit)
    {
        if (!limit) limit = self.defaultLimit;
        var result = [];

        //umm lets start one minute before start so we can include start?? right?
        start.setMinutes(start.getMinutes() - 1);
        var found = self.findNext(cron, start);
        var i = 0;
        //only run 1000 times. otherwise we might be here for ever
        while(found <= end && i++ < limit)
        {

            //self.log->debug('------find Match in date range - start: ' . self.timeToString(start) . '(' . start . ') end: ' . self.timeToString(end) . '(' . end . ')');

            if (!found)
            {
                //self.log->debug("FOUND FALSE!!!!");
                break;
            }

            //self.log->debug("found: (found)");
            //self.log->debug("find day of week match-  needle [" . date('w', found) . "] haystack: [" . var_export(cron->getDaysOfWeek(), true) . "]");
            if (cron.times.daysOfWeek.indexOf(found.getDay()))
            {
                //self.log->debug("found matches day [" . date('w', found) . "]");
                result.push(found);
            }

            found = self.findNext(cron, found);
        }

        return result;
    };

    self.findFirst = function(cron, start)
    {
        console.log('find first')
        minute = self.findNextValueFromRange(cron.times.minutes,start.getMinutes() - 1);
        hour = self.findNextValueFromRange(cron.times.hours, start.getHours() - 1);
        dayOfMonth = self.findNextValueFromRange(cron.times.daysOfMonth, start.getDate() - 1);
        month = self.findNextValueFromRange(cron.times.months, start.getMonths() - 1);
        year = self.findNextValueFromRange(cron.times.years, start.getFullYear() - 1);


        return self.mktime(hour, minute, 0, month, dayOfMonth, year);
    };

    self.findNext = function(cron, start)
    {
        //find all parts of the current time;
        var minute = start.getMinutes();
        var minutes = cron.times.minutes;
        var hour = start.getHours();
        var hours = cron.times.hours;
        var dayOfMonth = start.getDate();
        var daysOfMonth = cron.times.daysOfMonth;
        var month = start.getMonth() + 1;
        var months = cron.times.months;
        var year = start.getFullYear();
        var years = cron.times.years;

        //self.log->debug("find next =  year/month/dayOfMonth hour:minute (start)" );

        var nextMinute = self.findNextValueFromRange(minutes, minute);
        //self.log->debug("next m: nextMinute");
        if (!nextMinute)
        {
            minute = minutes[0];
            var nextHour = self.findNextValueFromRange(hours, hour);
            //self.log->debug("next h: nextHour");
            if(!nextHour)
            {
                hour = hours[0];
                var nextDayOfMonth = self.findNextValueFromRange(daysOfMonth,  dayOfMonth);
                //self.log->debug("next d: nextDayOfMonth");
                if (!nextDayOfMonth)
                {
                    dayOfMonth = daysOfMonth[0];
                    var nextMonth = self.findNextValueFromRange(months, month);
                    //self.log->debug("next mo: nextMonth");
                    if (!nextMonth)
                    {
                        month = months[0];
                        var nextYear = self.findNextValueFromRange(years, year);
                        //self.log->debug("next y: nextYear");
                        if (!nextYear)
                        {
                            //self.log->debug('no next year found, THE END!!!');
                            return false;
                        }
                        else
                        {
                            year = nextYear;
                        }
                    }
                    else
                    {
                        month = nextMonth;
                    }
                }
                else
                {
                    dayOfMonth = nextDayOfMonth;
                }
            }
            else
            {
                hour = nextHour;
            }
        }
        else
        {
            minute = nextMinute;
        }

        var time = self.mktime(hour, minute, 0, month, dayOfMonth, year);
        //self.log->debug("found next =  year/month/dayOfMonth hour:minute (time)" );
        return time;
    };

    self.findNextValueFromRange = function(haystack, needle)
    {
        //console.log('find next value from range: ', haystack);

        for (var i = 0; i < haystack.length; i++)
        {
            if (haystack[i] > needle)
            {
                //self.log->debug("found next value: " . haystack[i]);
                return haystack[i];
            }
        }

        //self.log->debug("NOT found");
        return false;
    };

    //used for logging which is not setup now
//    self.timeToString = function(time)
//    {
//        var minute = date('i', time);
//        var hour = date('H', time);
//        var day = date('d', time);
//        var month = date('m', time);
//        var year = date('Y', time);
//
//    //        Logger::getLogger('CronUtil')->debug('timeToString timestamp: ' . time . ' year: ' . year . ' month: ' . month . ' day: ' . day . ' hour: ' . hour . ' minute: ' . minute);
//
//        return  year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
//    };

    self.mktime = function(hour, minute, seconds, month, dayOfMonth, year)
    {
        var d = new Date();

        d.setHours(hour);
        d.setMinutes(minute);
        d.setSeconds(seconds);
        d.setMonth(month - 1);
        d.setDate(dayOfMonth);
        d.setFullYear(year);

        return d;
    }
};