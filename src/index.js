module.exports = function()
{
    var self = this;
    var Cron = require('./model/Cron');

    /**
     * given a cron expression and a date range list all the dates that the cron will run in the range
     *
     * @param expression
     * @param start
     * @param end
     */
    self.listDates = function(expression, start, end)
    {
        var dates = [];

        var cron = new Cron(expression);

        console.log('cron', cron);


        return dates;
    };

    self.listDates('1 1 1 1 ? 2013', new Date(), new Date());



    var log = [];

    functionconstruct()
    {
        //$this->log = Logger::getLogger('CronUtil');
    }

    self.humanReadable = function(cron)
    {
        return "not implemented";
    }

    /**
     * given a cron expression and a date range list all the dates that the cron will run in the range
     * 
     * @param cron = cron object
     * @param start = unix time stamp to start looking at
     * @param end = unix timestamp to stop looking at
     * @returns {*}
     */
    var findAllMatching = function(cron, start, end)
    {
        var result = array();

        //umm lets start one minute before start so we can include start?? right?
        var found = self.findNext(cron, start - 60);
        var i = 0;
        //only run 1000 times. otherwise we might be here for ever
        while(found <= end && i++ < 1000)
        {

            //$this->log->debug('------find Match in date range - start: ' . $this->timeToString(start) . '(' . start . ') end: ' . $this->timeToString(end) . '(' . end . ')');

            if (!found)
            {
                //$this->log->debug("FOUND FALSE!!!!");
                break;
            }

            //$this->log->debug("found: (found)");
            //$this->log->debug("find day of week match-  needle [" . date('w', found) . "] haystack: [" . var_export(cron->getDaysOfWeek(), true) . "]");
            if (in_array(date('w', found), cron->getDaysOfWeek()))
            {
                //$this->log->debug("found matches day [" . date('w', found) . "]");
                result.push(found);
            }

            found = $this->findNext(cron, found);
        }

        return result;
    }

    function findFirst(cron, start)
    {
        $minute = $this->findNextValueFromRange(cron->getMinutes(), date('i', start) - 1);
        $hour = $this->findNextValueFromRange(cron->getHours(), date('H', start) - 1);
        $dayOfMonth = $this->findNextValueFromRange(cron->getDaysOfMonth(), date('j', start) - 1);
        $month = $this->findNextValueFromRange(cron->getMonths(), date('n', start) - 1);
        $year = $this->findNextValueFromRange(cron->getYears(), date('Y', start) - 1);


        return mktime($hour, $minute, 0, $month, $dayOfMonth, $year);
    }

    function findNext(cron, start)
    {
        //find all parts of the current time;
        $minute = date('i', start);
        $minutes = cron->getMinutes();
        $hour = date('H', start);
        $hours = cron->getHours();
        $dayOfMonth = date('j', start);
        $daysOfMonth = cron->getDaysOfMonth();
        $month = date('n', start);
        $months = cron->getMonths();
        $year = date('Y', start);
        $years = cron->getYears();




        //$this->log->debug("find next =  $year/$month/$dayOfMonth $hour:$minute (start)" );

        $nextMinute = $this->findNextValueFromRange($minutes, $minute);
        //$this->log->debug("next m: $nextMinute");
        if (!$nextMinute)
        {
            $minute = $minutes[0];
            $nextHour = $this->findNextValueFromRange($hours, $hour);
            //$this->log->debug("next h: $nextHour");
            if(!$nextHour)
            {
                $hour = $hours[0];
                $nextDayOfMonth = $this->findNextValueFromRange($daysOfMonth,  $dayOfMonth);
                //$this->log->debug("next d: $nextDayOfMonth");
                if (!$nextDayOfMonth)
                {
                    $dayOfMonth = $daysOfMonth[0];
                    $nextMonth = $this->findNextValueFromRange($months, $month);
                    //$this->log->debug("next mo: $nextMonth");
                    if (!$nextMonth)
                    {
                        $month = $months[0];
                        $nextYear = $this->findNextValueFromRange($years, $year);
                        //$this->log->debug("next y: $nextYear");
                        if (!$nextYear)
                        {
                            //$this->log->debug('no next year found, THE END!!!');
                            return false;
                        }
                        else
                        {
                            $year = $nextYear;
                        }
                    }
                    else
                    {
                        $month = $nextMonth;
                    }
                }
                else
                {
                    $dayOfMonth = $nextDayOfMonth;
                }
            }
            else
            {
                $hour = $nextHour;
            }
        }
        else
        {
            $minute = $nextMinute;
        }

        $time = mktime($hour, $minute, 0, $month, $dayOfMonth, $year);
        //$this->log->debug("found next =  $year/$month/$dayOfMonth $hour:$minute ($time)" );
        return $time;
    }

    function findNextValueFromRange($haystack, $needle)
    {
        //$this->log->debug("find next value - needle: $needle haystack: " . sizeof($haystack) . " [" . implode(",", $haystack) . "]");
        for ($i = 0; $i < sizeof($haystack); $i++)
        {
            if ($haystack[$i] > $needle)
            {
                //$this->log->debug("found next value: " . $haystack[$i]);
                return $haystack[$i];
            }
        }

        //$this->log->debug("NOT found");
        return false;
    }

    static function timeToString($time)
{
    $minute = date('i', $time);
    $hour = date('H', $time);
    $day = date('d', $time);
    $month = date('m', $time);
    $year = date('Y', $time);

//        Logger::getLogger('CronUtil')->debug('timeToString timestamp: ' . $time . ' year: ' . $year . ' month: ' . $month . ' day: ' . $day . ' hour: ' . $hour . ' minute: ' . $minute);

    return  $year . '/' . $month . '/' . $day . ' ' . $hour . ':' . $minute;
}
    
};