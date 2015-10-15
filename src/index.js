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
    var CronConst = require('./model/CronConst');
    var constants = new CronConst();
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

        start.setSeconds(0);
        end.setSeconds(0);

        return self.findAllMatching(cron, start, end, limit);
    };

    self.findByNumber = function(expression, time, beforeLimit, afterLimit) {
        var before = self.findByNumberBefore(expression, time, beforeLimit);
        var after = self.findByNumberAfter(expression, time, afterLimit);

        //if (before[before.length -  1].toUTCString() === after[0].toUTCString())
        //{
        //    before.pop();
        //}
        return before.concat(after);
    };

    /**
     * Given a time find X number of times the cron will run before that time.
     *
     * @param expression
     * @param time
     * @param limit
     */
    self.findByNumberBefore = function(expression, time, limit) {
        var cron = new Cron(expression);
        if (cron.errors.length > 0)
        {
            throw new Error(cron.errors);
        }

        return self.findBefore(cron, time, limit).reverse();
    };

    self.findByNumberAfter =  function(expression, time, limit) {
        var cron  = new Cron(expression);
        if (cron.errors.length > 0)
        {
            throw new Error(cron.errors);
        }

        return self.findAfter(cron, time, limit);
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

        var found = self.findNext(cron, start);
        var i = 0;
        //only run 1000 times. otherwise we might be here for ever
        while(found <= end && i++ < limit)
        {

            if (!found)
            {
                break;
            }

            if (cron.times.daysOfWeek.indexOf(found.getDay()))
            {
                result.push(found);
            }

            found = self.findNext(cron, found);
        }

        return result;
    };

    self.findAfter = function(cron, time, limit)
    {
        if (!limit)
        {
            limit = self.defaultLimit;
        }

        var result = [];

        time = new Date(time);
        time.setSeconds(0);

        //start one minute before so we can inlucde start
        time.setMinutes(time.getMinutes() -1);
        var found = self.findNext(cron, time);
        console.log('after first:', found);
        for(var i = 0;i < limit; i++)
        {
            if (!found)
            {
                break;
            }

            if (cron.times.daysOfWeek.indexOf(found.getDay()))
            {
                result.push(found);
            }

            found = self.findNext(cron, found);
        }

        return result;
    };

    self.findFirst = function(cron, start)
    {
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

        var nextMinute = self.findNextValueFromRange(minutes, minute);
        if (!nextMinute)
        {
            minute = minutes[0];
            var nextHour = self.findNextValueFromRange(hours, hour);
            if(!nextHour)
            {
                hour = hours[0];
                var validDayOfMonth = constants.validCron.dayOfMonth;
                validDayOfMonth.max = new Date(year, month -1, 0).getDate();
                daysOfMonth  = cron.getValuesFromExpression(cron.explodedExpression.dayOfMonth, validDayOfMonth);

                var nextDayOfMonth = self.findNextValueFromRange(daysOfMonth,  dayOfMonth);
                if (!nextDayOfMonth)
                {
                    dayOfMonth = daysOfMonth[0];
                    var nextMonth = self.findNextValueFromRange(months, month);
                    if (!nextMonth)
                    {
                        month = months[0];
                        var nextYear = self.findNextValueFromRange(years, year);
                        if (!nextYear)
                        {
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
        return time;
    };

    self.findNextValueFromRange = function(haystack, needle)
    {
        for (var i = 0; i < haystack.length; i++)
        {
            if (haystack[i] > needle)
            {
                return haystack[i];
            }
        }

        return false;
    };

    self.findPrevValueFromRange = function(haystack, needle)
    {
        for (var i = haystack.length - 1; i >= 0; i--)
        {
            if (haystack[i] < needle)
            {
                return haystack[i];
            }
        }
        return false;
    };

    /**
     * Find x number of cron before this time.
     * @param cron
     * @param time
     * @param limit
     */
    self.findBefore = function(cron, time, limit)
    {
        if (!limit)
        {
            limit = self.defaultLimit;
        }
        var result = [];

        time = new Date(time);
        time.setSeconds(0);

        //start one minute after so we can inlucde start
        time.setMinutes(time.getMinutes() + 1);
        var found = self.findPrev(cron, time);
        console.log('before first:', found);
        for(var i = 0;i < limit; i++)
        {
            if (!found)
            {
                break;
            }

            if (cron.times.daysOfWeek.indexOf(found.getDay()))
            {
                result.push(found);
            }

            found = self.findPrev(cron, found);
        }

        return result;
    };

    self.findPrev = function(cron, start)
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

        var prevMinute = self.findPrevValueFromRange(minutes, minute);
        if (!prevMinute)
        {
            minute = minutes[minutes.length - 1];
            var prevHour = self.findPrevValueFromRange(hours, hour);
            if(!prevHour)
            {
                hour = hours[hours.length - 1];
                var validDayOfMonthno = constants.validCron.dayOfMonth;
                validDayOfMonth.max = new Date(year, month -1, 0).getDate();
                daysOfMonth  = cron.getValuesFromExpression(cron.explodedExpression.dayOfMonth, validDayOfMonth);

                var prevDayOfMonth = self.findPrevValueFromRange(daysOfMonth,  dayOfMonth);
                if (!prevDayOfMonth)
                {
                    dayOfMonth = daysOfMonth[daysOfMonth.length - 1];
                    var prevMonth = self.findPrevValueFromRange(months, month);
                    if (!prevMonth)
                    {
                        month = months[months.length - 1];
                        var prevYear = self.findPrevValueFromRange(years, year);
                        if (!prevYear)
                        {
                            return false;
                        }
                        else
                        {
                            year = prevYear;
                        }
                    }
                    else
                    {
                        month = prevMonth;
                    }
                }
                else
                {
                    dayOfMonth = prevDayOfMonth;
                }
            }
            else
            {
                hour = prevHour;
            }
        }
        else
        {
            minute = prevMinute;
        }

        var time = self.mktime(hour, minute, 0, month, dayOfMonth, year);
        //self.log->debug("found next =  year/month/dayOfMonth hour:minute (time)" );
        return time;
    };

    self.mktime = function(hour, minute, seconds, month, dayOfMonth, year)
    {
        var d = new Date();

        d.setHours(hour);
        d.setMinutes(minute);
        d.setSeconds(seconds);
        d.setMonth(month - 1);
        d.setDate(dayOfMonth);
        d.setFullYear(year);
        d.setMilliseconds(0);

        return d;
    };
};