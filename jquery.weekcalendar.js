/*
 * jQuery.weekCalendar v2.0-dev
 *
 * for support join us at the google group:
 *    - http://groups.google.com/group/jquery-week-calendar
 * have a look to the wiki for documentation:
 *    - http://wiki.github.com/themouette/jquery-week-calendar/
 * something went bad ? report an issue:
 *    - http://github.com/themouette/jquery-week-calendar/issues
 * get the last version on github:
 *    - http://github.com/themouette/jquery-week-calendar
 *
 * Copyright (c) 2009 Rob Monie
 * Copyright (c) 2010 Julien MUETTON
 * Dual licensed under the MIT and GPL licenses:
 *    http://www.opensource.org/licenses/mit-license.php
 *    http://www.gnu.org/licenses/gpl.html
 *
 * If you're after a monthly calendar plugin, check out this one :
 * http://arshaw.com/fullcalendar/
 */

(function($) {
  // check the jquery version
  var _v = $.fn.jquery.split('.'),
      _jQuery14OrLower = (10 * _v[0] + _v[1]) < 15;

  $.widget('ui.weekCalendar', (function() {
    var _currentAjaxCall, _hourLineTimeout;

    return {
      options: {
        date: new Date(),
        timeFormat: null,
        dateFormat: 'M d, Y',
        alwaysDisplayTimeMinutes: true,
        use24Hour: false,
        daysToShow: 7,
        minBodyHeight: 100,
        firstDayOfWeek: function(calendar) {
                  if ($(calendar).weekCalendar('option', 'daysToShow') != 5) {
                    return 0;
                  } else {
                    //workweek
                    return 1;
                  }
              }, // 0 = Sunday, 1 = Monday, 2 = Tuesday, ... , 6 = Saturday
        useShortDayNames: false,
        timeSeparator: ' to ',
        startParam: 'start',
        endParam: 'end',
        businessHours: {start: 8, end: 18, limitDisplay: false},
        newEventText: 'New Event',
        timeslotHeight: 20,
        defaultEventLength: 2,
        timeslotsPerHour: 4,
        minDate: null,
        maxDate: null,
        showHeader: true,
        buttons: true,
        buttonText: {
          today: 'today',
          lastWeek: 'previous',
          nextWeek: 'next'
        },
        switchDisplay: {},
        scrollToHourMillis: 500,
        allowEventDelete: false,
        allowCalEventOverlap: false,
        overlapEventsSeparate: false,
        totalEventsWidthPercentInOneColumn: 100,
        readonly: false,
        allowEventCreation: true,
        hourLine: false,
        deletable: function(calEvent, element) {
          return true;
        },
        draggable: function(calEvent, element) {
          return true;
        },
        resizable: function(calEvent, element) {
          return true;
        },
        eventClick: function(calEvent, element, dayFreeBusyManager, 
                                                      calendar, clickEvent) {
        },
        eventRender: function(calEvent, element) {
          return element;
        },
        eventAfterRender: function(calEvent, element) {
          return element;
        },
        eventRefresh: function(calEvent, element) {
          return element;
        },
        eventDrag: function(calEvent, element) {
        },
        eventDrop: function(calEvent, element) {
        },
        eventResize: function(calEvent, element) {
        },
        eventNew: function(calEvent, element, dayFreeBusyManager, 
                                                    calendar, mouseupEvent) {
        },
        eventMouseover: function(calEvent, $event) {
        },
        eventMouseout: function(calEvent, $event) {
        },
        eventDelete: function(calEvent, element, dayFreeBusyManager, 
                                                      calendar, clickEvent) {
            calendar.weekCalendar('removeEvent',calEvent.id);
	},
        calendarBeforeLoad: function(calendar) {
        },
        calendarAfterLoad: function(calendar) {
        },
        noEvents: function() {
        },
        eventHeader: function(calEvent, calendar) {
          var options = calendar.weekCalendar('option');
          var one_hour = 3600000;
          var displayTitleWithTime = calEvent.end.getTime() - calEvent.start.getTime() <= (one_hour / options.timeslotsPerHour);
          if (displayTitleWithTime) {
            return calendar.weekCalendar(
                        'formatTime', calEvent.start) +
                        ': ' + calEvent.title;
          } else {
            return calendar.weekCalendar(
                        'formatTime', calEvent.start) +
                    options.timeSeparator +
                    calendar.weekCalendar(
                        'formatTime', calEvent.end);
          }
        },
        eventBody: function(calEvent, calendar) {
          return calEvent.title;
        },
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        /* multi-users options */
        /**
         * the available users for calendar.
         * if you want to display users separately, enable the
         * showAsSeparateUsers option.
         * if you provide a list of user and do not enable showAsSeparateUsers
         * option, then only the events that belongs to one or several of
         * given users will be displayed
         * @type {array}
         */
        users: [],
        /**
         * should the calendar be displayed with separate column for each
         * users.
         * note that this option does nothing if you do not provide at least
         * one user.
         * @type {boolean}
         */
        showAsSeparateUsers: true,
        /**
         * callback used to read user id from a user object.
         * @param {Object} user the user to retrieve the id from.
         * @param {number} index the user index from user list.
         * @param {jQuery} calendar the calendar object.
         * @return {int|String} the user id.
         */
        getUserId: function(user, index, calendar) {
          return index;
        },
        /**
         * callback used to read user name from a user object.
         * @param {Object} user the user to retrieve the name from.
         * @param {number} index the user index from user list.
         * @param {jQuery} calendar the calendar object.
         * @return {String} the user name.
         */
        getUserName: function(user, index, calendar) {
          return user;
        },
        /**
         * reads the id(s) of user(s) for who the event should be displayed.
         * @param {Object} calEvent the calEvent to read informations from.
         * @param {jQuery} calendar the calendar object.
         * @return {number|String|Array} the user id(s) to appened events for.
         */
        getEventUserId: function(calEvent, calendar) {
          return calEvent.userId;
        },
        /**
         * sets user id(s) to the calEvent
         * @param {Object} calEvent the calEvent to set informations to.
         * @param {jQuery} calendar the calendar object.
         * @return {Object} the calEvent with modified user id.
         */
        setEventUserId: function(userId, calEvent, calendar) {
          calEvent.userId = userId;
          return calEvent;
        },
        /* freeBusy options */
        /**
         * should the calendar display freebusys ?
         * @type {boolean}
         */
        displayFreeBusys: false,
        /**
         * read the id(s) for who the freebusy is available
         * @param {Object} calEvent the calEvent to read informations from.
         * @param {jQuery} calendar the calendar object.
         * @return {number|String|Array} the user id(s) to appened events for.
         */
        getFreeBusyUserId: function(calFreeBusy, calendar) {
          return calFreeBusy.userId;
        },
        /**
         * the default freeBusy object, used to manage default state
         * @type {Object}
         */
        defaultFreeBusy: {free: false},
        /**
         * function used to display the freeBusy element
         * @type {Function}
         * @param {Object} freeBusy the freeBusy timeslot to render.
         * @param {jQuery} $freeBusy the freeBusy HTML element.
         * @param {jQuery} calendar the calendar element.
         */
        freeBusyRender: function(freeBusy, $freeBusy, calendar) {
          if (!freeBusy.free) {
            $freeBusy.addClass('free-busy-busy');
          }
          else {
            $freeBusy.addClass('free-busy-free');
          }
          return $freeBusy;
        },
        /* other options */
        /**
         * true means start on first day of week, false means starts on
         * startDate.
         * @param {jQuery} calendar the calendar object.
         * @type {Function|bool}
         */
        startOnFirstDayOfWeek: function(calendar) {
          return $(calendar).weekCalendar('option', 'daysToShow') >= 5;
        },
        /**
         * should the columns be rendered alternatively using odd/even
         * class
         * @type {boolean}
         */
        displayOddEven: false,
        textSize: 13,
        /**
         * the title attribute for the calendar. possible placeholders are:
         * <ul>
         *  <li>%start%</li>
         *  <li>%end%</li>
         *  <li>%date%</li>
         * </ul>
         * @type {Function|string}
         * @param {number} option daysToShow.
         * @return {String} the title attribute for the calendar.
         */
        title: '%start% - %end%',
        /**
         * default options to pass to callback
         * you can pass a function returning an object or a litteral object
         * @type {object|function(#calendar)}
         */
        jsonOptions: {},
        headerSeparator: '<br />',
        /**
          * returns formatted header for day display
          * @type {function(date,calendar)}
          */
        getHeaderDate: null,
        preventDragOnEventCreation: false,
        /**
          * the event on which to bind calendar resize
          * @type {string}
          */
        resizeEvent: 'resize.weekcalendar'
      },

      /***********************
       * Initialise calendar *
       ***********************/
      _create: function() {
        var self = this;
        self._computeOptions();
        self._setupEventDelegation();
        self._renderCalendar();
        self._loadCalEvents();
        self._resizeCalendar();
        self._scrollToHour(self.options.date.getHours(), true);

        if (this.options.resizeEvent) {
          $(window).unbind(this.options.resizeEvent);
          $(window).bind(this.options.resizeEvent, function() {
            self._resizeCalendar();
          });
        }

      },

      /********************
       * public functions *
       ********************/
      /*
       * Refresh the events for the currently displayed week.
       */
      refresh: function() {
        //reload with existing week
        this._loadCalEvents(this.element.data('startDate'));
      },

      /*
       * Clear all events currently loaded into the calendar
       */
      clear: function() {
        this._clearCalendar();
      },

      /*
       * Go to this week
       */
      today: function() {
        this._clearCalendar();
        this._loadCalEvents(new Date());
      },

      /*
       * Go to the previous week relative to the currently displayed week
       */
      prevWeek: function() {
        //minus more than 1 day to be sure we're in previous week - account for daylight savings or other anomolies
        var newDate = new Date(this.element.data('startDate').getTime() - (MILLIS_IN_WEEK / 6));
        this._clearCalendar();
        this._loadCalEvents(newDate);
      },

      /*
        * Go to the next week relative to the currently displayed week
        */
      nextWeek: function() {
          //add 8 days to be sure of being in prev week - allows for daylight savings or other anomolies
          var newDate = new Date(this.element.data('startDate').getTime() + MILLIS_IN_WEEK + MILLIS_IN_DAY);
          this._clearCalendar();
          this._loadCalEvents(newDate);
      },

      /*
        * Reload the calendar to whatever week the date passed in falls on.
        */
      gotoWeek: function(date) {
          this._clearCalendar();
          this._loadCalEvents(date);
      },

      /*
        * Reload the calendar to whatever week the date passed in falls on.
        */
      gotoDate: function(date) {
          this._clearCalendar();
          this._loadCalEvents(date);
      },

      /**
        * change the number of days to show
        */
      setDaysToShow: function(daysToShow) {
          var self = this;
          var hour = self._getCurrentScrollHour();
          self.options.daysToShow = daysToShow;
          $(self.element).html('');
          self._renderCalendar();
          self._loadCalEvents();
          self._resizeCalendar();
          self._scrollToHour(hour, false);

          if (this.options.resizeEvent) {
            $(window).unbind(this.options.resizeEvent);
            $(window).bind(this.options.resizeEvent, function() {
              self._resizeCalendar();
            });
        }
      },

      /*
        * Remove an event based on it's id
        */
      removeEvent: function(eventId) {

          var self = this;

          self.element.find('.wc-cal-event').each(function() {
            if ($(this).data('calEvent').id === eventId) {
                $(this).remove();
                return false;
            }
          });

          //this could be more efficient rather than running on all days regardless...
          self.element.find('.wc-day-column-inner').each(function() {
            self._adjustOverlappingEvents($(this));
          });
      },

      /*
        * Removes any events that have been added but not yet saved (have no id).
        * This is useful to call after adding a freshly saved new event.
        */
      removeUnsavedEvents: function() {

          var self = this;

          self.element.find('.wc-new-cal-event').each(function() {
            $(this).remove();
          });

          //this could be more efficient rather than running on all days regardless...
          self.element.find('.wc-day-column-inner').each(function() {
            self._adjustOverlappingEvents($(this));
          });
      },

      /*
        * update an event in the calendar. If the event exists it refreshes
        * it's rendering. If it's a new event that does not exist in the calendar
        * it will be added.
        */
      updateEvent: function(calEvent) {
          this._updateEventInCalendar(calEvent);
      },

      /*
        * Returns an array of timeslot start and end times based on
        * the configured grid of the calendar. Returns in both date and
        * formatted time based on the 'timeFormat' config option.
        */
      getTimeslotTimes: function(date) {
          var options = this.options;
          var firstHourDisplayed = options.businessHours.limitDisplay ? options.businessHours.start : 0;
          var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), firstHourDisplayed);

          var times = [],
              startMillis = startDate.getTime();
          for (var i = 0; i < options.timeslotsPerDay; i++) {
            var endMillis = startMillis + options.millisPerTimeslot;
            times[i] = {
                start: new Date(startMillis),
                startFormatted: this.formatTime(new Date(startMillis), options.timeFormat),
                end: new Date(endMillis),
                endFormatted: this.formatTime(new Date(endMillis), options.timeFormat)
            };
            startMillis = endMillis;
          }
          return times;
      },

      formatDate: function(date, format) {
          if (format) {
            return this._formatDate(date, format);
          } else {
            return this._formatDate(date, this.options.dateFormat);
          }
      },

      formatTime: function(date, format) {
          if (format) {
            return this._formatDate(date, format);
          } else if (this.options.timeFormat) {
            return this._formatDate(date, this.options.timeFormat);
          } else if (this.options.use24Hour) {
            return this._formatDate(date, 'H:i');
          } else {
            return this._formatDate(date, 'h:i a');
          }
      },

      serializeEvents: function() {
        var self = this;
        var calEvents = [];

        self.element.find('.wc-cal-event').each(function() {
          calEvents.push($(this).data('calEvent'));
        });
        return calEvents;
      },

      next: function() {
        if (this._startOnFirstDayOfWeek()) {
          return this.nextWeek();
        }
        var newDate = new Date(this.element.data('startDate').getTime());
        newDate.setDate(newDate.getDate() + this.options.daysToShow);

        this._clearCalendar();
        this._loadCalEvents(newDate);
      },

      prev: function() {
        if (this._startOnFirstDayOfWeek()) {
          return this.prevWeek();
        }
        var newDate = new Date(this.element.data('startDate').getTime());
        newDate.setDate(newDate.getDate() - this.options.daysToShow);

        this._clearCalendar();
        this._loadCalEvents(newDate);
      },
      getCurrentFirstDay: function() {
        return this._dateFirstDayOfWeek(this.options.date || new Date());
      },
      getCurrentLastDay: function() {
        return this._addDays(this.getCurrentFirstDay(), this.options.daysToShow - 1);
      },

      /*********************
        * private functions *
        *********************/
      _setOption: function(key, value) {
        var self = this;
        if (self.options[key] != value) {
          // event callback change, no need to re-render the events
          if (key == 'beforeEventNew') {
            self.options[key] = value;
            return;
          }

          // this could be made more efficient at some stage by caching the
          // events array locally in a store but this should be done in conjunction
          // with a proper binding model.

          var currentEvents = self.element.find('.wc-cal-event').map(function() {
            return $(this).data('calEvent');
          });

          var newOptions = {};
          newOptions[key] = value;
          self._renderEvents({events: currentEvents, options: newOptions}, self.element.find('.wc-day-column-inner'));
        }
      },

      // compute dynamic options based on other config values
      _computeOptions: function() {
        var options = this.options;
        if (options.businessHours.limitDisplay) {
          options.timeslotsPerDay = options.timeslotsPerHour * (options.businessHours.end - options.businessHours.start);
          options.millisToDisplay = (options.businessHours.end - options.businessHours.start) * 3600000; // 60 * 60 * 1000
          options.millisPerTimeslot = options.millisToDisplay / options.timeslotsPerDay;
        } else {
          options.timeslotsPerDay = options.timeslotsPerHour * 24;
          options.millisToDisplay = MILLIS_IN_DAY;
          options.millisPerTimeslot = MILLIS_IN_DAY / options.timeslotsPerDay;
        }
      },

      /*
        * Resize the calendar scrollable height based on the provided function in options.
        */
      _resizeCalendar: function() {
        var options = this.options;
        if (options && $.isFunction(options.height)) {
          var calendarHeight = options.height(this.element);
          var headerHeight = this.element.find('.wc-header').outerHeight();
          var navHeight = this.element.find('.wc-toolbar').outerHeight();
          var scrollContainerHeight = Math.max(calendarHeight - navHeight - headerHeight, options.minBodyHeight);
          var timeslotHeight = this.element.find('.wc-time-slots').outerHeight();
          this.element.find('.wc-scrollable-grid').height(scrollContainerHeight);
          if (timeslotHeight <= scrollContainerHeight) {
            this.element.find('.wc-scrollbar-shim').width(0);
          }
          else {
            this.element.find('.wc-scrollbar-shim').width(this._findScrollBarWidth());
          }
          this._trigger('resize', this.element);
        }
      },

      _findScrollBarWidth: function() {
        var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
        var child = parent.children();
        var width = child.innerWidth() - child.height(99).innerWidth();
        parent.remove();
        return width || /* default to 16 that is the average */ 16;
      },

      /*
        * configure calendar interaction events that are able to use event
        * delegation for greater efficiency
        */
      _setupEventDelegation: function() {
        var self = this;
        var options = this.options;

        this.element.click(function(event) {
          var $target = $(event.target),
              freeBusyManager;

          // click is disabled
          if ($target.data('preventClick')) {
            return;
          }

          var $calEvent = $target.hasClass('wc-cal-event') ?
            $target :
            $target.parents('.wc-cal-event');
          if (!$calEvent.length || !$calEvent.data('calEvent')) {
            return;
          }

          freeBusyManager = self.getFreeBusyManagerForEvent($calEvent.data('calEvent'));

          if (options.allowEventDelete && $target.hasClass('wc-cal-event-delete')) {
            options.eventDelete($calEvent.data('calEvent'), $calEvent, freeBusyManager, self.element, event);
          } else {
            options.eventClick($calEvent.data('calEvent'), $calEvent, freeBusyManager, self.element, event);
          }
        }).mouseover(function(event) {
          var $target = $(event.target);
          var $calEvent = $target.hasClass('wc-cal-event') ?
            $target :
            $target.parents('.wc-cal-event');

          if (!$calEvent.length || !$calEvent.data('calEvent')) {
            return;
          }

          if (self._isDraggingOrResizing($calEvent)) {
            return;
          }

          options.eventMouseover($calEvent.data('calEvent'), $calEvent, event);
        }).mouseout(function(event) {
          var $target = $(event.target);
          var $calEvent = $target.hasClass('wc-cal-event') ?
            $target :
            $target.parents('.wc-cal-event');

          if (!$calEvent.length || !$calEvent.data('calEvent')) {
            return;
          }

          if (self._isDraggingOrResizing($calEvent)) {
            return;
          }

          options.eventMouseout($calEvent.data('calEvent'), $calEvent, event);
        });
      },

      /**
       * check if a ui draggable or resizable is currently being dragged or
       * resized.
       */
      _isDraggingOrResizing: function($target) {
        return $target.hasClass('ui-draggable-dragging') ||
               $target.hasClass('ui-resizable-resizing');
      },

      /*
        * Render the main calendar layout
        */
      _renderCalendar: function() {
        var $calendarContainer, $weekDayColumns;
        var self = this;
        var options = this.options;

        $calendarContainer = $('<div class=\"ui-widget wc-container\">').appendTo(self.element);

        //render the different parts
          // nav links
        self._renderCalendarButtons($calendarContainer);
          // header
        self._renderCalendarHeader($calendarContainer);
          // body
        self._renderCalendarBody($calendarContainer);

        $weekDayColumns = $calendarContainer.find('.wc-day-column-inner');
        $weekDayColumns.each(function(i, val) {
            if (!options.readonly) {
              self._addDroppableToWeekDay($(this));
              if (options.allowEventCreation) {
                self._setupEventCreationForWeekDay($(this));
              }
            }
        });
      },

      /**
        * render the nav buttons on top of the calendar
        */
      _renderCalendarButtons: function($calendarContainer) {
        var self = this, options = this.options;
        if ( !options.showHeader ) return;
        if (options.buttons) {
            var calendarNavHtml = '';

            calendarNavHtml += '<div class=\"ui-widget-header wc-toolbar\">';
              calendarNavHtml += '<div class=\"wc-display\"></div>';
              calendarNavHtml += '<div class=\"wc-nav\">';
                calendarNavHtml += '<button class=\"wc-prev\">' + options.buttonText.lastWeek + '</button>';
                calendarNavHtml += '<button class=\"wc-today\">' + options.buttonText.today + '</button>';
                calendarNavHtml += '<button class=\"wc-next\">' + options.buttonText.nextWeek + '</button>';
              calendarNavHtml += '</div>';
              calendarNavHtml += '<h1 class=\"wc-title\"></h1>';
            calendarNavHtml += '</div>';

            $(calendarNavHtml).appendTo($calendarContainer);

            $calendarContainer.find('.wc-nav .wc-today')
              .button({
                icons: {primary: 'ui-icon-home'}})
              .click(function() {
                    self.today();
                    return false;
                  });

            $calendarContainer.find('.wc-nav .wc-prev')
              .button({
                text: false,
                icons: {primary: 'ui-icon-seek-prev'}})
              .click(function() {
                  self.element.weekCalendar('prev');
                  return false;
                });

            $calendarContainer.find('.wc-nav .wc-next')
              .button({
                text: false,
                icons: {primary: 'ui-icon-seek-next'}})
              .click(function() {
                  self.element.weekCalendar('next');
                  return false;
                });

            // now add buttons to switch display
            if (this.options.switchDisplay && $.isPlainObject(this.options.switchDisplay)) {
              var $container = $calendarContainer.find('.wc-display');
              $.each(this.options.switchDisplay, function(label, option) {
                      var _id = 'wc-switch-display-' + option;
                      var _input = $('<input type="radio" id="' + _id + '" name="wc-switch-display" class="wc-switch-display"/>');
                      var _label = $('<label for="' + _id + '"></label>');
                      _label.html(label);
                      _input.val(option);
                      if (parseInt(self.options.daysToShow, 10) === parseInt(option, 10)) {
                        _input.attr('checked', 'checked');
                      }
                      $container
                        .append(_input)
                        .append(_label);
                    });
              $container.find('input').change(function() {
                  self.setDaysToShow(parseInt($(this).val(), 10));
                });
            }
            $calendarContainer.find('.wc-nav, .wc-display').buttonset();
            var _height = $calendarContainer.find('.wc-nav').outerHeight();
            $calendarContainer.find('.wc-title')
              .height(_height)
              .css('line-height', _height + 'px');
        }else{
            var calendarNavHtml = '';
            calendarNavHtml += '<div class=\"ui-widget-header wc-toolbar\">';
              calendarNavHtml += '<h1 class=\"wc-title\"></h1>';
            calendarNavHtml += '</div>';
            $(calendarNavHtml).appendTo($calendarContainer);

        }
      },

      /**
        * render the calendar header, including date and user header
        */
      _renderCalendarHeader: function($calendarContainer) {
        var self = this, options = this.options,
            showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length,
            rowspan = '', colspan = '', calendarHeaderHtml;

        if (showAsSeparatedUser) {
          rowspan = ' rowspan=\"2\"';
          colspan = ' colspan=\"' + options.users.length + '\" ';
        }

        //first row
        calendarHeaderHtml = '<div class=\"ui-widget-content wc-header\">';
        calendarHeaderHtml += '<table><tbody><tr><td class=\"wc-time-column-header\"></td>';
        for (var i = 1; i <= options.daysToShow; i++) {
          calendarHeaderHtml += '<td class=\"wc-day-column-header wc-day-' + i + '\"' + colspan + '></td>';
        }
        calendarHeaderHtml += '<td class=\"wc-scrollbar-shim\"' + rowspan + '></td></tr>';

        //users row
        if (showAsSeparatedUser) {
          calendarHeaderHtml += '<tr><td class=\"wc-time-column-header\"></td>';
          var uLength = options.users.length,
              _headerClass = '';

          for (var i = 1; i <= options.daysToShow; i++) {
            for (var j = 0; j < uLength; j++) {
              _headerClass = [];
              if (j == 0) {
                _headerClass.push('wc-day-column-first');
              }
              if (j == uLength - 1) {
                _headerClass.push('wc-day-column-last');
              }
              if (!_headerClass.length) {
                _headerClass = 'wc-day-column-middle';
              }
              else {
                _headerClass = _headerClass.join(' ');
              }
              calendarHeaderHtml += '<td class=\"' + _headerClass + ' wc-user-header wc-day-' + i + ' wc-user-' + self._getUserIdFromIndex(j) + '\">';
//              calendarHeaderHtml+=    "<div class=\"wc-user-header wc-day-" + i + " wc-user-" + self._getUserIdFromIndex(j) +"\" >";
              calendarHeaderHtml += self._getUserName(j);
//              calendarHeaderHtml+=    "</div>";
              calendarHeaderHtml += '</td>';
            }
          }
          calendarHeaderHtml += '</tr>';
        }
        //close the header
        calendarHeaderHtml += '</tbody></table></div>';

        $(calendarHeaderHtml).appendTo($calendarContainer);
      },

      /**
        * render the calendar body.
        * Calendar body is composed of several distinct parts.
        * Each part is displayed in a separated row to ease rendering.
        * for further explanations, see each part rendering function.
        */
      _renderCalendarBody: function($calendarContainer) {
        var self = this, options = this.options,
            showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length,
            $calendarBody, $calendarTableTbody;
        // create the structure
        $calendarBody = '<div class=\"wc-scrollable-grid\">';
        $calendarBody += '<table class=\"wc-time-slots\">';
        $calendarBody += '<tbody>';
        $calendarBody += '</tbody>';
        $calendarBody += '</table>';
        $calendarBody += '</div>';
        $calendarBody = $($calendarBody);
        $calendarTableTbody = $calendarBody.find('tbody');

        self._renderCalendarBodyTimeSlots($calendarTableTbody);
        self._renderCalendarBodyOddEven($calendarTableTbody);
        self._renderCalendarBodyFreeBusy($calendarTableTbody);
        self._renderCalendarBodyEvents($calendarTableTbody);

        $calendarBody.appendTo($calendarContainer);

        //set the column height
        $calendarContainer.find('.wc-full-height-column').height(options.timeslotHeight * options.timeslotsPerDay);
        //set the timeslot height
        $calendarContainer.find('.wc-time-slot').height(options.timeslotHeight - 1); //account for border
        //init the time row header height
        /**
  TODO    if total height for an hour is less than 11px, there is a display problem.
          Find a way to handle it
        */
        $calendarContainer.find('.wc-time-header-cell').css({
          height: (options.timeslotHeight * options.timeslotsPerHour) - 11,
          padding: 5
        });
        //add the user data to every impacted column
        if (showAsSeparatedUser) {
          for (var i = 0, uLength = options.users.length; i < uLength; i++) {
            $calendarContainer.find('.wc-user-' + self._getUserIdFromIndex(i))
                  .data('wcUser', options.users[i])
                  .data('wcUserIndex', i)
                  .data('wcUserId', self._getUserIdFromIndex(i));
          }
        }
      },

      /**
        * render the timeslots separation
        */
      _renderCalendarBodyTimeSlots: function($calendarTableTbody) {
        var options = this.options,
            renderRow, i, j,
            showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length,
            start = (options.businessHours.limitDisplay ? options.businessHours.start : 0),
            end = (options.businessHours.limitDisplay ? options.businessHours.end : 24),
            rowspan = 1;

        //calculate the rowspan
        if (options.displayOddEven) { rowspan += 1; }
        if (options.displayFreeBusys) { rowspan += 1; }
        if (rowspan > 1) {
          rowspan = ' rowspan=\"' + rowspan + '\"';
        }
        else {
          rowspan = '';
        }

        renderRow = '<tr class=\"wc-grid-row-timeslot\">';
        renderRow += '<td class=\"wc-grid-timeslot-header\"' + rowspan + '></td>';
        renderRow += '<td colspan=\"' + options.daysToShow * (showAsSeparatedUser ? options.users.length : 1) + '\">';
        renderRow += '<div class=\"wc-no-height-wrapper wc-time-slot-wrapper\">';
        renderRow += '<div class=\"wc-time-slots\">';

        for (i = start; i < end; i++) {
          for (j = 0; j < options.timeslotsPerHour - 1; j++) {
            renderRow += '<div class=\"wc-time-slot\"></div>';
          }
          renderRow += '<div class=\"wc-time-slot wc-hour-end\"></div>';
        }

        renderRow += '</div>';
        renderRow += '</div>';
        renderRow += '</td>';
        renderRow += '</tr>';

        $(renderRow).appendTo($calendarTableTbody);
      },

      /**
        * render the odd even columns
        */
      _renderCalendarBodyOddEven: function($calendarTableTbody) {
        if (this.options.displayOddEven) {
          var options = this.options,
              renderRow = '<tr class=\"wc-grid-row-oddeven\">',
              showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length,
              oddEven,
              // let's take advantage of the jquery ui framework
              oddEvenClasses = {'odd': 'wc-column-odd', 'even': 'ui-state-hover wc-column-even'};

          //now let's display oddEven placeholders
          for (var i = 1; i <= options.daysToShow; i++) {
              if (!showAsSeparatedUser) {
                oddEven = (oddEven == 'odd' ? 'even' : 'odd');
                renderRow += '<td class=\"wc-day-column day-' + i + '\">';
                renderRow += '<div class=\"wc-no-height-wrapper wc-oddeven-wrapper\">';
                renderRow += '<div class=\"wc-full-height-column ' + oddEvenClasses[oddEven] + '\"></div>';
                renderRow += '</div>';
                renderRow += '</td>';
              }
              else {
                var uLength = options.users.length;
                for (var j = 0; j < uLength; j++) {
                    oddEven = (oddEven == 'odd' ? 'even' : 'odd');
                    renderRow += '<td class=\"wc-day-column day-' + i + '\">';
                    renderRow += '<div class=\"wc-no-height-wrapper wc-oddeven-wrapper\">';
                    renderRow += '<div class=\"wc-full-height-column ' + oddEvenClasses[oddEven] + '\" ></div>';
                    renderRow += '</div>';
                    renderRow += '</td>';
                }
            }
          }
          renderRow += '</tr>';

          $(renderRow).appendTo($calendarTableTbody);
        }
      },

      /**
        * render the freebusy placeholders
        */
      _renderCalendarBodyFreeBusy: function($calendarTableTbody) {
        if (this.options.displayFreeBusys) {
          var self = this, options = this.options,
              renderRow = '<tr class=\"wc-grid-row-freebusy\">',
              showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length;
          renderRow += '</td>';

          //now let's display freebusy placeholders
          for (var i = 1; i <= options.daysToShow; i++) {
            if (options.displayFreeBusys) {
              if (!showAsSeparatedUser) {
                renderRow += '<td class=\"wc-day-column day-' + i + '\">';
                renderRow += '<div class=\"wc-no-height-wrapper wc-freebusy-wrapper\">';
                renderRow += '<div class=\"wc-full-height-column wc-column-freebusy wc-day-' + i + '\"></div>';
                renderRow += '</div>';
                renderRow += '</td>';
              }
              else {
                var uLength = options.users.length;
                for (var j = 0; j < uLength; j++) {
                    renderRow += '<td class=\"wc-day-column day-' + i + '\">';
                    renderRow += '<div class=\"wc-no-height-wrapper wc-freebusy-wrapper\">';
                    renderRow += '<div class=\"wc-full-height-column wc-column-freebusy wc-day-' + i;
                    renderRow += ' wc-user-' + self._getUserIdFromIndex(j) + '\">';
                    renderRow += '</div>';
                    renderRow += '</div>';
                    renderRow += '</td>';
                }
              }
            }
          }

          renderRow += '</tr>';

          $(renderRow).appendTo($calendarTableTbody);
        }
      },

      /**
        * render the calendar body for event placeholders
        */
      _renderCalendarBodyEvents: function($calendarTableTbody) {
        var self = this, options = this.options,
            renderRow,
            showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length,
            start = (options.businessHours.limitDisplay ? options.businessHours.start : 0),
            end = (options.businessHours.limitDisplay ? options.businessHours.end : 24);
        renderRow = '<tr class=\"wc-grid-row-events\">';
        renderRow += '<td class=\"wc-grid-timeslot-header\">';
        for (var i = start; i < end; i++) {
          var bhClass = (options.businessHours.start <= i && options.businessHours.end > i) ? 'ui-state-active wc-business-hours' : 'ui-state-default';
          renderRow += '<div class=\"wc-hour-header ' + bhClass + '\">';
          if (options.use24Hour) {
            renderRow += '<div class=\"wc-time-header-cell\">' + self._24HourForIndex(i) + '</div>';
          }
          else {
            renderRow += '<div class=\"wc-time-header-cell\">' + self._hourForIndex(i) + '<span class=\"wc-am-pm\">' + self._amOrPm(i) + '</span></div>';
          }
          renderRow += '</div>';
        }
        renderRow += '</td>';

        //now let's display events placeholders
        var _columnBaseClass = 'ui-state-default wc-day-column';
        for (var i = 1; i <= options.daysToShow; i++) {
          if (!showAsSeparatedUser) {
            renderRow += '<td class=\"' + _columnBaseClass + ' wc-day-column-first wc-day-column-last day-' + i + '\">';
            renderRow += '<div class=\"wc-full-height-column wc-day-column-inner day-' + i + '\"></div>';
            renderRow += '</td>';
          }
          else {
            var uLength = options.users.length;
            var columnclass;
            for (var j = 0; j < uLength; j++) {
              columnclass = [];
              if (j == 0) {
                columnclass.push('wc-day-column-first');
              }
              if (j == uLength - 1) {
                columnclass.push('wc-day-column-last');
              }
              if (!columnclass.length) {
                columnclass = 'wc-day-column-middle';
              }
              else {
                columnclass = columnclass.join(' ');
              }
              renderRow += '<td class=\"' + _columnBaseClass + ' ' + columnclass + ' day-' + i + '\">';
              renderRow += '<div class=\"wc-full-height-column wc-day-column-inner day-' + i;
              renderRow += ' wc-user-' + self._getUserIdFromIndex(j) + '\">';
              renderRow += '</div>';
              renderRow += '</td>';
            }
          }
        }

        renderRow += '</tr>';

        $(renderRow).appendTo($calendarTableTbody);
      },

      /*
        * setup mouse events for capturing new events
        */
      _setupEventCreationForWeekDay: function($weekDay) {
          var self = this;
          var options = this.options;
          $weekDay.mousedown(function(event) {
            var $target = $(event.target);
            if ($target.hasClass('wc-day-column-inner')) {

                var $newEvent = $('<div class=\"wc-cal-event wc-new-cal-event wc-new-cal-event-creating\"></div>');

                $newEvent.css({lineHeight: (options.timeslotHeight - 2) + 'px', fontSize: (options.timeslotHeight / 2) + 'px'});
                $target.append($newEvent);

                var columnOffset = $target.offset().top;
                var clickY = event.pageY - columnOffset;
                var clickYRounded = (clickY - (clickY % options.timeslotHeight)) / options.timeslotHeight;
                var topPosition = clickYRounded * options.timeslotHeight;
                $newEvent.css({top: topPosition});

                if (!options.preventDragOnEventCreation) {
                  $target.bind('mousemove.newevent', function(event) {
                    $newEvent.show();
                    $newEvent.addClass('ui-resizable-resizing');
                    var height = Math.round(event.pageY - columnOffset - topPosition);
                    var remainder = height % options.timeslotHeight;
                    //snap to closest timeslot
                    if (remainder < 0) {
                        var useHeight = height - remainder;
                        $newEvent.css('height', useHeight < options.timeslotHeight ? options.timeslotHeight : useHeight);
                    } else {
                        $newEvent.css('height', height + (options.timeslotHeight - remainder));
                    }
                  }).mouseup(function() {
                    $target.unbind('mousemove.newevent');
                    $newEvent.addClass('ui-corner-all');
                  });
                }
            }

          }).mouseup(function(event) {
            var $target = $(event.target);

            var $weekDay = $target.closest('.wc-day-column-inner');
            var $newEvent = $weekDay.find('.wc-new-cal-event-creating');

            if ($newEvent.length) {
                var createdFromSingleClick = !$newEvent.hasClass('ui-resizable-resizing');

                //if even created from a single click only, default height
                if (createdFromSingleClick) {
                  $newEvent.css({height: options.timeslotHeight * options.defaultEventLength}).show();
                }
                var top = parseInt($newEvent.css('top'));
                var eventDuration = self._getEventDurationFromPositionedEventElement($weekDay, $newEvent, top);

                $newEvent.remove();
                var newCalEvent = {start: eventDuration.start, end: eventDuration.end, title: options.newEventText};
                var showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length;

                if (showAsSeparatedUser) {
                  newCalEvent = self._setEventUserId(newCalEvent, $weekDay.data('wcUserId'));
                }
                else if (!options.showAsSeparateUsers && options.users && options.users.length == 1) {
                  newCalEvent = self._setEventUserId(newCalEvent, self._getUserIdFromIndex(0));
                }

                var freeBusyManager = self.getFreeBusyManagerForEvent(newCalEvent);

                var $renderedCalEvent = self._renderEvent(newCalEvent, $weekDay);

                if (!options.allowCalEventOverlap) {
                  self._adjustForEventCollisions($weekDay, $renderedCalEvent, newCalEvent, newCalEvent);
                  self._positionEvent($weekDay, $renderedCalEvent);
                } else {
                  self._adjustOverlappingEvents($weekDay);
                }

                var proceed = self._trigger('beforeEventNew', event, {
                  'calEvent': newCalEvent,
                  'createdFromSingleClick': createdFromSingleClick,
                  'calendar': self.element
                });
  							if (proceed) {
									options.eventNew(newCalEvent, $renderedCalEvent, freeBusyManager, self.element, event);
								}
								else {
									$($renderedCalEvent).remove();
								}
            }
          });
      },

      /*
        * load calendar events for the week based on the date provided
        */
      _loadCalEvents: function(dateWithinWeek) {

          var date, weekStartDate, weekEndDate, $weekDayColumns;
          var self = this;
          var options = this.options;
          date = this._fixMinMaxDate(dateWithinWeek || options.date);
          // if date is not provided
          // or was not set
          // or is different than old one
          if ((!date || !date.getTime) ||
              (!options.date || !options.date.getTime) ||
              date.getTime() != options.date.getTime()
          ) {
            // trigger the changedate event
            this._trigger('changedate', this.element, date);
          }
          this.options.date = date;
          weekStartDate = self._dateFirstDayOfWeek(date);
          weekEndDate = self._dateLastMilliOfWeek(date);

          options.calendarBeforeLoad(self.element);

          self.element.data('startDate', weekStartDate);
          self.element.data('endDate', weekEndDate);

          $weekDayColumns = self.element.find('.wc-day-column-inner');

          self._updateDayColumnHeader($weekDayColumns);

          //load events by chosen means
          if (typeof options.data == 'string') {
            if (options.loading) {
              options.loading(true);
            }
            if (_currentAjaxCall) {
              // first abort current request.
              if (!_jQuery14OrLower) {
                _currentAjaxCall.abort();
              } else {
                // due to the fact that jquery 1.4 does not detect a request was
                // aborted, we need to replace the onreadystatechange and
                // execute the "complete" callback.
                _currentAjaxCall.onreadystatechange = null;
                _currentAjaxCall.abort();
                _currentAjaxCall = null;
                if (options.loading) {
                  options.loading(false);
                }
              }
            }
            var jsonOptions = self._getJsonOptions();
            jsonOptions[options.startParam || 'start'] = Math.round(weekStartDate.getTime() / 1000);
            jsonOptions[options.endParam || 'end'] = Math.round(weekEndDate.getTime() / 1000);
            _currentAjaxCall = $.ajax({
              url: options.data,
              data: jsonOptions,
              dataType: 'json',
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                // only prevent error with jQuery 1.5
                // see issue #34. thanks to dapplebeforedawn
                // (https://github.com/themouette/jquery-week-calendar/issues#issue/34)
                // for 1.5+, aborted request mean errorThrown == 'abort'
                // for prior version it means !errorThrown && !XMLHttpRequest.status
                // fixes #55
                if (errorThrown != 'abort' && XMLHttpRequest.status != 0) {
                  alert('unable to get data, error:' + textStatus);
                }
              },
              success: function(data) {
                self._renderEvents(data, $weekDayColumns);
              },
              complete: function() {
                _currentAjaxCall = null;
                if (options.loading) {
                  options.loading(false);
                }
              }
            });
          }
          else if ($.isFunction(options.data)) {
            options.data(weekStartDate, weekEndDate,
                  function(data) {
                      self._renderEvents(data, $weekDayColumns);
                  });
          }
          else if (options.data) {
                self._renderEvents(options.data, $weekDayColumns);
            }

          self._disableTextSelect($weekDayColumns);
      },

      /**
       * Draws a thin line which indicates the current time.
       */
      _drawCurrentHourLine: function() {
        var d = new Date(),
            options = this.options,
            businessHours = options.businessHours;

        // first, we remove the old hourline if it exists
        $('.wc-hourline', this.element).remove();

        // the line does not need to be displayed
        if (businessHours.limitDisplay && d.getHours() > businessHours.end) {
          return;
        }

        // then we recreate it
        var paddingStart = businessHours.limitDisplay ? businessHours.start : 0;
        var nbHours = d.getHours() - paddingStart + d.getMinutes() / 60;
        var positionTop = nbHours * options.timeslotHeight * options.timeslotsPerHour;
        var lineWidth = $('.wc-scrollable-grid .wc-today', this.element).width() + 3;

        $('.wc-scrollable-grid .wc-today', this.element).append(
          $('<div>', {
            'class': 'wc-hourline',
            style: 'top: ' + positionTop + 'px; width: ' + lineWidth + 'px'
          })
        );
      },

      /*
        * update the display of each day column header based on the calendar week
        */
      _updateDayColumnHeader: function($weekDayColumns) {
          var self = this;
          var options = this.options;
          var currentDay = self._cloneDate(self.element.data('startDate'));
          var showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length;
          var todayClass = 'ui-state-active wc-today';

          self.element.find('.wc-header td.wc-day-column-header').each(function(i, val) {
            $(this).html(self._getHeaderDate(currentDay));
            if (self._isToday(currentDay)) {
                $(this).addClass(todayClass);
            } else {
                $(this).removeClass(todayClass);
            }
            currentDay = self._addDays(currentDay, 1);

          });

          currentDay = self._cloneDate(self.element.data('startDate'));
          if (showAsSeparatedUser)
          {
            self.element.find('.wc-header td.wc-user-header').each(function(i, val) {
              if (self._isToday(currentDay)) {
                  $(this).addClass(todayClass);
              } else {
                  $(this).removeClass(todayClass);
              }
              currentDay = ((i + 1) % options.users.length) ? currentDay : self._addDays(currentDay, 1);
            });
          }

          currentDay = self._cloneDate(self.element.data('startDate'));

          $weekDayColumns.each(function(i, val) {

            $(this).data('startDate', self._cloneDate(currentDay));
            $(this).data('endDate', new Date(currentDay.getTime() + (MILLIS_IN_DAY)));
            if (self._isToday(currentDay)) {
                $(this).parent()
                    .addClass(todayClass)
                    .removeClass('ui-state-default');
            } else {
                $(this).parent()
                    .removeClass(todayClass)
                    .addClass('ui-state-default');
            }

            if (!showAsSeparatedUser || !((i + 1) % options.users.length)) {
              currentDay = self._addDays(currentDay, 1);
            }
          });

          //now update the freeBusy placeholders
          if (options.displayFreeBusys) {
            currentDay = self._cloneDate(self.element.data('startDate'));
            self.element.find('.wc-grid-row-freebusy .wc-column-freebusy').each(function(i, val) {
              $(this).data('startDate', self._cloneDate(currentDay));
              $(this).data('endDate', new Date(currentDay.getTime() + (MILLIS_IN_DAY)));
              if (!showAsSeparatedUser || !((i + 1) % options.users.length)) {
                currentDay = self._addDays(currentDay, 1);
              }
            });
          }

          // now update the calendar title
          if (this.options.title) {
            var date = this.options.date,
                start = self._cloneDate(self.element.data('startDate')),
                end = self._dateLastDayOfWeek(new Date(this._cloneDate(self.element.data('endDate')).getTime() - (MILLIS_IN_DAY))),
                title = this._getCalendarTitle(),
                date_format = options.dateFormat;

            // replace the placeholders contained in the title
            title = title.replace('%start%', self._formatDate(start, date_format));
            title = title.replace('%end%', self._formatDate(end, date_format));
            title = title.replace('%date%', self._formatDate(date, date_format));

            $('.wc-toolbar .wc-title', self.element).html(title);
          }
          //self._clearFreeBusys();
      },

      /**
       * Gets the calendar raw title.
       */
      _getCalendarTitle: function() {
        if ($.isFunction(this.options.title)) {
          return this.options.title(this.options.daysToShow);
        }

        return this.options.title || '';
      },

      /**
       * Render the events into the calendar
       */
      _renderEvents: function(data, $weekDayColumns) {
        var self = this;
        var options = this.options;
        var eventsToRender, nbRenderedEvents = 0;

        if (data.options) {
          var updateLayout = false;
          // update options
          $.each(data.options, function(key, value) {
            if (value !== options[key]) {
              options[key] = value;
              updateLayout = updateLayout || $.ui.weekCalendar.updateLayoutOptions[key];
            }
          });

          self._computeOptions();

          if (updateLayout) {
            var hour = self._getCurrentScrollHour();
            self.element.empty();
            self._renderCalendar();
            $weekDayColumns = self.element.find('.wc-time-slots .wc-day-column-inner');
            self._updateDayColumnHeader($weekDayColumns);
            self._resizeCalendar();
            self._scrollToHour(hour, false);
          }
        }
        this._clearCalendar();

        if ($.isArray(data)) {
          eventsToRender = self._cleanEvents(data);
        } else if (data.events) {
          eventsToRender = self._cleanEvents(data.events);
          self._renderFreeBusys(data);
        }

        $.each(eventsToRender, function(i, calEvent) {
          // render a multi day event as various event :
          // thanks to http://github.com/fbeauchamp/jquery-week-calendar
          var initialStart = new Date(calEvent.start);
          var initialEnd = new Date(calEvent.end);
          var maxHour = self.options.businessHours.limitDisplay ? self.options.businessHours.end : 24;
          var minHour = self.options.businessHours.limitDisplay ? self.options.businessHours.start : 0;
          var start = new Date(initialStart);
          var startDate = self._formatDate(start, 'Ymd');
          var endDate = self._formatDate(initialEnd, 'Ymd');
          var $weekDay;
          var isMultiday = false;

          while (startDate < endDate) {
            calEvent.start = start;

            // end of this virual calEvent is set to the end of the day
            calEvent.end.setFullYear(start.getFullYear());
            calEvent.end.setDate(start.getDate());
            calEvent.end.setMonth(start.getMonth());
            calEvent.end.setHours(maxHour, 0, 0);

            if (($weekDay = self._findWeekDayForEvent(calEvent, $weekDayColumns))) {
              self._renderEvent(calEvent, $weekDay);
              nbRenderedEvents += 1;
            }

            // start is set to the begin of the new day
            start.setDate(start.getDate() + 1);
            start.setHours(minHour, 0, 0);

            startDate = self._formatDate(start, 'Ymd');
            isMultiday = true;
          }

          if (start <= initialEnd) {
            calEvent.start = start;
            calEvent.end = initialEnd;

            if (((isMultiday && calEvent.start.getTime() != calEvent.end.getTime()) || !isMultiday) && ($weekDay = self._findWeekDayForEvent(calEvent, $weekDayColumns))) {
              self._renderEvent(calEvent, $weekDay);
              nbRenderedEvents += 1;
            }
          }

          // put back the initial start date
          calEvent.start = initialStart;
        });

        $weekDayColumns.each(function() {
          self._adjustOverlappingEvents($(this));
        });

        options.calendarAfterLoad(self.element);

        _hourLineTimeout && clearInterval(_hourLineTimeout);

        if (options.hourLine) {
          self._drawCurrentHourLine();

          _hourLineTimeout = setInterval(function() {
            self._drawCurrentHourLine();
          }, 60 * 1000); // redraw the line each minute
        }

        !nbRenderedEvents && options.noEvents();
      },

      /*
        * Render a specific event into the day provided. Assumes correct
        * day for calEvent date
        */
      _renderEvent: function(calEvent, $weekDay) {
          var self = this;
          var options = this.options;
          if (calEvent.start.getTime() > calEvent.end.getTime()) {
            return; // can't render a negative height
          }

          var eventClass, eventHtml, $calEventList, $modifiedEvent;

          eventClass = calEvent.id ? 'wc-cal-event' : 'wc-cal-event wc-new-cal-event';
          eventHtml = '<div class=\"' + eventClass + ' ui-corner-all\">';
          eventHtml += '<div class=\"wc-time ui-corner-top\"></div>';
          eventHtml += '<div class=\"wc-title\"></div></div>';

          $weekDay.each(function() {
            var $calEvent = $(eventHtml);
            $modifiedEvent = options.eventRender(calEvent, $calEvent);
            $calEvent = $modifiedEvent ? $modifiedEvent.appendTo($(this)) : $calEvent.appendTo($(this));
            $calEvent.css({lineHeight: (options.textSize + 2) + 'px', fontSize: options.textSize + 'px'});

            self._refreshEventDetails(calEvent, $calEvent);
            self._positionEvent($(this), $calEvent);

            //add to event list
            if ($calEventList) {
              $calEventList = $calEventList.add($calEvent);
            }
            else {
              $calEventList = $calEvent;
            }
          });
          $calEventList.show();

          if (!options.readonly && options.resizable(calEvent, $calEventList)) {
            self._addResizableToCalEvent(calEvent, $calEventList, $weekDay);
          }
          if (!options.readonly && options.draggable(calEvent, $calEventList)) {
            self._addDraggableToCalEvent(calEvent, $calEventList);
          }
          options.eventAfterRender(calEvent, $calEventList);

          return $calEventList;

      },
      addEvent: function() {
        return this._renderEvent.apply(this, arguments);
      },

      _adjustOverlappingEvents: function($weekDay) {
          var self = this;
          if (self.options.allowCalEventOverlap) {
            var groupsList = self._groupOverlappingEventElements($weekDay);
            $.each(groupsList, function() {
                var curGroups = this;
                $.each(curGroups, function(groupIndex) {
                  var curGroup = this;

                  // do we want events to be displayed as overlapping
                  if (self.options.overlapEventsSeparate) {
                      var newWidth = self.options.totalEventsWidthPercentInOneColumn / curGroups.length;
                      var newLeft = groupIndex * newWidth;
                  } else {
                      // TODO what happens when the group has more than 10 elements
                      var newWidth = self.options.totalEventsWidthPercentInOneColumn - ((curGroups.length - 1) * 10);
                      var newLeft = groupIndex * 10;
                  }
                  $.each(curGroup, function() {
                      // bring mouseovered event to the front
                      if (!self.options.overlapEventsSeparate) {
                        $(this).bind('mouseover.z-index', function() {
                            var $elem = $(this);
                            $.each(curGroup, function() {
                              $(this).css({'z-index': '1'});
                            });
                            $elem.css({'z-index': '3'});
                        });
                      }
                      $(this).css({width: newWidth + '%', left: newLeft + '%', right: 0});
                  });
                });
            });
          }
      },


      /*
        * Find groups of overlapping events
        */
      _groupOverlappingEventElements: function($weekDay) {
          var $events = $weekDay.find('.wc-cal-event:visible');
          var sortedEvents = $events.sort(function(a, b) {
            return $(a).data('calEvent').start.getTime() - $(b).data('calEvent').start.getTime();
          });

          var lastEndTime = new Date(0, 0, 0);
          var groups = [];
          var curGroups = [];
          var $curEvent;
          $.each(sortedEvents, function() {
            $curEvent = $(this);
            //checks, if the current group list is not empty, if the overlapping is finished
            if (curGroups.length > 0) {
                if (lastEndTime.getTime() <= $curEvent.data('calEvent').start.getTime()) {
                  //finishes the current group list by adding it to the resulting list of groups and cleans it

                  groups.push(curGroups);
                  curGroups = [];
                }
            }

            //finds the first group to fill with the event
            for (var groupIndex = 0; groupIndex < curGroups.length; groupIndex++) {
                if (curGroups[groupIndex].length > 0) {
                  //checks if the event starts after the end of the last event of the group
                  if (curGroups[groupIndex][curGroups[groupIndex].length - 1].data('calEvent').end.getTime() <= $curEvent.data('calEvent').start.getTime()) {
                      curGroups[groupIndex].push($curEvent);
                      if (lastEndTime.getTime() < $curEvent.data('calEvent').end.getTime()) {
                        lastEndTime = $curEvent.data('calEvent').end;
                      }
                      return;
                  }
                }
            }
            //if not found, creates a new group
            curGroups.push([$curEvent]);
            if (lastEndTime.getTime() < $curEvent.data('calEvent').end.getTime()) {
                lastEndTime = $curEvent.data('calEvent').end;
            }
          });
          //adds the last groups in result
          if (curGroups.length > 0) {
            groups.push(curGroups);
          }
          return groups;
      },


      /*
        * find the weekday in the current calendar that the calEvent falls within
        */
      _findWeekDayForEvent: function(calEvent, $weekDayColumns) {

          var $weekDay,
              options = this.options,
              showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length,
              user_ids = this._getEventUserId(calEvent);

          if (!$.isArray(user_ids)) {
            user_ids = [user_ids];
          }

          $weekDayColumns.each(function(index, curDay) {
            if ($(this).data('startDate').getTime() <= calEvent.start.getTime() &&
                  $(this).data('endDate').getTime() >= calEvent.end.getTime() &&
                  (!showAsSeparatedUser || $.inArray($(this).data('wcUserId'), user_ids) !== -1)
            ) {
                if ($weekDay) {
                $weekDay = $weekDay.add($(curDay));
                }
                else {
                $weekDay = $(curDay);
                }
            }
          });

          return $weekDay;
      },

      /*
        * update the events rendering in the calendar. Add if does not yet exist.
        */
      _updateEventInCalendar: function(calEvent) {
          var self = this;
          self._cleanEvent(calEvent);

          if (calEvent.id) {
            self.element.find('.wc-cal-event').each(function() {
                if ($(this).data('calEvent').id === calEvent.id || $(this).hasClass('wc-new-cal-event')) {
                  $(this).remove();
              //     return false;
                }
            });
          }

          var $weekDays = self._findWeekDayForEvent(calEvent, self.element.find('.wc-grid-row-events .wc-day-column-inner'));
          if ($weekDays) {
            $weekDays.each(function(index, weekDay) {
              var $weekDay = $(weekDay);
              var $calEvent = self._renderEvent(calEvent, $weekDay);
              self._adjustForEventCollisions($weekDay, $calEvent, calEvent, calEvent);
              self._refreshEventDetails(calEvent, $calEvent);
              self._positionEvent($weekDay, $calEvent);
              self._adjustOverlappingEvents($weekDay);
            });
          }
      },

      /*
        * Position the event element within the weekday based on it's start / end dates.
        */
      _positionEvent: function($weekDay, $calEvent) {
          var options = this.options;
          var calEvent = $calEvent.data('calEvent');
          var pxPerMillis = $weekDay.height() / options.millisToDisplay;
          var firstHourDisplayed = options.businessHours.limitDisplay ? options.businessHours.start : 0;
          var startMillis = this._getDSTdayShift(calEvent.start).getTime() - this._getDSTdayShift(new Date(calEvent.start.getFullYear(), calEvent.start.getMonth(), calEvent.start.getDate(), firstHourDisplayed)).getTime();
          var eventMillis = this._getDSTdayShift(calEvent.end).getTime() - this._getDSTdayShift(calEvent.start).getTime();
          var pxTop = pxPerMillis * startMillis;
          var pxHeight = pxPerMillis * eventMillis;
          //var pxHeightFallback = pxPerMillis * (60 / options.timeslotsPerHour) * 60 * 1000;
      $calEvent.css({top: pxTop, height: pxHeight || (pxPerMillis * 3600000 / options.timeslotsPerHour)});
      },

      /*
        * Determine the actual start and end times of a calevent based on it's
        * relative position within the weekday column and the starting hour of the
        * displayed calendar.
        */
      _getEventDurationFromPositionedEventElement: function($weekDay, $calEvent, top) {
          var options = this.options;
          var startOffsetMillis = options.businessHours.limitDisplay ? options.businessHours.start * 3600000 : 0;
          var start = new Date($weekDay.data('startDate').getTime() + startOffsetMillis + Math.round(top / options.timeslotHeight) * options.millisPerTimeslot);
          var end = new Date(start.getTime() + ($calEvent.height() / options.timeslotHeight) * options.millisPerTimeslot);
          return {start: this._getDSTdayShift(start, -1), end: this._getDSTdayShift(end, -1)};
      },

      /*
        * If the calendar does not allow event overlap, adjust the start or end date if necessary to
        * avoid overlapping of events. Typically, shortens the resized / dropped event to it's max possible
        * duration  based on the overlap. If no satisfactory adjustment can be made, the event is reverted to
        * it's original location.
        */
      _adjustForEventCollisions: function($weekDay, $calEvent, newCalEvent, oldCalEvent, maintainEventDuration) {
          var options = this.options;

          if (options.allowCalEventOverlap) {
            return;
          }
          var adjustedStart, adjustedEnd;
          var self = this;

          $weekDay.find('.wc-cal-event').not($calEvent).each(function() {
            var currentCalEvent = $(this).data('calEvent');

            //has been dropped onto existing event overlapping the end time
            if (newCalEvent.start.getTime() < currentCalEvent.end.getTime() &&
                  newCalEvent.end.getTime() >= currentCalEvent.end.getTime()) {

                adjustedStart = currentCalEvent.end;
            }


            //has been dropped onto existing event overlapping the start time
            if (newCalEvent.end.getTime() > currentCalEvent.start.getTime() &&
                  newCalEvent.start.getTime() <= currentCalEvent.start.getTime()) {

                adjustedEnd = currentCalEvent.start;
            }
            //has been dropped inside existing event with same or larger duration
            if (oldCalEvent.resizable == false ||
                  (newCalEvent.end.getTime() <= currentCalEvent.end.getTime() &&
                    newCalEvent.start.getTime() >= currentCalEvent.start.getTime())) {

                adjustedStart = oldCalEvent.start;
                adjustedEnd = oldCalEvent.end;
                return false;
            }

          });


          newCalEvent.start = adjustedStart || newCalEvent.start;

          if (adjustedStart && maintainEventDuration) {
            newCalEvent.end = new Date(adjustedStart.getTime() + (oldCalEvent.end.getTime() - oldCalEvent.start.getTime()));
            self._adjustForEventCollisions($weekDay, $calEvent, newCalEvent, oldCalEvent);
          } else {
            newCalEvent.end = adjustedEnd || newCalEvent.end;
          }


          //reset if new cal event has been forced to zero size
          if (newCalEvent.start.getTime() >= newCalEvent.end.getTime()) {
            newCalEvent.start = oldCalEvent.start;
            newCalEvent.end = oldCalEvent.end;
          }

          $calEvent.data('calEvent', newCalEvent);
      },

      /**
       * Add draggable capabilities to an event
       */
      _addDraggableToCalEvent: function(calEvent, $calEvent) {
        var options = this.options;

        $calEvent.draggable({
          handle: '.wc-time',
          containment: 'div.wc-time-slots',
          snap: '.wc-day-column-inner',
          snapMode: 'inner',
          snapTolerance: options.timeslotHeight - 1,
          revert: 'invalid',
          opacity: 0.5,
          grid: [$calEvent.outerWidth() + 1, options.timeslotHeight],
          start: function(event, ui) {
            var $calEvent = ui.draggable || ui.helper;
            options.eventDrag(calEvent, $calEvent);
          }
        });
      },

      /*
        * Add droppable capabilites to weekdays to allow dropping of calEvents only
        */
      _addDroppableToWeekDay: function($weekDay) {
          var self = this;
          var options = this.options;
          $weekDay.droppable({
            accept: '.wc-cal-event',
            drop: function(event, ui) {
                var $calEvent = ui.draggable;
                var top = Math.round(parseInt(ui.position.top));
                var eventDuration = self._getEventDurationFromPositionedEventElement($weekDay, $calEvent, top);
                var calEvent = $calEvent.data('calEvent');
                var newCalEvent = $.extend(true, {}, calEvent, {start: eventDuration.start, end: eventDuration.end});
                var showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length;
                if (showAsSeparatedUser) {
                  // we may have dragged the event on column with a new user.
                  // nice way to handle that is:
                  //  - get the newly dragged on user
                  //  - check if user is part of the event
                  //  - if yes, nothing changes, if not, find the old owner to remove it and add new one
                  var newUserId = $weekDay.data('wcUserId');
                  var userIdList = self._getEventUserId(calEvent);
                  var oldUserId = $(ui.draggable.parents('.wc-day-column-inner').get(0)).data('wcUserId');
                  if (!$.isArray(userIdList)) {
                    userIdList = [userIdList];
                  }
                  if ($.inArray(newUserId, userIdList) == -1) {
                    // remove old user
                    var _index = $.inArray(oldUserId, userIdList);
                    userIdList.splice(_index, 1);
                    // add new user ?
                    if ($.inArray(newUserId, userIdList) == -1) {
                      userIdList.push(newUserId);
                    }
                  }
                  newCalEvent = self._setEventUserId(newCalEvent, ((userIdList.length == 1) ? userIdList[0] : userIdList));
                }
                self._adjustForEventCollisions($weekDay, $calEvent, newCalEvent, calEvent, true);
                var $weekDayColumns = self.element.find('.wc-day-column-inner');

                //trigger drop callback
                options.eventDrop(newCalEvent, calEvent, $calEvent);

                var $newEvent = self._renderEvent(newCalEvent, self._findWeekDayForEvent(newCalEvent, $weekDayColumns));
                $calEvent.hide();

                $calEvent.data('preventClick', true);

                var $weekDayOld = self._findWeekDayForEvent($calEvent.data('calEvent'), self.element.find('.wc-time-slots .wc-day-column-inner'));

                if ($weekDayOld.data('startDate') != $weekDay.data('startDate')) {
                  self._adjustOverlappingEvents($weekDayOld);
                }
                self._adjustOverlappingEvents($weekDay);

                setTimeout(function() {
                  $calEvent.remove();
                }, 1000);

            }
          });
      },

      /*
        * Add resizable capabilities to a calEvent
        */
      _addResizableToCalEvent: function(calEvent, $calEvent, $weekDay) {
          var self = this;
          var options = this.options;
          $calEvent.resizable({
            grid: options.timeslotHeight,
            containment: $weekDay,
            handles: 's',
            minHeight: options.timeslotHeight,
            stop: function(event, ui) {
                var $calEvent = ui.element;
                var newEnd = new Date($calEvent.data('calEvent').start.getTime() + Math.max(1, Math.round(ui.size.height / options.timeslotHeight)) * options.millisPerTimeslot);
                if (self._needDSTdayShift($calEvent.data('calEvent').start, newEnd))
            newEnd = self._getDSTdayShift(newEnd, -1);
                var newCalEvent = $.extend(true, {}, calEvent, {start: calEvent.start, end: newEnd});
                self._adjustForEventCollisions($weekDay, $calEvent, newCalEvent, calEvent);

                //trigger resize callback
                options.eventResize(newCalEvent, calEvent, $calEvent);
                self._refreshEventDetails(newCalEvent, $calEvent);
                self._positionEvent($weekDay, $calEvent);
                self._adjustOverlappingEvents($weekDay);
                $calEvent.data('preventClick', true);
                setTimeout(function() {
                  $calEvent.removeData('preventClick');
                }, 500);
            }
          });
          $('.ui-resizable-handle', $calEvent).text('=');
      },

      /*
        * Refresh the displayed details of a calEvent in the calendar
        */
      _refreshEventDetails: function(calEvent, $calEvent) {
	  var suffix = '';
	  if (!this.options.readonly &&
		 this.options.allowEventDelete &&
		 this.options.deletable(calEvent,$calEvent)) {
	      suffix = '<div class="wc-cal-event-delete ui-icon ui-icon-close"></div>';
	  }
          $calEvent.find('.wc-time').html(this.options.eventHeader(calEvent, this.element) + suffix);
          $calEvent.find('.wc-title').html(this.options.eventBody(calEvent, this.element));
          $calEvent.data('calEvent', calEvent);
          this.options.eventRefresh(calEvent, $calEvent);
      },

      /*
        * Clear all cal events from the calendar
        */
      _clearCalendar: function() {
          this.element.find('.wc-day-column-inner div').remove();
          this._clearFreeBusys();
      },

      /*
        * Scroll the calendar to a specific hour
        */
      _scrollToHour: function(hour, animate) {
          var self = this;
          var options = this.options;
          var $scrollable = this.element.find('.wc-scrollable-grid');
          var slot = hour;
          if (self.options.businessHours.limitDisplay) {
            if (hour <= self.options.businessHours.start) {
                slot = 0;
            } else if (hour >= self.options.businessHours.end) {
                slot = self.options.businessHours.end - self.options.businessHours.start - 1;
            } else {
                slot = hour - self.options.businessHours.start;
            }
          }

          var $target = this.element.find('.wc-grid-timeslot-header .wc-hour-header:eq(' + slot + ')');

          $scrollable.animate({scrollTop: 0}, 0, function() {
            var targetOffset = $target.offset().top;
            var scroll = targetOffset - $scrollable.offset().top - $target.outerHeight();
            if (animate) {
              $scrollable.animate({scrollTop: scroll}, options.scrollToHourMillis);
            }
            else {
              $scrollable.animate({scrollTop: scroll}, 0);
            }
          });
      },

      /*
        * find the hour (12 hour day) for a given hour index
        */
      _hourForIndex: function(index) {
          if (index === 0) { //midnight
            return 12;
          } else if (index < 13) { //am
            return index;
          } else { //pm
            return index - 12;
          }
      },

      _24HourForIndex: function(index) {
          if (index === 0) { //midnight
            return '00:00';
          } else if (index < 10) {
            return '0' + index + ':00';
          } else {
            return index + ':00';
          }
      },

      _amOrPm: function(hourOfDay) {
          return hourOfDay < 12 ? 'AM' : 'PM';
      },

      _isToday: function(date) {
          var clonedDate = this._cloneDate(date);
          this._clearTime(clonedDate);
          var today = new Date();
          this._clearTime(today);
          return today.getTime() === clonedDate.getTime();
      },

      /*
       * Clean events to ensure correct format
       */
      _cleanEvents: function(events) {
          var self = this;
          $.each(events, function(i, event) {
            self._cleanEvent(event);
          });
          return events;
      },

      /*
       * Clean specific event
       */
      _cleanEvent: function(event) {
          if (event.date) {
            event.start = event.date;
          }
          event.start = this._cleanDate(event.start);
          event.end = this._cleanDate(event.end);
          if (!event.end) {
            event.end = this._addDays(this._cloneDate(event.start), 1);
          }
      },

      /*
       * Disable text selection of the elements in different browsers
       */
      _disableTextSelect: function($elements) {
          $elements.each(function() {
            if ($.browser.mozilla) {//Firefox
                $(this).css('MozUserSelect', 'none');
            } else if ($.browser.msie) {//IE
                $(this).bind('selectstart', function() {
                  return false;
                });
            } else {//Opera, etc.
                $(this).mousedown(function() {
                  return false;
                });
            }
          });
      },

      /*
       * returns the date on the first millisecond of the week
       */
      _dateFirstDayOfWeek: function(date) {
        var self = this;
        var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var adjustedDate = new Date(midnightCurrentDate);
        adjustedDate.setDate(adjustedDate.getDate() - self._getAdjustedDayIndex(midnightCurrentDate));

        return adjustedDate;
      },

      /*
       * returns the date on the first millisecond of the last day of the week
       */
      _dateLastDayOfWeek: function(date) {
        var self = this;
        var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var adjustedDate = new Date(midnightCurrentDate);
        var daysToAdd = (self.options.daysToShow - 1 - self._getAdjustedDayIndex(midnightCurrentDate));
        adjustedDate.setDate(adjustedDate.getDate() + daysToAdd);

        return adjustedDate;
      },

      /**
       * fix the date if it is not within given options
       * minDate and maxDate
       */
      _fixMinMaxDate: function(date) {
        var minDate, maxDate;
        date = this._cleanDate(date);

        // not less than minDate
        if (this.options.minDate) {
          minDate = this._cleanDate(this.options.minDate);
          // midnight on minDate
          minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
          if (date.getTime() < minDate.getTime()) {
            this._trigger('reachedmindate', this.element, date);
          }
          date = this._cleanDate(Math.max(date.getTime(), minDate.getTime()));
        }

        // not more than maxDate
        if (this.options.maxDate) {
          maxDate = this._cleanDate(this.options.maxDate);
          // apply correction for max date if not startOnFirstDayOfWeek
          // to make sure no further date is displayed.
          // otherwise, the complement will still be shown
          if (!this._startOnFirstDayOfWeek()) {
            var day = maxDate.getDate() - this.options.daysToShow + 1;
            maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), day);
          }
          // microsecond before midnight on maxDate
          maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
          if (date.getTime() > maxDate.getTime()) {
            this._trigger('reachedmaxdate', this.element, date);
          }
          date = this._cleanDate(Math.min(date.getTime(), maxDate.getTime()));
        }

        return date;
      },

      /*
        * gets the index of the current day adjusted based on options
        */
      _getAdjustedDayIndex: function(date) {
          if (!this._startOnFirstDayOfWeek()) {
            return 0;
          }

          var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          var currentDayOfStandardWeek = midnightCurrentDate.getDay();
          var days = [0, 1, 2, 3, 4, 5, 6];
          this._rotate(days, this._firstDayOfWeek());
          return days[currentDayOfStandardWeek];
      },

      _firstDayOfWeek: function() {
        if ($.isFunction(this.options.firstDayOfWeek)) {
          return this.options.firstDayOfWeek(this.element);
        }
        return this.options.firstDayOfWeek;
      },

      /*
        * returns the date on the last millisecond of the week
        */
      _dateLastMilliOfWeek: function(date) {
          var lastDayOfWeek = this._dateLastDayOfWeek(date);
          lastDayOfWeek = this._cloneDate(lastDayOfWeek);
          lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 1);
          return lastDayOfWeek;

      },

      /*
        * Clear the time components of a date leaving the date
        * of the first milli of day
        */
      _clearTime: function(d) {
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
          d.setMilliseconds(0);
          return d;
      },

      /*
        * add specific number of days to date
        */
      _addDays: function(d, n, keepTime) {
          d.setDate(d.getDate() + n);
          if (keepTime) {
            return d;
          }
          return this._clearTime(d);
      },

      /*
        * Rotate an array by specified number of places.
        */
      _rotate: function(a /*array*/, p /* integer, positive integer rotate to the right, negative to the left... */) {
          for (var l = a.length, p = (Math.abs(p) >= l && (p %= l), p < 0 && (p += l), p), i, x; p; p = (Math.ceil(l / p) - 1) * p - l + (l = p)) {
            for (i = l; i > p; x = a[--i], a[i] = a[i - p], a[i - p] = x) {}
          }
          return a;
      },

      _cloneDate: function(d) {
          return new Date(d.getTime());
      },

      /**
       * Return a Date instance for different representations.
       * Valid representations are:
       *  * timestamps
       *  * Date objects
       *  * textual representations (only these accepted by the Date
       *    constructor)
       *
       *  @return {Date} The clean date object.
       */
      _cleanDate: function(d) {
          if (typeof d === 'string') {
            // if is numeric
            if (!isNaN(Number(d))) {
              return this._cleanDate(parseInt(d, 10));
            }

            // this is a human readable date
            return Date.parse(d) || new Date(d);
          }

          if (typeof d == 'number') {
            return new Date(d);
          }

          return d;
      },

      /*
        * date formatting is adapted from
        * http://jacwright.com/projects/javascript/date_format
        */
      _formatDate: function(date, format) {
        var returnStr = '';
        for (var i = 0; i < format.length; i++) {
          var curChar = format.charAt(i);
          if (i != 0 && format.charAt(i - 1) == '\\') {
            returnStr += curChar;
          }
          else if (this._replaceChars[curChar]) {
            returnStr += this._replaceChars[curChar](date, this);
          } else if (curChar != '\\') {
            returnStr += curChar;
          }
        }
        return returnStr;
      },

      _replaceChars: {
      // Day
      d: function(date) { return (date.getDate() < 10 ? '0' : '') + date.getDate(); },
      D: function(date, calendar) { return calendar.options.shortDays[date.getDay()]; },
      j: function(date) { return date.getDate(); },
      l: function(date, calendar) { return calendar.options.longDays[date.getDay()]; },
      N: function(date) { var _d = date.getDay(); return _d ? _d : 7; },
      S: function(date) { return (date.getDate() % 10 == 1 && date.getDate() != 11 ? 'st' : (date.getDate() % 10 == 2 && date.getDate() != 12 ? 'nd' : (date.getDate() % 10 == 3 && date.getDate() != 13 ? 'rd' : 'th'))); },
      w: function(date) { return date.getDay(); },
      z: function(date) { var d = new Date(date.getFullYear(), 0, 1); return Math.ceil((date - d) / 86400000); }, // Fixed now
      // Week
      W: function(date) { var d = new Date(date.getFullYear(), 0, 1); return Math.ceil((((date - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
      // Month
      F: function(date, calendar) { return calendar.options.longMonths[date.getMonth()]; },
      m: function(date) { return (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1); },
      M: function(date, calendar) { return calendar.options.shortMonths[date.getMonth()]; },
      n: function(date) { return date.getMonth() + 1; },
      t: function(date) { var d = date; return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() }, // Fixed now, gets #days of date
      // Year
      L: function(date) { var year = date.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },  // Fixed now
      o: function(date) { var d = new Date(date.valueOf()); d.setDate(d.getDate() - ((date.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
      Y: function(date) { return date.getFullYear(); },
      y: function(date) { return ('' + date.getFullYear()).substr(2); },
      // Time
      a: function(date) { return date.getHours() < 12 ? 'am' : 'pm'; },
      A: function(date) { return date.getHours() < 12 ? 'AM' : 'PM'; },
      B: function(date) { return Math.floor((((date.getUTCHours() + 1) % 24) + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
      g: function(date) { return date.getHours() % 12 || 12; },
      G: function(date) { return date.getHours(); },
      h: function(date) { return ((date.getHours() % 12 || 12) < 10 ? '0' : '') + (date.getHours() % 12 || 12); },
      H: function(date) { return (date.getHours() < 10 ? '0' : '') + date.getHours(); },
      i: function(date) { return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(); },
      s: function(date) { return (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(); },
      u: function(date) { var m = date.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },
      // Timezone
      e: function(date) { return 'Not Yet Supported'; },
      I: function(date) { return 'Not Yet Supported'; },
      O: function(date) { return (-date.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(date.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(date.getTimezoneOffset() / 60)) + '00'; },
      P: function(date) { return (-date.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(date.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(date.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
      T: function(date) { var m = date.getMonth(); date.setMonth(0); var result = date.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); date.setMonth(m); return result;},
      Z: function(date) { return -date.getTimezoneOffset() * 60; },
      // Full Date/Time
      c: function(date, calendar) { return calendar._formatDate(date, 'Y-m-d\\TH:i:sP'); }, // Fixed now
      r: function(date, calendar) { return calendar._formatDate(date, 'D, d M Y H:i:s O'); },
      U: function(date) { return date.getTime() / 1000; }
      },

      /* USER MANAGEMENT FUNCTIONS */

      getUserForId: function(id) {
        return $.extend({}, this.options.users[this._getUserIndexFromId(id)]);
      },

      /**
        * return the user name for header
        */
      _getUserName: function(index) {
          var self = this;
          var options = this.options;
          var user = options.users[index];
          if ($.isFunction(options.getUserName)) {
          return options.getUserName(user, index, self.element);
          }
          else {
          return user;
          }
      },
      /**
        * return the user id for given index
        */
      _getUserIdFromIndex: function(index) {
          var self = this;
          var options = this.options;
          if ($.isFunction(options.getUserId)) {
          return options.getUserId(options.users[index], index, self.element);
          }
          return index;
      },
      /**
        * returns the associated user index for given ID
        */
      _getUserIndexFromId: function(id) {
          var self = this;
          var options = this.options;
          for (var i = 0; i < options.users.length; i++) {
            if (self._getUserIdFromIndex(i) == id) {
              return i;
            }
          }
          return 0;
      },
      /**
        * return the user ids for given calEvent.
        * default is calEvent.userId field.
        */
      _getEventUserId: function(calEvent) {
          var self = this;
          var options = this.options;
          if (options.showAsSeparateUsers && options.users && options.users.length) {
            if ($.isFunction(options.getEventUserId)) {
            return options.getEventUserId(calEvent, self.element);
            }
            return calEvent.userId;
          }
          return [];
      },
      /**
        * sets the event user id on given calEvent
        * default is calEvent.userId field.
        */
      _setEventUserId: function(calEvent, userId) {
          var self = this;
          var options = this.options;
          if ($.isFunction(options.setEventUserId)) {
            return options.setEventUserId(userId, calEvent, self.element);
          }
          calEvent.userId = userId;
          return calEvent;
      },
      /**
        * return the user ids for given freeBusy.
        * default is freeBusy.userId field.
        */
      _getFreeBusyUserId: function(freeBusy) {
        var self = this;
        var options = this.options;
        if ($.isFunction(options.getFreeBusyUserId)) {
          return options.getFreeBusyUserId(freeBusy.getOption(), self.element);
        }
        return freeBusy.getOption('userId');
      },

      /* FREEBUSY MANAGEMENT */

      /**
        * ckean the free busy managers and remove all the freeBusy
        */
      _clearFreeBusys: function() {
        if (this.options.displayFreeBusys) {
          var self = this,
              options = this.options,
              $freeBusyPlaceholders = self.element.find('.wc-grid-row-freebusy .wc-column-freebusy');
          $freeBusyPlaceholders.each(function() {
            $(this).data('wcFreeBusyManager', new FreeBusyManager({
                start: self._cloneDate($(this).data('startDate')),
                end: self._cloneDate($(this).data('endDate')),
                defaultFreeBusy: options.defaultFreeBusy || {}
            }));
          });
          self.element.find('.wc-grid-row-freebusy .wc-freebusy').remove();
        }
      },
      /**
        * retrieve placeholders for given freebusy
        */
      _findWeekDaysForFreeBusy: function(freeBusy, $weekDays) {
        var $returnWeekDays,
            options = this.options,
            showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length,
            self = this,
            userList = self._getFreeBusyUserId(freeBusy);
        if (!$.isArray(userList)) {
          userList = userList != 'undefined' ? [userList] : [];
        }
        if (!$weekDays) {
          $weekDays = self.element.find('.wc-grid-row-freebusy .wc-column-freebusy');
        }
        $weekDays.each(function() {
          var manager = $(this).data('wcFreeBusyManager'),
              has_overlap = manager.isWithin(freeBusy.getStart()) ||
                              manager.isWithin(freeBusy.getEnd()) ||
                              freeBusy.isWithin(manager.getStart()) ||
                              freeBusy.isWithin(manager.getEnd()),
              userId = $(this).data('wcUserId');
          if (has_overlap && (!showAsSeparatedUser || ($.inArray(userId, userList) != -1))) {
            $returnWeekDays = $returnWeekDays ? $returnWeekDays.add($(this)) : $(this);
          }
        });
        return $returnWeekDays;
      },

      /**
        * used to render all freeBusys
        */
      _renderFreeBusys: function(freeBusys) {
        if (this.options.displayFreeBusys) {
          var self = this,
              $freeBusyPlaceholders = self.element.find('.wc-grid-row-freebusy .wc-column-freebusy'),
              freebusysToRender;
          //insert freebusys to dedicated placeholders freebusy managers
          if ($.isArray(freeBusys)) {
            freebusysToRender = self._cleanFreeBusys(freeBusys);
          } else if (freeBusys.freebusys) {
            freebusysToRender = self._cleanFreeBusys(freeBusys.freebusys);
          }
          else {
            freebusysToRender = [];
          }

          $.each(freebusysToRender, function(index, freebusy) {
              var $placeholders = self._findWeekDaysForFreeBusy(freebusy, $freeBusyPlaceholders);
              if ($placeholders) {
                $placeholders.each(function() {
                  var manager = $(this).data('wcFreeBusyManager');
                  manager.insertFreeBusy(new FreeBusy(freebusy.getOption()));
                  $(this).data('wcFreeBusyManager', manager);
                });
              }
            });

          //now display freebusys on  place holders
          self._refreshFreeBusys($freeBusyPlaceholders);
        }
      },
      /**
        * refresh freebusys for given placeholders
        */
      _refreshFreeBusys: function($freeBusyPlaceholders) {
        if (this.options.displayFreeBusys && $freeBusyPlaceholders) {
          var self = this,
              options = this.options,
              start = (options.businessHours.limitDisplay ? options.businessHours.start : 0),
              end = (options.businessHours.limitDisplay ? options.businessHours.end : 24);

          $freeBusyPlaceholders.each(function() {
              var $placehoder = $(this);
              var s = self._cloneDate($placehoder.data('startDate')),
                  e = self._cloneDate(s);
              s.setHours(start);
              e.setHours(end);
              $placehoder.find('.wc-freebusy').remove();
              $.each($placehoder.data('wcFreeBusyManager').getFreeBusys(s, e), function() {
                  self._renderFreeBusy(this, $placehoder);
                });
            });
        }
      },
      /**
        * render a freebusy item on dedicated placeholders
        */
      _renderFreeBusy: function(freeBusy, $freeBusyPlaceholder) {
        if (this.options.displayFreeBusys) {
          var self = this,
              options = this.options,
              freeBusyHtml = '<div class="wc-freebusy"></div>';

          var $fb = $(freeBusyHtml);
          $fb.data('wcFreeBusy', new FreeBusy(freeBusy.getOption()));
          this._positionFreeBusy($freeBusyPlaceholder, $fb);
          $fb = options.freeBusyRender(freeBusy.getOption(), $fb, self.element);
          if ($fb) {
            $fb.appendTo($freeBusyPlaceholder);
          }
        }
      },
      /*
        * Position the freebusy element within the weekday based on it's start / end dates.
        */
      _positionFreeBusy: function($placeholder, $freeBusy) {
          var options = this.options;
          var freeBusy = $freeBusy.data('wcFreeBusy');
          var pxPerMillis = $placeholder.height() / options.millisToDisplay;
          var firstHourDisplayed = options.businessHours.limitDisplay ? options.businessHours.start : 0;
          var startMillis = freeBusy.getStart().getTime() - new Date(freeBusy.getStart().getFullYear(), freeBusy.getStart().getMonth(), freeBusy.getStart().getDate(), firstHourDisplayed).getTime();
          var eventMillis = freeBusy.getEnd().getTime() - freeBusy.getStart().getTime();
          var pxTop = pxPerMillis * startMillis;
          var pxHeight = pxPerMillis * eventMillis;
          $freeBusy.css({top: pxTop, height: pxHeight});
      },
      /*
        * Clean freebusys to ensure correct format
        */
      _cleanFreeBusys: function(freebusys) {
          var self = this,
              freeBusyToReturn = [];
          if (!$.isArray(freebusys)) {
            var freebusys = [freebusys];
          }
          $.each(freebusys, function(i, freebusy) {
            freeBusyToReturn.push(new FreeBusy(self._cleanFreeBusy(freebusy)));
          });
          return freeBusyToReturn;
      },

      /*
        * Clean specific freebusy
        */
      _cleanFreeBusy: function(freebusy) {
          if (freebusy.date) {
            freebusy.start = freebusy.date;
          }
          freebusy.start = this._cleanDate(freebusy.start);
          freebusy.end = this._cleanDate(freebusy.end);
          return freebusy;
      },

      /**
        * retrives the first freebusy manager matching demand.
        */
      getFreeBusyManagersFor: function(date, users) {
        var calEvent = {
          start: date,
          end: date
        };
        this._setEventUserId(calEvent, users);
        return this.getFreeBusyManagerForEvent(calEvent);
      },
      /**
        * retrives the first freebusy manager for given event.
        */
      getFreeBusyManagerForEvent: function(newCalEvent) {
        var self = this,
            options = this.options,
            freeBusyManager;
        if (options.displayFreeBusys) {
          var $freeBusyPlaceHoders = self.element.find('.wc-grid-row-freebusy .wc-column-freebusy'),
              freeBusy = new FreeBusy({start: newCalEvent.start, end: newCalEvent.end}),
              showAsSeparatedUser = options.showAsSeparateUsers && options.users && options.users.length,
              userId = showAsSeparatedUser ? self._getEventUserId(newCalEvent) : null;
          if (!$.isArray(userId)) {
            userId = [userId];
          }
          $freeBusyPlaceHoders.each(function() {
            var manager = $(this).data('wcFreeBusyManager'),
                has_overlap = manager.isWithin(freeBusy.getEnd()) ||
                                manager.isWithin(freeBusy.getEnd()) ||
                                freeBusy.isWithin(manager.getStart()) ||
                                freeBusy.isWithin(manager.getEnd());
            if (has_overlap && (!showAsSeparatedUser || $.inArray($(this).data('wcUserId'), userId) != -1)) {
              freeBusyManager = $(this).data('wcFreeBusyManager');
              return false;
            }
          });
        }
        return freeBusyManager;
      },
      /**
        * appends the freebusys to replace the old ones.
        * @param {array|object} freeBusys freebusy(s) to apply.
        */
      updateFreeBusy: function(freeBusys) {
        var self = this,
            options = this.options;
        if (options.displayFreeBusys) {
          var $toRender,
              $freeBusyPlaceHoders = self.element.find('.wc-grid-row-freebusy .wc-column-freebusy'),
              _freeBusys = self._cleanFreeBusys(freeBusys);

          $.each(_freeBusys, function(index, _freeBusy) {

            var $weekdays = self._findWeekDaysForFreeBusy(_freeBusy, $freeBusyPlaceHoders);
            //if freebusy has a placeholder
            if ($weekdays && $weekdays.length) {
              $weekdays.each(function(index, day) {
                var manager = $(day).data('wcFreeBusyManager');
                manager.insertFreeBusy(_freeBusy);
                $(day).data('wcFreeBusyManager', manager);
              });
              $toRender = $toRender ? $toRender.add($weekdays) : $weekdays;
            }
          });
          self._refreshFreeBusys($toRender);
        }
      },

      /* NEW OPTIONS MANAGEMENT */

      /**
        * checks wether or not the calendar should be displayed starting on first day of week
        */
      _startOnFirstDayOfWeek: function() {
        return jQuery.isFunction(this.options.startOnFirstDayOfWeek) ? this.options.startOnFirstDayOfWeek(this.element) : this.options.startOnFirstDayOfWeek;
      },

      /**
        * finds out the current scroll to apply it when changing the view
        */
      _getCurrentScrollHour: function() {
          var self = this;
          var options = this.options;
          var $scrollable = this.element.find('.wc-scrollable-grid');
          var scroll = $scrollable.scrollTop();
          if (self.options.businessHours.limitDisplay) {
            scroll = scroll + options.businessHours.start * options.timeslotHeight * options.timeslotsPerHour;
          }
          return Math.round(scroll / (options.timeslotHeight * options.timeslotsPerHour)) + 1;
      },
      _getJsonOptions: function() {
        if ($.isFunction(this.options.jsonOptions)) {
            return $.extend({}, this.options.jsonOptions(this.element));
        }
        if ($.isPlainObject(this.options.jsonOptions)) {
          return $.extend({}, this.options.jsonOptions);
        }
        return {};
      },
      _getHeaderDate: function(date) {
        var options = this.options;
        if (options.getHeaderDate && $.isFunction(options.getHeaderDate))
        {
          return options.getHeaderDate(date, this.element);
        }
        var dayName = options.useShortDayNames ? options.shortDays[date.getDay()] : options.longDays[date.getDay()];
        return dayName + (options.headerSeparator) + this._formatDate(date, options.dateFormat);
      },



      /**
        * returns corrected date related to DST problem
        */
      _getDSTdayShift: function(date, shift) {
      var start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0);
      var offset1 = start.getTimezoneOffset();
      var offset2 = date.getTimezoneOffset();
          if (offset1 == offset2)
        return date;
      shift = shift ? shift : 1;
      return new Date(date.getTime() - shift * (offset1 > offset2 ? -1 : 1) * (Math.max(offset1, offset2) - Math.min(offset1, offset2)) * 60000);
      },
      _needDSTdayShift: function(date1, date2) {
      return date1.getTimezoneOffset() != date2.getTimezoneOffset();
      }



    }; // end of widget function return
    })() //end of widget function closure execution
  ); // end of $.widget("ui.weekCalendar"...

    $.extend($.ui.weekCalendar, {
      version: '2.0-dev',
      updateLayoutOptions: {
        startOnFirstDayOfWeek: true,
        firstDayOfWeek: true,
        daysToShow: true,
        displayOddEven: true,
        timeFormat: true,
        dateFormat: true,
        use24Hour: true,
        useShortDayNames: true,
        businessHours: true,
        timeslotHeight: true,
        timeslotsPerHour: true,
        buttonText: true,
        height: true,
        shortMonths: true,
        longMonths: true,
        shortDays: true,
        longDays: true,
        textSize: true,
        users: true,
        showAsSeparateUsers: true,
        displayFreeBusys: true
      }
    });

    var MILLIS_IN_DAY = 86400000;
    var MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;

    /* FREE BUSY MANAGERS */
    var FreeBusyProto = {
      getStart: function() {return this.getOption('start')},
      getEnd: function() {return this.getOption('end')},
      getOption: function() {
          if (!arguments.length) { return this.options }
          if (typeof(this.options[arguments[0]]) !== 'undefined') {
            return this.options[arguments[0]];
          }
          else if (typeof(arguments[1]) !== 'undefined') {
            return arguments[1];
          }
          return null;
        },
      setOption: function(key, value) {
          if (arguments.length == 1) {
            $.extend(this.options, arguments[0]);
            return this;
          }
          this.options[key] = value;
          return this;
        },
      isWithin: function(dateTime) {return Math.floor(dateTime.getTime() / 1000) >= Math.floor(this.getStart().getTime() / 1000) && Math.floor(dateTime.getTime() / 1000) <= Math.floor(this.getEnd().getTime() / 1000)},
      isValid: function() {return this.getStart().getTime() < this.getEnd().getTime()}
    };

    /**
      * @constructor
      * single user freebusy manager.
      */
    var FreeBusy = function(options) {
      this.options = $.extend({}, options || {});
    };
    $.extend(FreeBusy.prototype, FreeBusyProto);

    var FreeBusyManager = function(options) {
      this.options = $.extend({
          defaultFreeBusy: {}
        }, options || {});
      this.freeBusys = [];
      this.freeBusys.push(new FreeBusy($.extend({
            start: this.getStart(),
            end: this.getEnd()
          }, this.options.defaultFreeBusy)));
    };
    $.extend(FreeBusyManager.prototype, FreeBusyProto, {
      /**
        * return matching freeBusys.
        * if you do not pass any argument, returns all freebusys.
        * if you only pass a start date, only matchinf freebusy will be returned.
        * if you pass 2 arguments, then all freebusys available within the time period will be returned
        * @param {Date} start [optionnal] if you do not pass end date, will return the freeBusy within which this date falls.
        * @param {Date} end [optionnal] the date where to stop the search.
        * @return {Array} an array of FreeBusy matching arguments.
        */
      getFreeBusys: function() {
          switch (arguments.length) {
            case 0:
              return this.freeBusys;
            case 1:
              var freeBusy = [];
              var start = arguments[0];
              if (!this.isWithin(start)) {
                return freeBusy;
              }
              $.each(this.freeBusys, function() {
                if (this.isWithin(start)) {
                  freeBusy.push(this);
                }
                if (Math.floor(this.getEnd().getTime() / 1000) > Math.floor(start.getTime() / 1000)) {
                  return false;
                }
              });
              return freeBusy;
            default:
              //we assume only 2 first args are revealants
              var freeBusy = [];
              var start = arguments[0], end = arguments[1];
              var tmpFreeBusy = new FreeBusy({start: start, end: end});
              if (end.getTime() < start.getTime() || this.getStart().getTime() > end.getTime() || this.getEnd().getTime() < start.getTime()) {
                return freeBusy;
              }
              $.each(this.freeBusys, function() {
                if (this.getStart().getTime() >= end.getTime()) {
                  return false;
                }
                if (tmpFreeBusy.isWithin(this.getStart()) && tmpFreeBusy.isWithin(this.getEnd())) {
                  freeBusy.push(this);
                }
                else if (this.isWithin(tmpFreeBusy.getStart()) && this.isWithin(tmpFreeBusy.getEnd())) {
                  var _f = new FreeBusy(this.getOption());
                  _f.setOption('end', tmpFreeBusy.getEnd());
                  _f.setOption('start', tmpFreeBusy.getStart());
                  freeBusy.push(_f);
                }
                else if (this.isWithin(tmpFreeBusy.getStart()) && this.getStart().getTime() < start.getTime()) {
                  var _f = new FreeBusy(this.getOption());
                  _f.setOption('start', tmpFreeBusy.getStart());
                  freeBusy.push(_f);
                }
                else if (this.isWithin(tmpFreeBusy.getEnd()) && this.getEnd().getTime() > end.getTime()) {
                  var _f = new FreeBusy(this.getOption());
                  _f.setOption('end', tmpFreeBusy.getEnd());
                  freeBusy.push(_f);
                }
              });
              return freeBusy;
          }
        },
      insertFreeBusy: function(freeBusy) {
          var freeBusy = new FreeBusy(freeBusy.getOption());
          //first, if inserted freebusy is bigger than manager
          if (freeBusy.getStart().getTime() < this.getStart().getTime()) {
            freeBusy.setOption('start', this.getStart());
          }
          if (freeBusy.getEnd().getTime() > this.getEnd().getTime()) {
            freeBusy.setOption('end', this.getEnd());
          }
          var start = freeBusy.getStart(), end = freeBusy.getEnd(),
              startIndex = 0, endIndex = this.freeBusys.length - 1,
              newFreeBusys = [];
          var pushNewFreeBusy = function(_f) {if (_f.isValid()) newFreeBusys.push(_f);};

          $.each(this.freeBusys, function(index) {
            //within the loop, we have following vars:
            // curFreeBusyItem: the current iteration freeBusy, part of manager freeBusys list
            // start: the insterted freeBusy start
            // end: the inserted freebusy end
            var curFreeBusyItem = this;
            if (curFreeBusyItem.isWithin(start) && curFreeBusyItem.isWithin(end)) {
              /*
                we are in case where inserted freebusy fits in curFreeBusyItem:
                curFreeBusyItem:    *-----------------------------*
                freeBusy:                *-------------*
                obviously, start and end indexes are this item.
              */
              startIndex = index;
              endIndex = index;
              if (start.getTime() == curFreeBusyItem.getStart().getTime() && end.getTime() == curFreeBusyItem.getEnd().getTime()) {
                /*
                  in this case, inserted freebusy is exactly curFreeBusyItem:
                  curFreeBusyItem:    *-----------------------------*
                  freeBusy:            *-----------------------------*

                  just replace curFreeBusyItem with freeBusy.
                */
                var _f1 = new FreeBusy(freeBusy.getOption());
                pushNewFreeBusy(_f1);
              }
              else if (start.getTime() == curFreeBusyItem.getStart().getTime()) {
                /*
                  in this case inserted freebusy starts with curFreeBusyItem:
                  curFreeBusyItem:    *-----------------------------*
                  freeBusy:            *--------------*

                  just replace curFreeBusyItem with freeBusy AND the rest.
                */
                var _f1 = new FreeBusy(freeBusy.getOption());
                var _f2 = new FreeBusy(curFreeBusyItem.getOption());
                _f2.setOption('start', end);
                pushNewFreeBusy(_f1);
                pushNewFreeBusy(_f2);
              }
              else if (end.getTime() == curFreeBusyItem.getEnd().getTime()) {
                /*
                  in this case inserted freebusy ends with curFreeBusyItem:
                  curFreeBusyItem:    *-----------------------------*
                  freeBusy:                          *--------------*

                  just replace curFreeBusyItem with before part AND freeBusy.
                */
                var _f1 = new FreeBusy(curFreeBusyItem.getOption());
                _f1.setOption('end', start);
                var _f2 = new FreeBusy(freeBusy.getOption());
                pushNewFreeBusy(_f1);
                pushNewFreeBusy(_f2);
              }
              else {
                /*
                  in this case inserted freebusy is within curFreeBusyItem:
                  curFreeBusyItem:    *-----------------------------*
                  freeBusy:                    *--------------*

                  just replace curFreeBusyItem with before part AND freeBusy AND the rest.
                */
                var _f1 = new FreeBusy(curFreeBusyItem.getOption());
                var _f2 = new FreeBusy(freeBusy.getOption());
                var _f3 = new FreeBusy(curFreeBusyItem.getOption());
                _f1.setOption('end', start);
                _f3.setOption('start', end);
                pushNewFreeBusy(_f1);
                pushNewFreeBusy(_f2);
                pushNewFreeBusy(_f3);
              }
              /*
                as work is done, no need to go further.
                return false
              */
              return false;
            }
            else if (curFreeBusyItem.isWithin(start) && curFreeBusyItem.getEnd().getTime() != start.getTime()) {
              /*
                in this case, inserted freebusy starts within curFreeBusyItem:
                curFreeBusyItem:    *----------*
                freeBusy:                *-------------------*

                set start index AND insert before part, we'll insert freebusy later
              */
              if (curFreeBusyItem.getStart().getTime() != start.getTime()) {
                var _f1 = new FreeBusy(curFreeBusyItem.getOption());
                _f1.setOption('end', start);
                pushNewFreeBusy(_f1);
              }
              startIndex = index;
            }
            else if (curFreeBusyItem.isWithin(end) && curFreeBusyItem.getStart().getTime() != end.getTime()) {
              /*
                in this case, inserted freebusy starts within curFreeBusyItem:
                curFreeBusyItem:                  *----------*
                freeBusy:            *-------------------*

                set end index AND insert freebusy AND insert after part if needed
              */
              pushNewFreeBusy(new FreeBusy(freeBusy.getOption()));
              if (end.getTime() < curFreeBusyItem.getEnd().getTime()) {
                var _f1 = new FreeBusy(curFreeBusyItem.getOption());
                _f1.setOption('start', end);
                pushNewFreeBusy(_f1);
              }
              endIndex = index;
              return false;
            }
          });
          //now compute arguments
          var tmpFB = this.freeBusys;
          this.freeBusys = [];

          if (startIndex) {
            this.freeBusys = this.freeBusys.concat(tmpFB.slice(0, startIndex));
          }
          this.freeBusys = this.freeBusys.concat(newFreeBusys);
          if (endIndex < tmpFB.length) {
            this.freeBusys = this.freeBusys.concat(tmpFB.slice(endIndex + 1));
          }
/*          if(start.getDate() == 1){
          console.info('insert from '+freeBusy.getStart() +' to '+freeBusy.getEnd());
            console.log('index from '+ startIndex + ' to ' + endIndex);
            var str = [];
            $.each(tmpFB, function(i){str.push(i + ": " + this.getStart().getHours() + ' > ' + this.getEnd().getHours() + ' ' + (this.getOption('free') ? 'free' : 'busy'))});
            console.log(str.join('\n'));

            console.log('insert');
            var str = [];
            $.each(newFreeBusys, function(i){str.push(this.getStart().getHours() + ' > ' + this.getEnd().getHours())});
            console.log(str.join(', '));

            console.log('results');
            var str = [];
            $.each(this.freeBusys, function(i){str.push(i + ": " + this.getStart().getHours() + ' > ' + this.getEnd().getHours()  + ' ' + (this.getOption('free') ? 'free' :'busy'))});
            console.log(str.join('\n'));
          }*/
          return this;
        }
    });

})(jQuery);
