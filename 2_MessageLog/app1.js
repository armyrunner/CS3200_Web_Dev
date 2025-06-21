// movie variable

//var sports = [ "Utah Utes", "Utah State Aggies"];
var sports = [];


// create a button
var sportslisting = document.querySelector("#sportlist");
console.log("BUTTON", sportslisting);

sportslisting.onclick = function () {

  // randomly pic a sports event to watch
  var randomIndex = Math.floor(Math.random() * sports.length);
  var placement = sports[randomIndex];

  //update the heading with the random pick	
  var sportlisted = document.querySelector("#placement");
  sportlisted.innerHTML = placement; // string of object  

  // var historylist = document.querySelector("#history");
  // var newItem = document.createElement("li");
  // newItem.innerHTML = placement;
  // historylist.appendChild(newItem);

};


var loadSportlisting = function(){

  fetch("http://localhost:8080/sports").then(function (response) {
  console.log("server responded.");
  var hist = document.querySelector("#history");

  // parse (unpackage) the data from the server:
  response.json().then(function (sportingevents) {
    console.log("data received from server:", sportingevents);
    // (data is a list of objects)

    // save the data for use later (when the button is clicked):
    sports = sportingevents;

    // for loop
    var historylist = document.querySelector("#history");
    historylist.innerHTML = "";

    sports.forEach(function (venue) {
	  console.log(venue)

        var historylist = document.querySelector("#history");
        var newItem = document.createElement("li");
        newItem.innerHTML = venue;
        historylist.appendChild(newItem);


      // e.g. append each lunch place to the DOM, etc.
    });
  });
});

}


loadSportlisting()

// request the data from the server:


var addButton = document.querySelector("#add")
addButton.onclick = function () {

  var newSportEvent = document.querySelector("#sporthistory");
  var SportValue = newSportEvent.value;

  if (SportValue == " " || sports.length > 15 ){

    return;
  }

  var helpvar = "venue=" + encodeURIComponent(SportValue); // inputField.value to get values

  fetch("http://localhost:8080/sports", {
    //request parameters:
    method: "POST",
    body: helpvar,
    headers: {

      "Content-Type": "application/x-www-form-urlencoded"

    } // this is a dictionary

  }).then(function (response) {
    // handle the response
    loadSportlisting()
    console.log("Sever responded")

  });




};

// cross origin research exception  <the resource must come from the same origin or go to from the same server>
// same origin policy

