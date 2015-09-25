module.exports = function(expression)
{
    var self = this;

    //the cron expression we are looking at
    self.expression = expression;
    //a list of errors we have found while parsing the expression
    self.errors = [];

    //expression broken down into its parts
    self.explodedExpression = {
        minute: '',
        hour: '',
        dayOfMonth: '',
        month: '',
        dayOfWeek: '',
        year: ''
    };
    
    self.times = {
        minutes: [],
        hours: [],
        dayOfMonths: [],
        months: [],
        daysOfWeek: [],
        years: []
    };

    //characters that can be used in the expression and where they can be used
    var CronConsts = require('./CronConst');
    var constants = new CronConsts();

    var construct = function()
    {
        var valid = validateAndSeperateCron();
        if (!valid)
            return false;

       self.times.minutes = getValuesFromExpression(self.explodedExpression.minute, constants.validCron.minute);
       self.times.hours = getValuesFromExpression(self.explodedExpression.hour, constants.validCron.hour);
       self.times.daysOfMonth = getValuesFromExpression(self.explodedExpression.dayOfMonth, constants.validCron.dayOfMonth);
       self.times.months = getValuesFromExpression(self.explodedExpression.month, constants.validCron.month);
       self.times.daysOfWeek = getValuesFromExpression(self.explodedExpression.dayOfWeek, constants.validCron.dayOfWeek);
       self.times.years = getValuesFromExpression(self.explodedExpression.year, constants.validCron.year);
        
        return true;
    };
    
    /**
     * Separate the cron into its parts and validate that each part is correct, add any errors into self.errors
     * 
     * @returns {boolean}
     */
    var validateAndSeperateCron = function()
    {
        if (self.expression == '' || self.expression == undefined)
        {
            self.errors.push('No cron expression found');
            return false;
        }

        var parts = self.expression.split(constants.CRON_PART_SEPERATOR);
        if (parts.length < 5 || parts.length > 6)
        {
            self.errors.push('a cron expression should be made up of 5 or 6 parts separated by a space, this expression was made up of ' + parts.length + ' parts');
            return false;
        }
    
        self.explodedExpression.minute = validateExpressionPart(parts[0], constants.validCron.minute);
        self.explodedExpression.hour = validateExpressionPart(parts[1], constants.validCron.hour);
        self.explodedExpression.dayOfMonth = validateExpressionPart(parts[2], constants.validCron.dayOfMonth);
        self.explodedExpression.month = validateExpressionPart(parts[3], constants.validCron.month);
        self.explodedExpression.dayOfWeek = validateExpressionPart(parts[4], constants.validCron.dayOfWeek);
    
        if (parts[5])
            self.explodedExpression.year = validateExpressionPart(parts[5], constants.validCron.year);
        else
            self.explodedExpression.year = constants.ALL;
    
        return self.errors.length <= 0;
    };

    /**
     * Given part of an expression, validate that it contains the correct characters
     * @param exp
     * @param details
     * @returns {*}
     */
    var validateExpressionPart = function(exp, details)
    {    
        //TO BE IMPLEMENTED
        return exp;
    }

    /**
     * Find all the values that will match for a Cron expression
     *
     * Parse the special characters (*,/?) and convert them to the matching numbers
     *
     * @param expression
     * @param details
     * @returns {*}
     */
    var getValuesFromExpression = function(expression, details)
    {
        var result = [];

        //is it just a number?
        if ((typeof expression === 'number' || typeof expression === 'string') && expression !== '' && !isNaN(expression))
            return [expression];

        //is it a named day/month
        if (details.named)
        {
            for(var nameId in details.named)
            {
                if (expression == details.named[nameId])
                    return [details.named[nameId]];
            }

        }

        //check if this is a special character and return the correct dates based on that character
        for(var id in details.allowedSpecialCharacters)
        {
            var character = details.allowedSpecialCharacters[id];
            parts = expression.split(character);
            if (parts.length == 1) //character not in expression
                continue;

            switch (character)
            {
                case constants.ALL:
                case constants.ANY:
                    //make sure that we are not also using the increment character as well, which takes precidentce
                    if (expression.indexOf(constants.INCREMENT) >= 0)
                    {
                        break;
                    }

                    for(var i = details.min; i <= details.max; i++)
                    {
                        result.push(i);
                    }
                    break;
                case constants.SEPERATOR:
                    for(var partId in parts)
                    {
                        result = result.concat(getValuesFromExpression(parts[partId], details));
                    }
                    break;
                case constants.RANGE:
                    for(var i = parts[0]; i <= parts[1]; i++)
                    {
                        result.push(i);
                    }
                    break;
                case constants.INCREMENT:
                    console.log('get value from exp: increment found - start: ' + parts[0] + ' - max: '  + details.max + ' - parts1: ' + parts[1]);
                    var start = parts[0];
                    var increment = parseInt(parts[1]);
                    if (start === constants.ALL)
                    {
                        start = 0;
                    }

                    for(var i = start; i < details['max']; i+=increment)
                    {
                        result.push(i);
                    }
                    break;
            }

            if (result.length > 0)
                return result;
        }


        return result;
    };
    
    
    construct();
}