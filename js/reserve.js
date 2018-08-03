function humanReadableTime(hour, minute){
    let timeWhole = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM","4:00 PM"];
    let timeHalf = ["9:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "1:30 PM", "2:30 PM", "3:30 PM", "4:30 PM"];
    let toReturn ="";
    if(minute != 0){
        toReturn = timeHalf[Number(hour - 9)].toString();
    }else{
        toReturn = timeWhole[Number(hour - 9)].toString();
    }
    return toReturn;
}

function humanReadableDate(day, date, month){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let formattedDate = "";
    if((date == 1) || (date == 21) || (date == 31)){
        formattedDate = days[day] + ", " + months[month] + " " + date + "st";
    }else if((date == 2) || (date == 22)){
        formattedDate = days[day] + ", " + months[month] + " " + date + "nd";
    }else if((date == 3) || (date == 23)){
        formattedDate = days[day] + ", " + months[month] + " " + date + "rd";
    }else{
        formattedDate = days[day] + ", " + months[month] + " " + date + "th";
    }
    return formattedDate.toString();
}

function modalBuilder(timeStamp){
    //let now = 	Math.round(new Date().getTime()/1000);
    let grabNewDate = new Date(Number(timeStamp)*1000);
    let day = grabNewDate.getDay();
    let date = grabNewDate.getDate();
    let month = grabNewDate.getMonth() + 1;
    let hour = grabNewDate.getHours();
    let minute = grabNewDate.getMinutes();
    let dateToDisplay = humanReadableDate(day, date, month);
    let timeToDisplay = humanReadableTime(hour, minute);
    $("#freeAlert").text( dateToDisplay + " at " + timeToDisplay + " is available.");
    $("#freeAlert").prop("hidden", false);
    $("#takenAlert").prop("hidden", true);
    $("#reservationModal").modal("show");
}

function filter(timeStamp){
    firebase.database().ref("reservation/pending/" + timeStamp).once("value").then(function(pendingSnap){
        firebase.database().ref("reservation/approved/" + timeStamp).once("value").then(function(approveSnap){
            if(pendingSnap.exists()){
                $("#td" + timeStamp).text("Pending Reservation");
                $("#td" + timeStamp).addClass("pending-text");
                $("tr[data-timestamp='" + timeStamp + "']").prop("disabled", true);
            }else if(approvedSnap.exists()){
                $("#td" + timeStamp).text("Reserved");
                $("#td" + timeStamp).addClass("reserved-text");
                $("tr[data-timestamp='" + timeStamp + "']").prop("disabled", true);
            }else{
                $("tr[data-timestamp='" + timeStamp + "']").click(function(){
                    $("#freeAlert").prop("hidden", true);
                    $("#takenAlert").prop("hidden", true);
                    modalBuilder(timeStamp.toString());
                });
            }
        });
    });
}

function fillTable(selector){
    $("#tableToFill").empty();
    let times = ["9:00 AM", " ", "10:00 AM", " ", "11:00 AM", " ", "12:00 PM", " ", "1:00 PM", " ", "2:00 PM", " ", "3:00 PM", " ", "4:00 PM", " "];
    let timeStamp = $(selector.toString()).attr("data-timestamp");
    for(let i = 0; i<16; i++){
        /*Takes the date timestamp at 12 AM and adds 9 hours * 3600 seconds
        then adds the number of half hours (1800 seconds * i) to get the time*/
        let newTimeStamp = (Number(timeStamp) + (3600*9) + Number(1800*i));
        let tr =  "<tr id='tr" + i + "' data-timestamp='" + newTimeStamp + "' class='time-item'>" +
                      "<td>" + times[i] + "</td>" +
                      "<td id='td" + newTimeStamp + "'></td>" +
                  "</tr>";
        $("#tableToFill").append(tr);
        filter(newTimeStamp);
    }
  }

/*=============================================================================
cleanUpDate function:
1. primitive way of formating the date to be correct for the calendar
===============================================================================*/
function cleanUpDate(){
    let today = new Date().getDate();
    today = today + 1;
    let month = new Date().getMonth();
    month = month + 1;
    let year = new Date().getFullYear();
    if(month <= 9){
        month = "0" + month;
    }
    if(today <= 9){
        today = "0" + today;
    }
    let todayDateDefault = year + "-" + month + "-" + today;
    return todayDateDefault;
}

/*=============================================================================
required header for hello-week:
1. sets the options for the calendar
Source: https://maurovieirareis.github.io/hello-week/demos/documentation.html
Notes: All epoch times for days start at 12:00 AM
===============================================================================*/
new HelloWeek({
    langFolder: 'hello-week-master/dist/langs/',
    lang: 'en',
    format: 'DD-MM-YYYY',
    defaultDate: cleanUpDate(), // Only format YYYY-MM-DD
    multiplePick: false,
    daysHighlight: [],
    todayHighlight: true,
    disableDates: false,
    disablePastDays: true,
    disabledDaysOfWeek: [0,6],
    weekStart: 0,
    range: false,
    onLoad: () => { fillTable(".is-today") },
    onChange: () => { /** callback function */ },
    onSelect: () => { fillTable(".is-selected") },
    onClear: () => { /** callback function */ },
});

$( document ).ready(function() {

});
