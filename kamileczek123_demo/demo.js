$(document).ready(function() {

  //example user objects array which would come from web container
  var usersJsonArray = {
      "jsonStaffArray":[
                        {"staffId":3,"userId":0,"userShortName":"BobBoo"},
                        {"staffId":6,"userId":1,"userShortName":"MarSmi"},
                        {"staffId":2,"userId":2,"userShortName":"MelDoe"}
                       ]}.jsonStaffArray;
  //prepare staff mapping object
  $staffIdMappingHash = doStaffIdMapping(usersJsonArray);
  //display google calendar like events headers 
  var googleCalendarLikeEventHeader = true;
  var $calendar = $('#calendar');

  $calendar.weekCalendar({
      eventNew : function(calEvent, $event) {
        $('<div id="newEventDialog"></div>')
        .html(
          "<table border=\"0\">" +
          "<tbody>" +
          "<tr>" +
          "<td>" +
          "<form id=\"newEventForm\" name=\"newEventForm\" action=\"/addCalendarEvent\" method=\"post\" onreset=\"\" accept-charset=\"utf-8\">" +
          "<h2>New input form goes here. Check demo code.</h2>" +
          "</form>" +
          "</td>" +
          "</tr>" +
          "</tbody>" +
          "</table>"
        )
        .dialog({
          autoOpen: false,
          dialogClass: 'alert',
          resizable: false,
          modal: true,
          width: 460,
          open: function(event, ui){
            $('.ui-dialog .ui-dialog-content').css('overflow','hidden');
            $('.ui-widget-overlay').css('width','100%');
            
            $('.alert').css('background', 'none');
            $('.alert').css('background-color', '#fff');
          }, 
          close: function(event, ui){
            $('.ui-dialog .ui-dialog-content').css('overflow','auto');
            $('#calendar').weekCalendar('removeUnsavedEvents');
            $(this).remove();
          },
          show: 'fade',
          hide: 'fade'
        });
        $('#newEventDialog').dialog('open');

//example of ajax call how to use calendar user mapping on objects existing at server side
/*
        $.ajax({
         //url to your web server method which will handle calendar's event params and send eg. some event details in
         //response - like list of possible tasks, etc.
         url: "",
         type: "POST",
         dataType: "json",
         contentType: "application/x-www-form-urlencoded;charset=utf-8",
         data: {
           //send some event data to server - especially user id mapped from calendar
           isoDateStart: calEvent.start.toString('yyyy-MM-dd HH:mm'),
           userId: function() {
             var usersComboUser = $calendar.weekCalendar("option", "usersComboUser");
             var result = null;
             if(usersComboUser != 'null' && usersComboUser !== null) {
               result = $staffIdMappingHash.getItem(usersComboUser);
             }
             else {
               result =  $staffIdMappingHash.getItem(calEvent.userId);
             }
             return result;
           }
         },
         success: function(data) {
           //data should return some parameters from server related to new event, it depends what you want to add
           //to the event and what logic your event at server side has
           $('<div id="newEventDialog"></div>')
           .html(
             "<table border=\"0\">" +
             "<tbody>" +
             "<tr>" +
             "<td>" +
             "<form id=\"newEventForm\" name=\"newEventForm\" action=\"/addCalendarEvent\" method=\"post\" onreset=\"\" accept-charset=\"utf-8\">" +
             "<input type=\"hidden\" id=\"userId\" name=\"userId\" value=\"" + $data.staffId + "\"/>" +
             "</form>" +
             "</td>" +
             "</tr>" +
             "</tbody>" +
             "</table>"
           )
           .dialog({
             autoOpen: false,
             dialogClass: 'alert',
             resizable: false,
             modal: true,
             width: 460,
             open: function(event, ui){
               $('.ui-dialog .ui-dialog-content').css('overflow','hidden');
               $('.ui-widget-overlay').css('width','100%');
               
               $('.alert').css('background', 'none');
               $('.alert').css('background-color', '#fff');
             }, 
             close: function(event, ui){
               $('.ui-dialog .ui-dialog-content').css('overflow','auto');
               $('#calendar').weekCalendar('removeUnsavedEvents');
               $(this).remove();
             },
             show: 'fade',
             hide: 'fade'
           });
           $('#newEventDialog').dialog('open');
         },
         error: function() {
           alert("Server connection error: getParamsForCalendarEvent.");
         },
         statusCode: httpStatusCodes
       })
*/
      },
      date: new Date(),
      height: function($calendar){
        return (24 - 6) * 2 * 25 + (3 * 25);
      },
      showAsSeparateUsers: true,
      timeslotsPerHour: 2,
      displayOddEven: true,
      timeslotHeight: 25,
      firstDayOfWeek: 1,
      businessHours: {start: 6, end: 24, limitDisplay: true},
      startOnFirstDayOfWeek: false,
      timeFormat: "h:i a",
      dateFormat: "d F Y",
      use24Hour: false,
//body of this function can store some param from calendar in your web application session object, thus if you
//refresh calendar or go back to it from other page its view will like previously when you left it
      storeCalParamsInSessionFunction: function(daysToShow, calendarUser, calendar) {
/*
//example of callback function to store calendar params in web container session
        var initDate = 0;
        if(daysToShow == 0) {
          initDate = calendar.options.date.getTime();
        }
        $.ajax({
          async: false,
          //url to your web server method which will handle calendar params and put it into session
          url: "",
          type: "POST",
          dataType: "json",
          contentType: "application/x-www-form-urlencoded;charset=utf-8",
          data: {
            calDaysToShowInSession: daysToShow,
            calDateInSession: initDate,
            calUserToShowInSession: calendar.options.usersComboUser
          },
          success: function(data) {
            calendar.options.daysToShow = data.calDaysToShowInSession;
            calendar.options.date = new Date(data.calDateInSession);
            calendar.options.usersComboUser = data.calUserToShowInSession;
          },
          error: function() {
            alert("Server connection error: setSessionCalendarParameters.");
          },
          statusCode: httpStatusCodes
        });
*/
      },
      daysToShow: 7,
      data: function(start, end, callback) {
        callback(getWrappedEventsArray(getEventData(), usersJsonArray));
/*
//example of function which retrieves data for event through ajax from web container
        $.ajax({
          //block calendar while data for events is retrieved from web server
          beforeSend: function() {
            $.blockUI({
              css: { 
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff' 
              },
              message:  '<h1 style="font-weight: lighter; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif">Please wait...</h1>',
              fadeIn:  200,
              fadeOut:  200,
              blockMsgClass: 'blockMsg ui-corner-all'
            });
          },
          complete: function() {
            $.unblockUI();
          },
          //url to your web server method which will send in response your calendar events based on requested dates
          url: "",
          type: "POST",
          dataType: "json",
          contentType: "application/x-www-form-urlencoded;charset=utf-8",
          data: {
            calStartTimestamp: start.getTime(),
            calEndTimestamp: end.getTime()
          },
          success: function(data) {
            var eventsJsonArray = data.jsonEventsArray;
            //remapping events and users from web server into calendar users index
            callback(getWrappedEventsArray(eventsJsonArray, usersJsonArray));
          },
          error: function() {
            alert("Server connection error: getCalendarEvents.");
          },
          statusCode: httpStatusCodes
        });
*/
      },
      //example on how web servers users are remapped into calendar users
      users: getWrappedUserNamesArray(usersJsonArray),
      showUsersCombo: true,
      //initial user in users combo for who the calendar is rendered (mostly taken from session, when calendar is reopen)
      //it should replaced at server side on something like this:
      //if(usersComboUser != null) {set usersComboUser} else {"null"}
      usersComboUser: "null",
      //starting element in users combo description
      usersComboAllUsersEntry: 'All',
      buttons: true,
      buttonText: {today : 'today', lastWeek : '<', nextWeek : '>'},
      shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      headerSeparator: "</br>",
      //definition of google calendar like event header
      eventHeader: function(calEvent, calendar) {
        var header;
        if(googleCalendarLikeEventHeader) {
          if($("#calendar").weekCalendar("option", "use24Hour")){
            if(new Date(calEvent.start.getTime()).toString('mm') == '00'){
              header = new Date(calEvent.start.getTime()).toString('H');
            }
            else {
              header = new Date(calEvent.start.getTime()).toString('H:mm');
            }
            if(calEvent.start.getTime() != calEvent.end.getTime()) {
              header += " - ";
              if(new Date(calEvent.end.getTime()).toString('mm') == '00'){
                header += new Date(calEvent.end.getTime()).toString('H');
              }
              else {
                header += new Date(calEvent.end.getTime()).toString('H:mm');
              }
            }
          }
          else {
            header = new Date(calEvent.start.getTime()).toString('h');
            if(new Date(calEvent.start.getTime()).toString('mm') != '00'){
              header += ":" + new Date(calEvent.start.getTime()).toString('mm');
            }
            if(new Date(calEvent.start.getTime()).toString('tt') == 'PM'){
              header += "p";
            }
            if(calEvent.start.getTime() != calEvent.end.getTime()) {
              header += " - ";
              header += new Date(calEvent.end.getTime()).toString('h');
              if(new Date(calEvent.end.getTime()).toString('mm') != '00'){
                header += ":" + new Date(calEvent.end.getTime()).toString('mm');
              }
              if(new Date(calEvent.end.getTime()).toString('tt') == 'PM'){
                header += "p";
              }
            }
          }
        }
        else {
          header = calendar.weekCalendar('formatTime', calEvent.start) + " - " + calendar.weekCalendar('formatTime', calEvent.end);
        } 
        return header;
      },
      newEventText: "",
      timeSeparator: " ",
      allowCalEventOverlap: true,
      overlapEventsSeparate: true,
      useShortDayNames: false,
      title: function(date, calendar) {
        return "%date%";
      },
      //datepicker reginal translation
      datepicker: $.datepicker.regional['en'],
      resizable: function(calEvent, $event) {
        return false;
      },
      draggable: function(calEvent, $event) {
        var d1 = new Date(calEvent.end).clearTime();
        var d2 = new Date().clearTime();
        if(d1 < d2) {
          return false;
        }
        return true;
      },
      eventRender: function(calEvent, $event) {
        var d1 = new Date(calEvent.end).clearTime();
        var d2 = new Date().clearTime();
        if(d1 < d2) {
          $event.find(".wc-time").css({"backgroundColor": "#FF5C55", "border":"1px solid #FF5C55"});
        }
      },
      eventClick: function(calEvent, element, freeBusyManager, $calendar, DomEvent) {
        $properties = { title: calEvent.title };
        var d1 = new Date(calEvent.end).clearTime();
        var d2 = new Date().clearTime();
        if(d1 < d2) {
          $properties = "Non-editable";
        }
        else {
          $properties = "Editable";
        }
        $('<div id="editEventDialog"></div>')
        .html(
          "<table border=\"0\">" +
          "<tbody>" +
          "<tr>" +
          "<td>" +
          "<form id=\"editEventForm\" name=\"editEventForm\" action=\"/editCalendarEvent\" method=\"post\" onreset=\"\" accept-charset=\"utf-8\">" +
          "<h2>" + $properties + " input form goes here. Check demo code.</h2>" +
          "</form>" +
          "</td>" +
          "</tr>" +
          "</tbody>" +
          "</table>"
        )
        .dialog({
          autoOpen: false,
          dialogClass: 'alert',
          resizable: false,
          modal: true,
          width: 460,
          open: function(event, ui){
            $('.ui-dialog .ui-dialog-content').css('overflow','hidden');
            $('.ui-widget-overlay').css('width','100%');
            
            $('.alert').css('background', 'none');
            $('.alert').css('background-color', '#fff');
          }, 
          close: function(event, ui){
            $('.ui-dialog .ui-dialog-content').css('overflow','auto');
            $('#calendar').weekCalendar('removeUnsavedEvents');
            $(this).remove();
          },
          show: 'fade',
          hide: 'fade'
        });
        $('#editEventDialog').dialog('open');
      },
      eventDrop: function(calEvent, $event) {
//example how to save moved and dropped event through ajax
/*
        $.ajax({
          async: false,
          //url to your web server method which will store new calendar's event params
          url: "",
          type: "POST",
          dataType: "json",
          contentType: "application/x-www-form-urlencoded;charset=utf-8",
          data: {
            id: calEvent.id,
            isoDateStart: calEvent.start.toString('yyyy-MM-dd HH:mm'),
            userId: $staffIdMappingHash.getItem(calEvent.userId)
          },
          success: function(data) {
            //tweak for response content
            data = "OK";
            if(data == 'OK') {
              $('#calendar').weekCalendar('refresh');
            }
            else {
              $('#calendar').weekCalendar('removeUnsavedEvents');
            }
          },
          error: function() {
            alert("Server connection error: updateCalendarVisit.");
          },
          statusCode: httpStatusCodes
        });
*/
      }
  });
});

//example events data
function getEventData() {
  var year = new Date().getFullYear();
  var month = new Date().getMonth();
  var day = new Date().getDate();

  return {
    jsonEventArray : [
      {
         "id":1,
         "userId":6,
         "start": new Date(year, month, day, 8),
         "end": new Date(year, month, day, 10, 30),
         "title":"Event 1<hr>Name 1<hr>Description 1"
      },
      {
         "id":2,
         "userId":2,
         "start": new Date(year, month, day, 14),
         "end": new Date(year, month, day, 14, 45),
         "title":"Event 2<hr>Name 2<hr>Description 2"
      },
      {
         "id":3,
         "userId":2,
         "start": new Date(year, month, day + 1, 10),
         "end": new Date(year, month, day + 1, 11),
         "title":"Event 3<hr>Name 3<hr>Description 3"
      },
      {
         "id":4,
         "userId":3,
         "start": new Date(year, month, day + 1, 14),
         "end": new Date(year, month, day + 1, 14, 30),
         "title":"Event 4<hr>Name 4<hr>Description 4"
      },
      {
         "id":5,
         "userId":3,
         "start": new Date(year, month, day + 2, 15),
         "end": new Date(year, month, day + 2, 16),
         "title":"Event 5<hr>Name 5<hr>Description 5"
      },
      {
         "id":6,
         "userId":6,
         "start": new Date(year, month, day + 2, 9),
         "end": new Date(year, month, day + 2, 11),
         "title":"Event 6<hr>Name 6<hr>Description 6"
      }
     ]
  }.jsonEventArray;
}

function getWrappedUserNamesArray(jsonUsers) {
  var usersArray = new Array();
  for(var i=0; i < jsonUsers.length; i++) {
    usersArray.push(jsonUsers[i].userShortName);
  }
  return usersArray;
}

function getWrappedEventsArray(jsonEvents, jsonUsers) {
  var staffIdMappingHash = doStaffIdMapping(jsonUsers);
  for(var i=0; i < jsonEvents.length; i++) {
    for(var j=0; j < staffIdMappingHash.size(); j++) {
      if(staffIdMappingHash.getItem(j) == jsonEvents[i].userId) {
        jsonEvents[i].userId = j;
        break;
      }
    }
  }
  return jsonEvents;
}

function doStaffIdMapping(jsonUsers) {
  var mappedUsersHash = new Hash();
  for(i=0; i < jsonUsers.length; i++) {
    mappedUsersHash.setItem(jsonUsers[i].userId, jsonUsers[i].staffId);
  }
  return mappedUsersHash;
}

var httpStatusCodes = { 
    505: function() { alert('Error 505: HTTP Version Not Supported'); },
    504: function() { alert('Error 504: Gateway Timeout'); },
    503: function() { alert('Error 503: Service Unavailable'); },
    502: function() { alert('Error 502: Bad Gateway'); },
    501: function() { alert('Error 501: Not Implemented'); },
    500: function() { alert('Error 500: Internal Server Error'); },
    408: function() { alert('Error 408: Request Timeout'); },
    404: function() { alert('Error 404: Page Not Found'); },
    403: function() { alert('Error 403: Forbidden'); },
    401: function() { alert('Error 401: Unauthorized'); },
    400: function() { alert('Error 400: Bad Request'); }
  }

function Hash() {
  this.length = 0;
  this.items = new Array();
  for (var i = 0; i < arguments.length; i += 2) {
    if (typeof(arguments[i + 1]) != 'undefined') {
      this.items[arguments[i]] = arguments[i + 1];
      this.length++;
    }
  }

  this.removeItem = function(in_key) {
    var tmp_previous;
    if (typeof(this.items[in_key]) != 'undefined') {
      this.length--;
      var tmp_previous = this.items[in_key];
      delete this.items[in_key];
    }
    return tmp_previous;
  }

  this.getItem = function(in_key) {
    return this.items[in_key];
  }

  this.setItem = function(in_key, in_value) {
    var tmp_previous;
    if (typeof(in_value) != 'undefined') {
      if (typeof(this.items[in_key]) == 'undefined') {
        this.length++;
      }
      else {
        tmp_previous = this.items[in_key];
      }
      this.items[in_key] = in_value;
    }
    return tmp_previous;
  }

  this.hasItem = function(in_key) {
    return typeof(this.items[in_key]) != 'undefined';
  }

  this.clear = function() {
    for (var i in this.items) {
      delete this.items[i];
    }
    this.length = 0;
  }

  this.size = function() {
    return this.items.length;
  }
}