module.exports = function()
{
    var self = this;

    self.CRON_PART_SEPERATOR = ' ';
    self.ALL = '*';
    self.SEPERATOR = ',';
    self.INCREMENT = '/';
    self.RANGE = '-';
    self.ANY = '?';
    self.WEEKDAY = 'W';
    self.LAST_DAY = 'L';
    self.WEEK_NUMBER = '#';
    self.WEEK_INCREMENT = '|';

    self.validCron = {
        minute: {
            id: 0,
            allowedSpecialCharacters: [self.ALL, self.SEPERATOR, self.INCREMENT, self.RANGE],
            min: 0,
            max: 59
        },
        hour: {
            id: 1,
            allowedSpecialCharacters: [self.ALL, self.SEPERATOR, self.INCREMENT, self.RANGE],
            min: 0,
            max: 23
        },
        dayOfMonth: {
            id: 2,
            allowedSpecialCharacters: [self.ALL, self.SEPERATOR, self.INCREMENT, self.RANGE, self.ANY, self.LAST_DAY, self.WEEKDAY],
            min: 1,
            max: 31
        },
        month: {
            id: 3,
            allowedSpecialCharacters: [self.ALL, self.SEPERATOR, self.INCREMENT, self.RANGE],
            named: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            min: 1,
            max: 12
        },
        dayOfWeek: {
            id: 4,
            allowedSpecialCharacters: [self.ALL, self.SEPERATOR, self.INCREMENT, self.RANGE, self.ANY, self.LAST_DAY, self.WEEK_NUMBER, self.WEEK_INCREMENT],
            named: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            min: 0,
            max: 6
        },
        year: {
            id: 5,
            allowedSpecialCharacters: [self.ALL, self.SEPERATOR, self.INCREMENT, self.RANGE],
            min: 1970,
            max: 2099
        }
    };
};