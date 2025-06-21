
var loadSportlisting = function () 
{
  fetch("http://localhost:8080/sports").then(function (response) 
  {
    response.json().then(function (data) 
    {
      console.log("data received from server:", data);

      // for loop
      var historylist = document.querySelector("#history");
      historylist.innerHTML = "";

      data.forEach(function (sport) 
      {

        var newItem = document.createElement("li");
        
        var titleheading = document.createElement("h2");
        titleheading.innerHTML = sport.teamname;
        newItem.appendChild(titleheading);

        var titleheading = document.createElement("h3");
        titleheading.innerHTML = "League"+ "  " + "Conferance" +  " " + "Ranked" +  " " + "Location" +  "  " + "Mascot";
        newItem.appendChild(titleheading);

        var teamDiv = document.createElement("p");
        teamDiv.innerHTML = sport.league +  " | " + sport.conferance + " | " + sport.teamrank + " | " + sport.location + " | " + sport.mascot;
        newItem.appendChild(teamDiv);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";

        deleteButton.onclick = function()
        {

          console.log("Delete Button Clicked", sport.id);
          if(confirm("Are you sure you want to delete " + sport.teamname + " ? "))
          {
            deleteSportEvent(sport.id);
          };

        };

        var updateButton = document.createElement("button");
        updateButton.innerHTML = "Update";
        updateButton.onclick = function()
        {
          console.log("Edit Button Clicked", sport.id);
          updateSportEvent(sport.id,sport.league,sport.teamname,sport.conferance,sport.teamrank,sport.location,sport.mascot);

          loadSportlisting()

          var redisplay = document.querySelector("#edit_div");
          redisplay.style.display = "block";
          var insertdisplay = document.querySelector("#insert_div");
          insertdisplay.style.display = "none";
          var itemlist = document.querySelector("#SportList");
          itemlist.style.display = "none";
          displaynewsportlist.style.display = "none";
         
        }
          newItem.appendChild(deleteButton);
          newItem.appendChild(updateButton);
          historylist.appendChild(newItem);
      });
    });
  });
}


var deleteSportEvent = function(sportid)
{

  fetch("http://localhost:8080/sports/" + sportid, 
  {

    method: "DELETE"

  }).then(function(){

    loadSportlisting();

  })

};


loadSportlisting();


var addButton = document.querySelector("#Add");
addButton.onclick = function () {

  var newSportEventLeague = document.querySelector("#league_field").value;
  var newSportEventTeamName = document.querySelector("#teamname_field").value;
  var newSportEventConferance = document.querySelector("#conferance_field").value;
  var newSportEventTeamRank = document.querySelector("#teamrank_field").value;
  var newSportEventLocation = document.querySelector("#location_field").value;
  var newSportEventMascot = document.querySelector("#mascot_field").value;

  var bodyStr = "league=" + encodeURIComponent(newSportEventLeague);
  bodyStr += "&teamname=" + encodeURIComponent(newSportEventTeamName);
  bodyStr += "&conferance=" + encodeURIComponent(newSportEventConferance);
  bodyStr += "&teamrank=" + encodeURIComponent(newSportEventTeamRank);
  bodyStr += "&location=" + encodeURIComponent(newSportEventLocation);
  bodyStr += "&mascot=" + encodeURIComponent(newSportEventMascot);


  fetch("http://localhost:8080/sports", {
    //request parameters:
    method: "POST",
    body: bodyStr,
    headers: {

      "Content-Type": "application/x-www-form-urlencoded"

    } // this is a dictionary

  }).then(function (response) {
    // handle the response
    console.log("Sever responded")
    clearInputInsert();
    loadSportlisting()

  });

  var insertdiv = document.querySelector("#insert_div");
  insertdiv.style.display = "none";
  displaynewsportlist.style.display = "block";
  var itemlist = document.querySelector("#SportList");
  itemlist.style.display = "block";
  
};



var updateSportEvent = function (sportid,league,teamname,conferance,teamrank,location,mascot) {

  document.querySelector("#edit_league_field").value = league;
  document.querySelector("#edit_teamname_field").value = teamname;
  document.querySelector("#edit_conferance_field").value  = conferance;
  document.querySelector("#edit_teamrank_field").value = teamrank;
  document.querySelector("#edit_location_field").value = location;
  document.querySelector("#edit_mascot_field").value = mascot;

  var saveButton = document.querySelector("#Save");
  saveButton.onclick = function(){

    var newSportEventLeague = document.querySelector("#edit_league_field").value;
    var newSportEventTeamName = document.querySelector("#edit_teamname_field").value;
    var newSportEventConferance = document.querySelector("#edit_conferance_field").value;
    var newSportEventTeamRank = document.querySelector("#edit_teamrank_field").value;
    var newSportEventLocation = document.querySelector("#edit_location_field").value;
    var newSportEventMascot = document.querySelector("#edit_mascot_field").value;

    clearInputUpdate();
    loadSportlisting()

    console.log(sportid, "was clicked")
    var bodyStr = "league=" + encodeURIComponent(newSportEventLeague);
    bodyStr += "&teamname=" + encodeURIComponent(newSportEventTeamName);
    bodyStr += "&conferance=" + encodeURIComponent(newSportEventConferance);
    bodyStr += "&teamrank=" + encodeURIComponent(newSportEventTeamRank);
    bodyStr += "&location=" + encodeURIComponent(newSportEventLocation);
    bodyStr += "&mascot=" + encodeURIComponent(newSportEventMascot);


    fetch("http://localhost:8080/sports/" + sportid ,{
      //request parameters:
      method: "PUT",
      body: bodyStr,
      headers: {

        "Content-Type": "application/x-www-form-urlencoded"

      } // this is a dictionary

    }).then(function (response) {
      // handle the response
      loadSportlisting()
      console.log("Sever responded")

    });


    var insert_div_container = document.querySelector("#insert_div");
    insert_div_container.style.display = "none";
    var edit_div_container = document.querySelector("#edit_div");
    edit_div_container.style.display = "none";
    var itemlist = document.querySelector("#SportList");
    itemlist.style.display = "block";
    displaynewsportlist.style.display = "block";
  
  };
};

loadSportlisting()

var displaynewsportlist = document.querySelector("#Add_sport");
  displaynewsportlist.onclick = function (){
    var insert_div_container = document.querySelector("#insert_div");
    insert_div_container.style.display = "block";
    displaynewsportlist.style.display = "none";
    var itemlist = document.querySelector("#SportList");
    itemlist.style.display = "none";

}

var displayinsertsportlist = document.querySelector("#Back1");
  displayinsertsportlist.onclick = function (){
    var itemlist = document.querySelector("#SportList");
    itemlist.style.display = "block";
    var insert_div_container = document.querySelector("#insert_div");
    insert_div_container.style.display = "none";
    var sportlistbutton = document.querySelector("#Add_sport");
    sportlistbutton.style.display = "block";

}

var displayeditsportlist = document.querySelector("#Back2");
  displayeditsportlist.onclick = function (){
    var itemlist = document.querySelector("#SportList");
    itemlist.style.display = "block";
    var edit_div_container = document.querySelector("#edit_div");
    edit_div_container.style.display = "none";
    var sportlistbutton = document.querySelector("#Add_sport");
    sportlistbutton.style.display = "block";

}


var clearInputInsert = function(){

  
  document.querySelector("#league_field").value = "";
  document.querySelector("#teamname_field").value = "";
  document.querySelector("#conferance_field").value  = "";
  document.querySelector("#teamrank_field").value = "";
  document.querySelector("#location_field").value = " ";
  document.querySelector("#mascot_field").value = "";


}

var clearInputUpdate = function(){

  document.querySelector("#league_field").value = "";
  document.querySelector("#teamname_field").value = "";
  document.querySelector("#conferance_field").value  = "";
  document.querySelector("#teamrank_field").value = "";
  document.querySelector("#location_field").value = " ";
  document.querySelector("#mascot_field").value = "";

}
