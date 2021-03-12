var heroku_url = "https://stormy-escarpment-54610.herokuapp.com";

var loadSportlisting = function () 
{
  fetch(heroku_url + "/sports",{

  credentials:"include"
  }).then(function (response) 
  {

    if( response.status == 200){

      var insertdiv = document.querySelector("#insert_div");
      insertdiv.style.display = "none";
      var regdisplay = document.querySelector("#register_div");
      regdisplay.style.display = "none";
      var regdisplay = document.querySelector("#login_div");
      regdisplay.style.display = "none";
      var redisplay = document.querySelector("#edit_div");
      redisplay.style.display = "none";
      var itemlist = document.querySelector("#SportList");
      itemlist.style.display = "block";
      var itemlist = document.querySelector("#history");
      itemlist.style.display = "block";
      var regdisplay = document.querySelector("#home");
      regdisplay.style.display = "none";
      displaynewsportlist.style.display = "block";
      signupsigninbutton.style.display = "none";

    }else{
      var itemlist = document.querySelector("#SportList");
      itemlist.style.display = "none";
      return;
    }


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
            loadSportlisting();

          };

        };

        var updateButton = document.createElement("button");
        updateButton.innerHTML = "Update";
        updateButton.onclick = function()
        {
          console.log("Edit Button Clicked", sport.id);
          updateSportEvent(sport.id,sport.league,sport.teamname,sport.conferance,sport.teamrank,sport.location,sport.mascot);
          //loadSportlisting()
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

  fetch(heroku_url + "/sports/" + sportid, 
  {

    method: "DELETE",
    credentials:"include"

  }).then(function(){

    loadSportlisting();

  })

};


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


  clearInputInsert();

  fetch(heroku_url + "/sports", {
    //request parameters:
    method: "POST",
    credentials:"include",
    body: bodyStr,
    headers: {

      "Content-Type": "application/x-www-form-urlencoded"

    } // this is a dictionary

  }).then(function (response) {
    // handle the response
    console.log("Sever responded")

    loadSportlisting();

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

    console.log(sportid, "was clicked")
    var bodyStr = "league=" + encodeURIComponent(newSportEventLeague);
    bodyStr += "&teamname=" + encodeURIComponent(newSportEventTeamName);
    bodyStr += "&conferance=" + encodeURIComponent(newSportEventConferance);
    bodyStr += "&teamrank=" + encodeURIComponent(newSportEventTeamRank);
    bodyStr += "&location=" + encodeURIComponent(newSportEventLocation);
    bodyStr += "&mascot=" + encodeURIComponent(newSportEventMascot);

    loadSportlisting();
    clearInputUpdate();

    fetch(heroku_url + "/sports/" + sportid ,{
      //request parameters:
      method: "PUT",
      credentials:"include",
      body: bodyStr,
      headers: {

        "Content-Type": "application/x-www-form-urlencoded"

      } // this is a dictionary

    }).then(function (response) {
      // handle the response
      loadSportlisting();

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

var signupsigninbutton = document.querySelector("#signupsignin");
signupsigninbutton.onclick = function()
{

  var regdisplay = document.querySelector("#register_div");
  regdisplay.style.display = "block";
  var regdisplay = document.querySelector("#login_div");
  regdisplay.style.display = "block";
  var regdisplay = document.querySelector("#home");
  regdisplay.style.display = "none";
  var redisplay = document.querySelector("#edit_div");
  redisplay.style.display = "none";
  var insertdisplay = document.querySelector("#insert_div");
  insertdisplay.style.display = "none";
  var itemlist = document.querySelector("#SportList");
  itemlist.style.display = "none";
  displaynewsportlist.style.display = "none";

};

var cancelbutton = document.querySelector("#cancelbutton");
cancelbutton.onclick = function()
{


  document.querySelector("#reg_email_field").value = "";
  document.querySelector("#fname_field").value = "";
  document.querySelector("#lname_field").value = "";
  document.querySelector("#reg_password").value = "";


  var regdisplay = document.querySelector("#register_div");
  regdisplay.style.display = "none";
  var redisplay = document.querySelector("#edit_div");
  redisplay.style.display = "none";
  var insertdisplay = document.querySelector("#insert_div");
  insertdisplay.style.display = "none";
  var itemlist = document.querySelector("#SportList");
  itemlist.style.display = "none";
  displaynewsportlist.style.display = "none";
  var homedisplay = document.querySelector("#login_div");
  homedisplay.style.display = "none"
  var homedisplay = document.querySelector("#home");
  homedisplay.style.display = "block";

};

var cancelbutton2 = document.querySelector("#logincancelbutton");
cancelbutton2.onclick = function()
{


  document.querySelector("#login_email_field").value = "";
  document.querySelector("#login_password").value = "";


  var regdisplay = document.querySelector("#register_div");
  regdisplay.style.display = "none";
  var redisplay = document.querySelector("#edit_div");
  redisplay.style.display = "none";
  var insertdisplay = document.querySelector("#insert_div");
  insertdisplay.style.display = "none";
  var itemlist = document.querySelector("#SportList");
  itemlist.style.display = "none";
  displaynewsportlist.style.display = "none";
  var homedisplay = document.querySelector("#login_div");
  homedisplay.style.display = "none"
  var homedisplay = document.querySelector("#home");
  homedisplay.style.display = "block";

};

var registerButton = document.querySelector("#registerbutton");
registerButton.onclick = function () {


  var newemail = document.querySelector("#reg_email_field").value;
  var newfname = document.querySelector("#fname_field").value;
  var newlname = document.querySelector("#lname_field").value;
  var newhaspasword = document.querySelector("#reg_password").value;


  var bodyStr = "email=" + encodeURIComponent(newemail);
  bodyStr += "&fname=" + encodeURIComponent(newfname);
  bodyStr += "&lname=" + encodeURIComponent(newlname);
  bodyStr += "&password=" + encodeURIComponent(newhaspasword);

  document.querySelector("#reg_email_field").value = "";
  document.querySelector("#fname_field").value = "";
  document.querySelector("#lname_field").value = "";
  document.querySelector("#reg_password").value = "";

  fetch(heroku_url + "/users", {
    //request parameters:
    method: "POST",
    credentials:"include",
    body: bodyStr,
    headers: {

      "Content-Type": "application/x-www-form-urlencoded"

    } // this is a dictionary

  }).then(function (response) {
    loadSportlisting()
    if (response.status == 201){
      alert("Congradulation who have successfully registered.")
      var signinbutton = document.queryElement("#signinsignup");
      signinbutton.style.display = "none";
      var insertdiv = document.querySelector("#insert_div");
      insertdiv.style.display = "none";
      var regdisplay = document.querySelector("#register_div");
      regdisplay.style.display = "none";
      var regdisplay = document.querySelector("#login_div");
      regdisplay.style.display = "none";
      var redisplay = document.querySelector("#edit_div");
      redisplay.style.display = "none";
      var regdisplay = document.querySelector("#home");
      regdisplay.style.display = "none";
      var itemlist = document.querySelector("#SportList");
      itemlist.style.display = "block";
      var itemlist = document.querySelector("#history");
      itemlist.style.display = "block";
      displaynewsportlist.style.display = "block";
      
    }else if(response.status == 422){
      alert("Email already exists please use a different email address!!")
      var insertdiv = document.querySelector("#insert_div");
      insertdiv.style.display = "none";
      var regdisplay = document.querySelector("#register_div");
      regdisplay.style.display = "block";
      var regdisplay = document.querySelector("#login_div");
      regdisplay.style.display = "block";
      var redisplay = document.querySelector("#edit_div");
      redisplay.style.display = "none";
      var itemlist = document.querySelector("#SportList");
      itemlist.style.display = "none";
      var itemlist = document.querySelector("#history");
      itemlist.style.display = "none";
      displaynewsportlist.style.display = "none";
      signupsigninbutton.style.display = "none";
    }
else{
      alert("Unknown malfunction - Something went wrong!")
    }

  });

};

var loginButton = document.querySelector("#loginbutton");
loginButton.onclick = function (Email) {

  var newemail = document.querySelector("#login_email_field").value;
  var newhaspasword = document.querySelector("#login_password").value;

  var bodyStr = "email=" + encodeURIComponent(newemail);
  bodyStr += "&password=" + encodeURIComponent(newhaspasword);

  document.querySelector("#login_email_field").value = "";
  document.querySelector("#login_password").value = "";

  fetch(heroku_url + "/sessions", {
    //request parameters:
    method: "POST",
    credentials:"include",
    body: bodyStr,
    headers: {

      "Content-Type": "application/x-www-form-urlencoded"

    } // this is a dictionary

  }).then(function (response) {
    loadSportlisting()
    if (response.status == 201){
      alert("Congradulation who have successfully Logged In.")

      // var signinbutton = document.queryElement("#signinsignup");
      // signinbutton.style.display = "none";
      var insertdiv = document.querySelector("#insert_div");
      insertdiv.style.display = "none";
      var regdisplay = document.querySelector("#register_div");
      regdisplay.style.display = "none";
      var regdisplay = document.querySelector("#login_div");
      regdisplay.style.display = "none";
      var redisplay = document.querySelector("#edit_div");
      redisplay.style.display = "none";
      var itemlist = document.querySelector("#SportList");
      itemlist.style.display = "block";
      var itemlist = document.querySelector("#history");
      itemlist.style.display = "block";
      displaynewsportlist.style.display = "block";
      
    }else if(response.status == 401){
      alert("The EMAIL or PASSWORD is incorrect please try again!")
      var insertdiv = document.querySelector("#insert_div");
      insertdiv.style.display = "none";
      var regdisplay = document.querySelector("#register_div");
      regdisplay.style.display = "block";
      var regdisplay = document.querySelector("#login_div");
      regdisplay.style.display = "block";
      var redisplay = document.querySelector("#edit_div");
      redisplay.style.display = "none";
      var itemlist = document.querySelector("#SportList");
      itemlist.style.display = "none";
      var itemlist = document.querySelector("#history");
      itemlist.style.display = "none";
      displaynewsportlist.style.display = "none";

    }
    else{
      alert("Unknown malfunction - Something went wrong!")
    }

  });

};    

var insertdiv = document.querySelector("#insert_div");
insertdiv.style.display = "none";
var regdisplay = document.querySelector("#register_div");
regdisplay.style.display = "none";
var regdisplay = document.querySelector("#login_div");
regdisplay.style.display = "none";
var redisplay = document.querySelector("#edit_div");
redisplay.style.display = "none";
var itemlist = document.querySelector("#SportList");
itemlist.style.display = "block";
var itemlist = document.querySelector("#history");
itemlist.style.display = "block";
displaynewsportlist.style.display = "block";

var clearInputInsert = function(){

  
  document.querySelector("#league_field").value = "";
  document.querySelector("#teamname_field").value = "";
  document.querySelector("#conferance_field").value  = "";
  document.querySelector("#teamrank_field").value = "";
  document.querySelector("#location_field").value = " ";
  document.querySelector("#mascot_field").value = "";


}

var clearInputUpdate = function(){

  document.querySelector("#edit_league_field").value = "";
  document.querySelector("#edit_teamname_field").value = "";
  document.querySelector("#edit_conferance_field").value  = "";
  document.querySelector("#edit_teamrank_field").value = "";
  document.querySelector("#edit_location_field").value = " ";
  document.querySelector("#edit_mascot_field").value = "";

}


loadSportlisting();
