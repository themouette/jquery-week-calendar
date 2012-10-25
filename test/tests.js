module('jQuery Week Calendar v2.0-dev');
function formatTimeZone() {
  var TZ = -(new Date('Apr 21 2011')).getTimezoneOffset();
  var TZ = {
    'sign': (TZ < 0 ? '-' : '+'),
    'hour': (Math.floor(TZ / 60)),
    'minute': (TZ % 60)};

  return TZ['sign'] + (TZ['hour'] < 10 ? '0' : '') + TZ['hour'] + ':' + (TZ['minute'] < 10 ? '0' : '') + TZ['minute'];
}

test('Default Options', function() {

    var $calendar = $('#calendar');
    $calendar.weekCalendar();

    expect(30);

    deepEqual($calendar.weekCalendar('option', 'alwaysDisplayTimeMinutes'), true);
    deepEqual($calendar.weekCalendar('option', 'use24Hour'), false);
    deepEqual($calendar.weekCalendar('option', 'firstDayOfWeek')(), 0);
    deepEqual($calendar.weekCalendar('option', 'daysToShow'), 7);
    deepEqual($calendar.weekCalendar('option', 'minBodyHeight'), 100);
    deepEqual($calendar.weekCalendar('option', 'useShortDayNames'), false);
    deepEqual($calendar.weekCalendar('option', 'timeSeparator'), ' to ');
    deepEqual($calendar.weekCalendar('option', 'startParam'), 'start');
    deepEqual($calendar.weekCalendar('option', 'endParam'), 'end');
    deepEqual($calendar.weekCalendar('option', 'businessHours').start, 8);
    deepEqual($calendar.weekCalendar('option', 'businessHours').end, 18);
    deepEqual($calendar.weekCalendar('option', 'businessHours').limitDisplay, false);
    deepEqual($calendar.weekCalendar('option', 'newEventText'), 'New Event');
    deepEqual($calendar.weekCalendar('option', 'timeslotHeight'), 20);
    deepEqual($calendar.weekCalendar('option', 'defaultEventLength'), 2);
    deepEqual($calendar.weekCalendar('option', 'timeslotsPerHour'), 4);
    deepEqual($calendar.weekCalendar('option', 'minDate'), null);
    deepEqual($calendar.weekCalendar('option', 'maxDate'), null);
    deepEqual($calendar.weekCalendar('option', 'buttons'), true);
    deepEqual($calendar.weekCalendar('option', 'scrollToHourMillis'), 500);
    deepEqual($calendar.weekCalendar('option', 'allowCalEventOverlap'), false);
    deepEqual($calendar.weekCalendar('option', 'overlapEventsSeparate'), false);
    deepEqual($calendar.weekCalendar('option', 'readonly'), false);
    deepEqual($calendar.weekCalendar('option', 'allowEventCreation'), true);

    deepEqual($calendar.weekCalendar('option', 'displayOddEven'), false);
    deepEqual($calendar.weekCalendar('option', 'textSize'), 13);
    deepEqual($calendar.weekCalendar('option', 'headerSeparator'), '<br />');
    deepEqual($calendar.weekCalendar('option', 'getHeaderDate'), null);
    deepEqual($calendar.weekCalendar('option', 'preventDragOnEventCreation'), false);

    deepEqual($calendar.weekCalendar('option', 'draggable')(), true);

});

test('date parsing', function() {
  var $calendar = $('#calendar');
  $calendar.weekCalendar();

  expect(15);

  var _cleanDate = $.proxy($calendar.data('weekCalendar'), '_cleanDate'),
      _curdate,
      testData = [
        {value: new Date('Fri Jul 16 2010 14:15:00'), expected: new Date('Fri Jul 16 2010 14:15:00').getTime()},
        {value: 1276683300000, expected: 1276683300000},
        {value: '1276683300000', expected: 1276683300000},
        {value: '2010-06-16T12:15:00+02:00', expected: 1276683300000},
        {value: '2010-06-16T12:15:00.000+02:00', expected: 1276683300000},
        {value: 'Wed Jun 16 2010 12:15:00 GMT+0200', expected: 1276683300000},
        {value: '2010-06-16T12:15', expected: 1276683300000},
      ];

  ok($.isFunction($calendar.data('weekCalendar')._cleanDate), 'check _cleanDate is a function');

  $(testData).each(function(i, item) {
    _curdate = $calendar.data('weekCalendar')._cleanDate(item.value);
    ok(_curdate instanceof Date, 'Case ' + i + ': "_cleanDate" returns a Date instance');
    equal(_curdate.getTime(), item.expected, 'Case ' + i + ': The returned date is correct.');
  });
});

test('Date internationalization', function() {

  var $calendar = $('#calendar');
  $calendar.weekCalendar({
      date: new Date('Apr 21 2011'),
      firstDayOfWeek: $.datepicker.regional['fr'].firstDay,
      shortDays: $.datepicker.regional['fr'].dayNamesShort,
      longDays: $.datepicker.regional['fr'].dayNames,
      shortMonths: $.datepicker.regional['fr'].monthNamesShort,
      longMonths: $.datepicker.regional['fr'].monthNames,
      dateFormat: 'd F y'
    });

  expect(53);

  // default format
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 20 2011 14:50:32 GMT+0200')), '20 Avril 11');
  // force format
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 20 2011 14:50:32 GMT+0200'), 'l j M Y'), 'Mercredi 20 Avril 2011');


  //Barbarian test
  $calendar.weekCalendar('option', {
                              dateFormat: 'd D j l N S w F m M n t Y y a A g G h H i s O P Z r U',
                              firstDayOfWeek: $.datepicker.regional['en-GB'].firstDay,
                              shortDays: $.datepicker.regional['en-GB'].dayNamesShort,
                              longDays: $.datepicker.regional['en-GB'].dayNames,
                              shortMonths: $.datepicker.regional['en-GB'].monthNamesShort,
                              longMonths: $.datepicker.regional['en-GB'].monthNames
                          });
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200')), '01 Fri 1 Friday 5 st 5 April 04 Apr 4 30 2011 11 pm PM 2 14 02 14 50 32 +0200 +02:00 7200 Fri, 01 Apr 2011 14:50:32 +0200 1301662232');

//Day

  //test 'd' - 01 to 31 Day
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'd'), '01');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 10 2011 14:50:32 GMT+0200'), 'd'), '10');

  //test 'j' - 1 to 31 Day
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'j'), '1');

  //test 'D' Three letter Day
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'D'), 'Fri');

  //test 'l' - Full Text Day
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'l'), 'Friday');

  //test 'N' - number of the day in the week
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 18 2011 14:50:32 GMT+0200'), 'N'), '1');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 19 2011 14:50:32 GMT+0200'), 'N'), '2');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 20 2011 14:50:32 GMT+0200'), 'N'), '3');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 21 2011 14:50:32 GMT+0200'), 'N'), '4');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 22 2011 14:50:32 GMT+0200'), 'N'), '5');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 23 2011 14:50:32 GMT+0200'), 'N'), '6');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 24 2011 14:50:32 GMT+0200'), 'N'), '7');

  //test 'S' - Ordinal suffix
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'S'), 'st');

  //test 'w' - Numeric representation
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 18 2011 14:50:32 GMT+0200'), 'w'), '1');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 19 2011 14:50:32 GMT+0200'), 'w'), '2');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 20 2011 14:50:32 GMT+0200'), 'w'), '3');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 21 2011 14:50:32 GMT+0200'), 'w'), '4');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 22 2011 14:50:32 GMT+0200'), 'w'), '5');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 23 2011 14:50:32 GMT+0200'), 'w'), '6');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 24 2011 14:50:32 GMT+0200'), 'w'), '0');

//Month

  //test 'F' - Full Text
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'F'), 'April');

  //test 'm' - 01 to 12
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'm'), '04');

  //test 'M' -Three letter
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'M'), 'Apr');

  //test 'n' - 1 to 12
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'n'), '4');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Nov 01 2011 14:50:32 GMT+0200'), 'n'), '11');

  //test 't' -number of the day in month
    deepEqual($calendar.weekCalendar('formatDate', new Date('Feb 01 2011 14:50:32 GMT+0200'), 't'), '28');
    deepEqual($calendar.weekCalendar('formatDate', new Date('Feb 01 1900 14:50:32 GMT+0200'), 't'), '28');
    deepEqual($calendar.weekCalendar('formatDate', new Date('Feb 01 2000 14:50:32 GMT+0200'), 't'), '29');
    deepEqual($calendar.weekCalendar('formatDate', new Date('Feb 01 2004 14:50:32 GMT+0200'), 't'), '29');
    deepEqual($calendar.weekCalendar('formatDate', new Date('Jun 01 2011 14:50:32 GMT+0200'), 't'), '30');
    deepEqual($calendar.weekCalendar('formatDate', new Date('May 01 2011 14:50:32 GMT+0200'), 't'), '31');


//Year

  //test 'Y' - full Year
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'Y'), '2011');

  //test 'y' - short Year
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'y'), '11');

//Time
  //test 'a' - am or pm
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'a'), 'pm');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 11:50:32 GMT+0200'), 'a'), 'am');


  //test 'A' - AM or PM
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'A'), 'PM');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 11:50:32 GMT+0200'), 'A'), 'AM');

  //test 'g' and 'G' - 12h&24 format-(1 to 12) and (0 to 23)
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'g'), '2');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'G'), '14');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 00:50:32 GMT+0200'), 'G'), '0');

  //test 'h' and 'H' - 12h&24 format-(01 to 12) and (00 to 23)
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'h'), '02');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'H'), '14');
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 00:50:32 GMT+0200'), 'H'), '00');

  //test 'i' - minute (00 to 59)
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:00:32 GMT+0200'), 'i'), '00');

  //test 's' - sec (00 to 59)
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:00:32 GMT+0200'), 's'), '32');

//Timezone
  //test 'O' - Greenwitch difference (+0200)
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:00:32 GMT+0200'), 'O'), '+0200');

  //test 'P' - Greenwitch difference (+02:00)
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:00:32 GMT+0200'), 'P'), '+02:00');

  //test 'Z' - Greenwitch difference in sec (+0200)
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:00:32 GMT+0200'), 'Z'), '7200');

//FullTime

  //test 'r' - RFC2822 : Thu, 21 Dec 2000 16:01:07 +0200
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:51:32 GMT+0200'), 'r'), 'Fri, 01 Apr 2011 14:51:32 +0200');

  //test 'U'- TimeStamp (since 1/1/1970)
  deepEqual($calendar.weekCalendar('formatDate', new Date('Apr 01 2011 14:50:32 GMT+0200'), 'U'), '1301662232');

});

test("issue # 60: eventHeader doesn't take care of use24Hour option", function() {
  var $calendar = $('#calendar');
  $calendar.weekCalendar({
    'use24Hour': false,
    'timeSeparator': ' -> '
  });
  //get local timezone:
  var TZ = formatTimeZone();

  expect(5);
  var _events = [{
      'id': 1,
      'start': '2009-05-10T13:15:00' + TZ,
      'end': '2009-05-10T14:15:00' + TZ,
      'title': 'Lunch with Mike'}, {
      'id': 1,
      'start': '2009-05-10T10:15:00' + TZ,
      'end': '2009-05-10T12:15:00' + TZ,
      'title': 'Lunch with Mike'}
      ];
  // trick to call private function
  var _privateWeekCalendar = $calendar.data('weekCalendar');
  _events = _privateWeekCalendar._cleanEvents.call(_privateWeekCalendar, _events);

  var eventHeaderFunc = $calendar.weekCalendar('option', 'eventHeader');

  ok($.isFunction(eventHeaderFunc), 'check eventHeader is a function');

  // test without use24Hour option
  deepEqual(eventHeaderFunc(_events[0], $calendar), '01:15 pm -> 02:15 pm');
  deepEqual(eventHeaderFunc(_events[1], $calendar), '10:15 am -> 12:15 pm');

  // now force use24Hour to true
  $calendar.weekCalendar('option', 'use24Hour', true);

  deepEqual(eventHeaderFunc(_events[0], $calendar), '13:15 -> 14:15');
  deepEqual(eventHeaderFunc(_events[1], $calendar), '10:15 -> 12:15');

  //check for title when

});
//Test date Last|First Day|Milli OfWeek()
test('issue #49: wrong calculation of DateLastMilliOfWeek', function() {
  var $calendar = $('#calendar');
  $calendar.weekCalendar({
    date: new Date('Apr 21 2011'),
    daysToShow: 7,
    firstDayOfWeek: 1,
    startOnFirstDayOfWeek: true
  });

  var TZ = formatTimeZone();

  expect(30);

  var _events = [{
      'id': 1,
      'start': '2009-05-10T13:15:00' + TZ,
      'end': '2009-05-10T14:15:00' + TZ,
      'title': 'Lunch with Mike'}, {
      'id': 1,
      'start': '2009-05-10T10:15:00' + TZ,
      'end': '2009-05-10T12:15:00' + TZ,
      'title': 'Lunch with Mike'}
      ];

  var _privateInstance = $calendar.data('weekCalendar');
  ok($.isFunction(_privateInstance._dateLastDayOfWeek), 'check _dateLastDayOfWeek is a function');
  ok($.isFunction(_privateInstance._dateFirstDayOfWeek), 'check _dateFirstDayOfWeek is a function');
  ok($.isFunction(_privateInstance._dateLastMilliOfWeek), 'check _dateLastMilliOfWeek is a function');

  // create a closure to ease testing
  var _dateLastDayOfWeek = function() {return _privateInstance._dateLastDayOfWeek.apply(_privateInstance, arguments);};
  var _dateFirstDayOfWeek = function() {return _privateInstance._dateFirstDayOfWeek.apply(_privateInstance, arguments);};
  var _dateLastMilliOfWeek = function() {return _privateInstance._dateLastMilliOfWeek.apply(_privateInstance, arguments);};
  var _curDate, date;

  _curDate = _dateFirstDayOfWeek(new Date('Apr 21 2011'));
  ok(_curDate instanceof Date, '_dateFirstDayOfWeek returns a date');
  equals(_curDate.toString(), (new Date('Apr 18 2011')).toString(), '_dateFirstDayOfWeek returns monday');

  _curDate = _dateLastDayOfWeek(new Date('Apr 21 2011'));
  ok(_curDate instanceof Date, '_dateLastDayOfWeek returns a date');
  equals(_curDate.toString(), (new Date('Apr 24 2011')).toString(), '_dateLastDayOfWeek returns sunday');

  _curDate = _dateLastMilliOfWeek(new Date('Apr 21 2011'));

  ok(_curDate instanceof Date, '_dateLastMilliOfWeek returns a date');
  equals(_curDate.toString(), (new Date('Apr 25 2011 00:00:00')).toString(), '_dateLastMilliOfWeek returns next monday midnight');

  //change firstDayOvWeek to sunday
  $calendar.weekCalendar('option', 'firstDayOfWeek', 0);

  //Middle of month
  _curDate = _dateFirstDayOfWeek(new Date('Apr 21 2011'));
  equals(_curDate.toString(), (new Date('Apr 17 2011')).toString(), '_dateFirstDayOfWeek returns sunday');

  _curDate = _dateLastDayOfWeek(new Date('Apr 21 2011'));
  equals(_curDate.toString(), (new Date('Apr 23 2011')).toString(), '_dateLastDayOfWeek returns monday');

  _curDate = _dateLastMilliOfWeek(new Date('Apr 21 2011'));
  equals(_curDate.toString(), (new Date('Apr 24 2011 00:00:00')).toString(), '_dateLastMilliOfWeek returns next sunday midnight');

  // case date for start of mont
  _curDate = _dateFirstDayOfWeek(new Date('Apr 01 2011'));
  equals(_curDate.toString(), (new Date('Mar 27 2011')).toString(), '_dateFirstDayOfWeek returns sunday 27 Mar');

  _curDate = _dateLastDayOfWeek(new Date('Apr 01 2011'));
  equals(_curDate.toString(), (new Date('Apr 2 2011')).toString(), '_dateLastDayOfWeek returns Sat 2 APr');

  _curDate = _dateLastMilliOfWeek(new Date('Apr 01 2011'));
  equals(_curDate.toString(), (new Date('Apr 03 2011 00:00:00')).toString(), '_dateLastMilliOfWeek returns next sunday midnight 3 Apr ');


  //change firstDayOvWeek to monday
  $calendar.weekCalendar('option', 'firstDayOfWeek', 1);

  // case date for end of month
  _curDate = _dateFirstDayOfWeek(new Date('Apr 30 2011'));
  equals(_curDate.toString(), (new Date('Apr 25 2011')).toString(), '_dateFirstDayOfWeek returns monday 25');

  _curDate = _dateLastDayOfWeek(new Date('Apr 30 2011'));
  equals(_curDate.toString(), (new Date('May 01 2011')).toString(), '_dateLastDayOfWeek returns Sun 1');

  _curDate = _dateLastMilliOfWeek(new Date('Apr 30 2011'));
  equals(_curDate.toString(), (new Date('May 02 2011 00:00:00')).toString(), '_dateLastMilliOfWeek returns next monday midnight 2');

  //change firstDayOvWeek to sunday
  $calendar.weekCalendar('option', 'firstDayOfWeek', 0);

  // case date for end of week
  _curDate = _dateFirstDayOfWeek(new Date('Apr 23 2011'));
  equals(_curDate.toString(), (new Date('Apr 17 2011')).toString(), '_dateFirstDayOfWeek returns sunday 17');

  _curDate = _dateLastDayOfWeek(new Date('Apr 23 2011'));
  equals(_curDate.toString(), (new Date('Apr 23 2011')).toString(), '_dateLastDayOfWeek returns Saturday  23');

  _curDate = _dateLastMilliOfWeek(new Date('Apr 23 2011'));
  equals(_curDate.toString(), (new Date('Apr 24 2011 00:00:00')).toString(), '_dateLastMilliOfWeek returns next sunday midnight 24');


  // case date in february leap year
  _curDate = _dateFirstDayOfWeek(new Date('Mar 01 2000'));
  equals(_curDate.toString(), (new Date('Feb 27 2000')).toString(), '_dateFirstDayOfWeek returns sunday 27');

  _curDate = _dateLastDayOfWeek(new Date('Mar 01 2000'));
  equals(_curDate.toString(), (new Date('Mar 04 2000')).toString(), '_dateLastDayOfWeek returns monday 4 ');

  _curDate = _dateLastMilliOfWeek(new Date('Mar 01 2000'));
  equals(_curDate.toString(), (new Date('Mar 05 2000 00:00:00')).toString(), '_dateLastMilliOfWeek returns next sunday midnight 5');

  //change firstDayOvWeek to monday
  $calendar.weekCalendar('option', 'firstDayOfWeek', 1);

  // case daylight saving +
  date = new Date('Mar 22 2011');
  _curDate = _dateFirstDayOfWeek(date);
  equals(_curDate.toString(), (new Date('Mar 21 2011')).toString(), '_dateFirstDayOfWeek returns monday 21');

  _curDate = _dateLastDayOfWeek(date);
  equals(_curDate.toString(), (new Date('Mar 27 2011')).toString(), '_dateLastDayOfWeek returns sunday 27');

  _curDate = _dateLastMilliOfWeek(date);
  equals(_curDate.toString(), (new Date('Mar 28 2011 00:00:00')).toString(), '_dateLastMilliOfWeek returns next monday midnight 28');


  // case daylight saving -
  date = new Date('Oct 26 2011');
  _curDate = _dateFirstDayOfWeek(date);
  equals(_curDate.toString(), (new Date('Oct 24 2011')).toString(), '_dateFirstDayOfWeek returns monday 24');

  _curDate = _dateLastDayOfWeek(date);
  equals(_curDate.toString(), (new Date('Oct 30 2011')).toString(), '_dateLastDayOfWeek returns sunday 30 ');

  _curDate = _dateLastMilliOfWeek(date);
  equals(_curDate.toString(), (new Date('Oct 31 2011 00:00:00')).toString(), '_dateLastMilliOfWeek returns next monday midnight 31');


});
