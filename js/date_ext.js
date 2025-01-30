"use strict";

(function() {

    function attachConstant( someObj, constantName, constantValue, prototype = true )
    {        
        var attributes = {
            value: constantValue,
            writable: false,
            enumerable: true,
            configurable: true
        };
        if (prototype)
            Object.defineProperty( someObj.prototype, constantName, attributes );
        else
            Object.defineProperty( someObj, constantName, attributes );            
    }
    
    var CONSTANTS = {
        SUNDAY : 0,
        MONDAY : 1,
        TUESDAY : 2,
        WEDNESDAY : 3,
        THURSDAY : 4,
        FRIDAY : 5,
        SATURDAY : 6,
        JANUARY : 0,
        FEBRUARY : 1,
        MARCH : 2,
        APRIL : 3,
        MAY : 4,
        JUNE : 5,
        JULY : 6,
        AUGUST : 7,
        SEPTEMBER : 8,
        OCTOBER : 9,
        NOVEMBER : 10,
        DECEMBER : 11,
        MONTHS : ["January","February","March","April","May","June","July","August","September","October","November","December"],
        WEEKDAYS : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        DAY : 86400000,
        WEEK : 604800000,
        BIWEEK : 1209600000,
        YEAR : 31536000000
    };

    for (var key in CONSTANTS)
    {            
        attachConstant(Date, key, CONSTANTS[key], false);
    }

})();

Object.defineProperties(Date.prototype, {
    "year": {
        get : function()
        { 
            return this.getFullYear();
        },        
        enumerable : true
    },
    "isNewYears": {
        get : function()
        { 
            return this.getMonth() == 0 && this.getDate() == 1;
        },        
        enumerable : true
    },
    "isSunday": {
        get : function()
        { 
            return this.getDay() == Date.SUNDAY; 
        },        
        enumerable : true
    },
    "isSaturday": {
        get : function()
        { 
            return this.getDay() == Date.SATURDAY; 
        },        
        enumerable : true
    },
    "isWeekend": {
        get : function()
        { 
            return this.isSunday || this.isSaturday;
        },        
        enumerable : true
    },
    "weekDay": {
        get : function()
        { 
            return Date.WEEKDAYS[this.getDay()];
        },        
        enumerable : true
    },
    "label": {
        value: "",
        writable: true
    }
});

Date.prototype.lastYear = function()
{           
    var newDate = new Date(this);
    newDate.setFullYear(this.year - 1);
    return newDate;
}

Date.prototype.nextYear = function()
{
    var newDate = new Date(this);
    newDate.setFullYear(this.year + 1);
    return newDate;
}

Date.prototype.nextDate = function(days = 1)
{
    let newDate = new Date(this);
    newDate.setDate(this.getDate()+days);
    return new Date(newDate);
}

Date.prototype.daysUntil = function(date)
{
    return Date.getDaysOffset(Date.now(), date);
}

Date.getDaysInSpan = function*(start, end)
{                
    let day = new Date(start);
    while (day <= end)
    {            
        yield day;
        day = day.nextDate();
    }                 
}

Date.daysInMonth = function*(year = new Date().year, month = new Date().getMonth())
{
    let day = new Date(year, month, 1);        
    while (day.getMonth() == month)
    {            
        yield day;
        day = day.nextDate();
    }        
}

Date.nthDayOfMonth = function(count, day, month, year = new Date().year, name = "")
{
    if (!count) throw "count not specified";
    if (!day) throw "day not specified";
    if ( !(month >= 0 || month <= 11)) throw "invalid month not specified";        
    let counter = 0;
    for (var date of Date.daysInMonth(year, month))
    {
        if (date.weekDay == Date.WEEKDAYS[day]) counter++;
        if (counter == count) 
        {
            date.label = name;
            return date
        }
    }        
}

Date.lastDayOfMonth = function(day, month, year = new Date().year, name = "")
{
    if (!day) throw "day not specified";
    if (!month) throw "month not specified";
    let list = [];
    for (var date of Date.daysInMonth(year, month))
    {
        if (date.weekDay == Date.WEEKDAYS[day]) list.push(date);            
    }
    let newDate = list.pop();
    newDate.label = name;
    return newDate;
}

Date.findSetHoliday = function(month, date, year = new Date().year, name = "")
{
    if (!month) throw "month not specified";
    if (!date) throw "date not specified";        
    let holiday = new Date(year, month, date);
    if (holiday.getDay() == Date.SATURDAY)
    {
        holiday = holiday.nextDate(-1);            
    }
    else if (holiday.getDay() == Date.SUNDAY)
    {
        holiday = holiday.nextDate();
    }
    holiday.label = name;
    return holiday; 
}

Date.NewYears = function(year = new Date().year)
{
    let newDate = new Date(year, Date.JANUARY, 1);
    newDate.label = "New Year's Day"
    return newDate;
}

Date.NewYearsEve = function(year = new Date().year)
{
    let newDate = new Date(year, Date.DECEMBER, 31);        
    newDate.label = "New Year's Eve"
    return newDate;
}

Date.getFederalHolidays = function(startDate = Date.NewYears())
{
    /*  
        Holidays for Federal Employees
        https://www.opm.gov/policy-data-oversight/pay-leave/pay-administration/fact-sheets/holidays-work-schedules-and-pay/
        
        New Year's Day (January 1).
        Birthday of Martin Luther King, Jr. (Third Monday in January).
        Washington's Birthday (Third Monday in February).
        Memorial Day (Last Monday in May).
        Juneteenth National Independence Day (June 19).
        Independence Day (July 4).
        Labor Day (First Monday in September).
        Columbus Day (Second Monday in October).
        Veterans Day (November 11).
        Thanksgiving Day (Fourth Thursday in November).
        Christmas Day (December 25).
    */

    let calendarYear = (month) => 
    {
        if (month < startDate.getMonth()) 
            return startDate.getFullYear() + 1;
        else
            return startDate.getFullYear();
    }

    return [
        Date.NewYears( calendarYear( Date.JANUARY )),
        Date.nthDayOfMonth( 3, Date.MONDAY, Date.JANUARY, calendarYear(Date.JANUARY), "Martin Luther King's Birthday"),
        Date.nthDayOfMonth( 3, Date.MONDAY, Date.FEBRUARY, calendarYear(Date.FEBRUARY), "President's Day"),
        Date.lastDayOfMonth( Date.MONDAY, Date.MAY, calendarYear(Date.MAY), "Memorial Day"),
        Date.findSetHoliday( Date.JULY, 4, calendarYear(Date.JULY), "Independence Day"),
        Date.nthDayOfMonth( 1, Date.MONDAY, Date.SEPTEMBER, calendarYear(Date.SEPTEMBER), "Labor Day"),
        Date.nthDayOfMonth( 2, Date.MONDAY, Date.OCTOBER, calendarYear(Date.OCTOBER), "Columbus Day"),
        Date.findSetHoliday( Date.NOVEMBER,11, calendarYear(Date.NOVEMBER), "Veteran's Day"),
        Date.nthDayOfMonth( 4, Date.THURSDAY, Date.NOVEMBER, calendarYear(Date.NOVEMBER), "Thanksgiving Day"),
        Date.findSetHoliday( Date.DECEMBER, 25, calendarYear(Date.DECEMBER), "Christmas Day")
    ];
}

Date.getDaysOffset = function(start, end)
{
    return Math.round( (end - start) / Date.DAY );
}


Date.prototype.addDaysOffset = function(days)
{        
    return new Date(this).nextDate(days);        
}

Date.prototype.getMonthStr = function()
{        
    return Date.MONTHS[this.getMonth()];
}

Date.toISODateStr = function(d)
{        
    return d.toISOString().split('T')[0];
}

Date.prototype.toISODateStr = function()
{        
    return Date.toISODateStr(this);
}

Date.toISODate = function(d)
{        
    return d.toISOString().split('T')[0].replace(/-/g,'');        
}

Date.prototype.toISODate = function()
{        
    return Date.toISODate(this);
}

Date.fromISODate = function(str)
{        
    var newDate = new Date();
    if (!str || str == "" || str.length < 4) throw "invalid ISO date";
    
    let year = str.substr(0,4);
    try 
    {
        newDate = new Date(year, Date.JANUARY,1);
        if (str.length > 4)
        {
            let month = parseInt(str.substr(4,2))-1;
            newDate.setMonth(month);
        }            
        if (str.length == 8)
        {
            let date = str.substr(6,2);
            newDate.setDate(date);
        }
    }
    catch (e)
    {
        throw "failed to convert ISO date to Date object";
    }
    return newDate;
}

Date.MonthDropDown = function(elementId, selectedIndex, onChangeFunction)
{
    configureElement(elementId, (dropDown) =>
    {
        Date.MONTHS.forEach( (month, index) =>
        {            
            let newMonth = document.createElement("option");
            newMonth.value = index;
            newMonth.text = month;
            newMonth.classList.add("month_choice");
            dropDown.appendChild(newMonth);
        });   
        dropDown.selectedIndex = selectedIndex;

        dropDown.onchange = onChangeFunction;
    });
}

Date.getFirstSunday = function(year)
{
    let start = Date.NewYears(year);
    if (start.isSunday)
        return new Date(start);
    else
    {
        let offset = start.getDay();
        let sunday = start.nextDate(7-offset);
        return new Date(sunday);
    }
}

Date.getFirstSaturday = function(year)
{
    return Date.getFirstSunday(year).nextDate(-1);
}

Date.getSundays = function(year)
{
    let sundays = [];
    let date = Date.getFirstSunday(year);
    while (date.year == year)
    {
        sundays.push(date);
        date = date.nextDate(7);
    }
    return sundays;
}

Date.getSaturdays = function(year)
{
    let saturdays = [];
    let date = Date.getFirstSaturday(year);
    while (date.year == year)
    {
        saturdays.push(date);
        date = date.nextDate(7);
    }
    return saturdays;
}

Date.getWeek = function(someDate)
{
    let d = new Date(someDate);
    let weeks = Date.getSaturdays(d.getFullYear());
    for (var i=0; i<weeks.length; i++)
    {
        if (d <= weeks[i])
            return i;
    }
    return 52;
}

Date.getPayPeriod = function(someDate)
{
    let weekNumber = Date.getWeek(someDate);
    this.debug("Date.getPayPeriod:", someDate, weekNumber);
    if (weekNumber < 1) return 0;
    if (weekNumber % 2 == 1) weekNumber += 1;
    return weekNumber / 2;
}

Date.getNearestHoliday = function()
{
    var dateList = [];
    var today = new Date(Date.now());
    today.label = "Today";
    dateList.push(today);
    Date.getFederalHolidays().forEach((holiday) => {
        dateList.push(holiday);
    }); 
    dateList.sort((a,b) => a.valueOf() - b.valueOf()); 
    console.log("getNearestHoliday:", dateList);
    var todaysIndex = dateList.map(day => day.label).indexOf('Today');
    if (todaysIndex == dateList.length-1) {
        todaysIndex = -1
    } 
    return dateList[todaysIndex + 1]
}

    