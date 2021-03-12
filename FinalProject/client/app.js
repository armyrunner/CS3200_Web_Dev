var URL = "http://localhost:8080"

var goldenticketlisting= function () {
  fetch(URL + "/tickets").then(function (response) {
    response.json().then(function (data) {
      console.log("data received from server:", data);

      // loop over the data and display it immediately:
      var historylist = document.querySelector("#history");
      historylist.innerHTML = "";
      data.forEach(function (eventlist) {
        // append each restaurant to a new element in the DOM

        // li tag: contains everything about one restaurant
        var newListItem = document.createElement("li");

        var dayOfWeek = new Date().getDay();

        var titleheading = document.createElement("h3");
        titleheading.innerHTML = "Name"+ "  " + "Age" +  " " + "Guest";
        newListItem.appendChild(titleheading);

        // h3 tag: contains the title
        var datainfo = document.createElement("p");
        datainfo.innerHTML = eventlist.entrant_name + " | " + eventlist.entrant_age + " | " + eventlist.guest_name ;
        newListItem.appendChild(datainfo);

        var winner = document.createElement("h2")

        if(dayOfWeek == eventlist.random_token){

          datainfo.innerHTML = eventlist.entrant_name + " | " + eventlist.entrant_age + " | " + eventlist.guest_name;
          winner.innerHTML = "***" + " WINNER " + "***";
          newListItem.appendChild(winner)


        }

        historylist.appendChild(newListItem);
      });
    });
  });
};

goldenticketlisting();


var addButton = document.querySelector("#Add");
addButton.onclick = function () {

  var newSportEventLeague = document.querySelector("#entrant_name").value;
  var newSportEventTeamName = document.querySelector("#entrant_age").value;
  var newSportEventConferance = document.querySelector("#guest_name").value;

  var bodyStr = "entrant_name=" + encodeURIComponent(newSportEventLeague);
  bodyStr += "&entrant_age=" + encodeURIComponent(newSportEventTeamName);
  bodyStr += "&guest_name=" + encodeURIComponent(newSportEventConferance);

  fetch(URL + "/tickets", {
    //request parameters:
    method: "POST",
      
    body: bodyStr,
    headers: {

      "Content-Type": "application/x-www-form-urlencoded"

    } // this is a dictionary

  }).then(function (response) {
    // handle the response
    console.log("Sever responded")

    goldenticketlisting();
    var goldenticket = document.querySelector("#goldenticketinfo");
    goldenticket.style.display = "none"; 
    var goldenticket = document.querySelector("#history");
    goldenticket.style.display = "block"; 


  });
};


var displayticketdiv = document.querySelector("#addticket");
  displayticketdiv.onclick = function (){
    var goldenticket = document.querySelector("#goldenticketinfo");
    goldenticket.style.display = "block"; 
    var goldenticket = document.querySelector("#history");
    goldenticket.style.display = "none"; 

}


var displayticketdiv = document.querySelector("#back");
  displayticketdiv.onclick = function (){
    var goldenticket = document.querySelector("#goldenticketinfo");
    goldenticket.style.display = "none"; 
    var goldenticket = document.querySelector("#history");
    goldenticket.style.display = "block"; 

}

