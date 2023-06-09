! function ($) {
     "use strict";
 
     var CalendarApp2 = function () {
         this.$body = $("body")
         this.$calendar = $('#calendar'),
             this.$event = ('#calendar-events div.calendar-events'),
             this.$categoryForm = $('#add-new-event form'),
             this.$extEvents = $('#calendar-events'),
             this.$modal = $('#my-event'),
             this.$saveCategoryBtn = $('.save-category'),
             this.$calendarObj = null
     };
 
 
     /* on drop */
     CalendarApp2.prototype.onDrop = function (eventObj, date) {
         var $this = this;
         // retrieve the dropped element's stored Event Object
         var originalEventObject = eventObj.data('eventObject');
         var $categoryClass = eventObj.attr('data-class');
         // we need to copy it, so that multiple events don't have a reference to the same object
         var copiedEventObject = $.extend({}, originalEventObject);
         // assign it the date that was reported
         copiedEventObject.start = date;
         if ($categoryClass)
             copiedEventObject['className'] = [$categoryClass];
         // render the event on the calendar
         $this.$calendar.fullCalendar('renderEvent', copiedEventObject, true);
         // is the "remove after drop" checkbox checked?
         if ($('#drop-remove').is(':checked')) {
             // if so, remove the element from the "Draggable Events" list
             eventObj.remove();
         }
     },
         CalendarApp2.prototype.enableDrag = function () {
             //init events
             $(this.$event).each(function () {
                 // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                 // it doesn't need to have a start or end
                 var eventObject = {
                     title: $.trim($(this).text()) // use the element's text as the event title
                 };
                 // store the Event Object in the DOM element so we can get to it later
                 $(this).data('eventObject', eventObject);
                 // make the event draggable using jQuery UI
                 $(this).draggable({
                     zIndex: 999,
                     revert: true, // will cause the event to go back to its
                     revertDuration: 0 //  original position after the drag
                 });
             });
         }
     /* Initializing */
     CalendarApp2.prototype.init = function ( datadispo, dataoccu) {
         console.log(datadispo);
         console.log(dataoccu);
         this.enableDrag();
         /*  Initialize the calendar  */
         var date = new Date();
         var d = date.getDate();
         var m = date.getMonth();
         var y = date.getFullYear();
         var form = '';
         var today = new Date($.now());

         var datas_dispo =[];
         var datas_occu =[];
         if(datadispo!=null){
              datas_dispo=datadispo;
         }  
         if(dataoccu!=null){
               datas_occu=dataoccu;
         }
     
         //traitement des disponibilite
         const event=[];
          for (let i = 0; i < datas_dispo.length; i++) {
               event.push({
                   id:i,
                    title: "disponible",
                    start: transformTime(datas_dispo[i].timestart), // Heure de début (8h)
                    end: transformTime(datas_dispo[i].timeend), // Heure de fin (17h)
                    dow: [datas_dispo[i].weekday], // Jours de la semaine (lundi à vendredi)// Date de début de la récurrence (aujourd'hui)
                    className: 'bg-success'
               }
               );
          }
          console.log(event)
             var $this = this;
             $this.$calendarObj = $this.$calendar.fullCalendar({
                 slotDuration: '00:15:00',
                 /* If we want to split day time each 15minutes */
                 minTime: '08:00:00',
                 maxTime: '19:00:00',
                 defaultView: 'month',
                 handleWindowResize: true,
 
                 header: {
                     left: 'prev,next today',
                     center: 'title',
                     right: 'month,agendaWeek,agendaDay'
                 },
                 events: event,
                 editable: true,
                 droppable: true, // this allows things to be dropped onto the calendar !!!
                 eventLimit: true, // allow "more" link when too many events
                 selectable: true,
                 drop: function (date) { $this.onDrop($(this), date); },
                 select: function (start, end, allDay) { $this.onSelect(start, end, allDay); },
                 eventClick: function (calEvent, jsEvent, view) { $this.onEventClick(calEvent, jsEvent, view); }
 
             });
     },
         //init CalendarApp
         $.CalendarApp2 = new CalendarApp2, $.CalendarApp2.Constructor = CalendarApp2
 
 }(window.jQuery),

    //initializing CalendarApp
    $(window).on('load', function () {
    });
 