/* Polish initialisation for the jQuery UI date picker plugin. */
/* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */
jQuery(function($){
  $.datepicker.regional['pl'] = {
    closeText: 'Zamknij',
    prevText: '&#x3c;Poprzedni',
    nextText: 'Następny&#x3e;',
    currentText: 'Dziś',
    monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
                 'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
    monthNamesShort: ['Sty','Lut','Mar','Kwi','Maj','Cze',
                      'Lip','Sie','Wrz','Paź','Lis','Gru'],
    dayNames: ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
    dayNamesShort: ['Niedz','Pon','Wt','Śr','Czw','Pt','Sob'],
    dayNamesMin: ['Ni','Pn','Wt','Śr','Cz','Pt','So'],
    weekHeader: 'Tydz',
    dateFormat: 'yy-mm-dd',
    yearRange: 'c-85:c+0',
    firstDay: 1};

$.datepicker.regional['en'] = {
    closeText: 'Done',
     prevText: 'Prev',
     nextText: 'Next',
     currentText: 'Today',
     monthNames: ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'],
     monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
     dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
     dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
     dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
     weekHeader: 'Wk',
     dateFormat: 'yy-mm-dd',
     yearRange: 'c-85:c+0',
     firstDay: 1};
});
