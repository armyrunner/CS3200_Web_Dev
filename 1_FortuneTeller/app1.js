// movie variable

var movies = [ /*{"title":"hello","rating":"bob",
                "genere":"fam","consumerrating":"stars"},

                {"title":"bighero","rating":"bob",
                "genere":"fam","consumerrating":"stars"}*/
];
 

// create a button
var movielisting = document.querySelector("#movielist");
console.log("BUTTON", movielisting);

movielisting.onclick = function() {

   var randomIndex = Math.floor(Math.random()*movies.length);
   var placement = movies[randomIndex];

   var movielisted = document.querySelector("#placement");
   movielisted.innerHTML = placement.title;

   var table = document.getElementById("history").insertRow(1);
   var cell1 = table.insertCell(0);
   var cell2 = table.insertCell(1);
   var cell3 = table.insertCell(2);
   var cell4 = table.insertCell(3);

   
   cell1.innerHTML = placement.title;
   cell2.innerHTML = placement.rating;
   cell3.innerHTML = placement.genre;
   cell4.innerHTML = placement.consumerrating;
};

// request the data from the server:
fetch("https://api.myjson.com/bins/se3br").then(function (response) {
  console.log("server responded.");
  // parse (unpackage) the data from the server:
  response.json().then(function (listmovies) {
    console.log("data received from server:", listmovies);
    // (data is a list of objects)

    // save the data for use later (when the button is clicked):
    movies = listmovies;

  });
});
