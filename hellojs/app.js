


var getRestaurants = function () {
  fetch("http://localhost:8080/restaurants").then(function (response) {
    response.json().then(function (data) {
      console.log("data received from server:", data);

      // loop over the data and display it immediately:
      var restaurantList = document.querySelector("#restaurants");
      data.forEach(function (restaurant) {
        // append each restaurant to a new element in the DOM

        // li tag: contains everything about one restaurant
        var newListItem = document.createElement("li");

        // h3 tag: contains the title
        var titleHeading = document.createElement("h3");
        titleHeading.innerHTML = restaurant.name;
        newListItem.appendChild(titleHeading);

        // div tag: contains the cuisine
        var cuisineDiv = document.createElement("div");
        cuisineDiv.innerHTML = restaurant.cuisine;
        newListItem.appendChild(cuisineDiv);

        // button tag: the delete button
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = function () {
          console.log("delete clicked:", restaurant.id);
          // deleteRestaurant(restaurant.id);
        };
        newListItem.appendChild(deleteButton);

        restaurantList.appendChild(newListItem);
      });
    });
  });
};

getRestaurants();

var addButton = document.querySelector("#add");
addButton.onclick = function () {
  var newRestaurantInput = document.querySelector("#new-restaurant");
  var newRestaurantValue = newRestaurantInput.value;

  var bodyStr = "name=" + encodeURIComponent(newRestaurantValue);
  fetch("http://localhost:8080/restaurants", {
    // request parameters:
    method: "POST",
    body: bodyStr,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    // handle the response:
    console.log("Server responded!");
    // reload the list of restaurants
  });
};

