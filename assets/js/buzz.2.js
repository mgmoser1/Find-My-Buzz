// todo Various icons for different Establishments
var standardIcon =
  "https://img.icons8.com/windows/32/000000/coconut-cocktail.png"; //srestaurant
var beerIcon = "https://img.icons8.com/color/32/000000/beer.png";
var wineIcon = "https://img.icons8.com/color/32/000000/wine-glass.png";
var whiskeyIcon = "https://img.icons8.com/color/32/000000/sport.png";
var pubIcon = "https://img.icons8.com/dusk/32/000000/beer.png";
var newAmericanIcon = "https://img.icons8.com/color/48/000000/usa.png";
var cocktailIcon = "https://img.icons8.com/windows/32/000000/cocktail.png";

var userAddress = "";

// ! This function gets the user's Lat and Long via the Google Geocode API using an Axios Call
function getLatLng(userAddress) {
  axios
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: userAddress,
        key: "AIzaSyA2Z73bHqtsEJuas82kslWAoAegg5Rxrco"
      }
    })
    .then(function(response) {
      var formattedAddress = response.data.results[0].formatted_address;
      var newUserLat = response.data.results[0].geometry.location.lat;
      var newUserLng = response.data.results[0].geometry.location.lng;

      var startAddress = $("<h5>").html("From: " + formattedAddress);

      $(".uber-response").append(startAddress);
      userLat = newUserLat;
      userLng = newUserLng;
      callUber();
    })
    .catch(function(error) {
      console.log("The error looks like " + error);
    });
}

//  ! Geocoding Uber Button listner
$(document).on("click", "#submit-uber", function(event) {
  // event.preventDefault();
  var newUserAddress = $("#user-address").val();
  userAddress = newUserAddress;
  getLatLng(userAddress);
});

var uberAuth =
  "JA.VUNmGAAAAAAAEgASAAAABwAIAAwAAAAAAAAAEgAAAAAAAAG8AAAAFAAAAAAADgAQAAQAAAAIAAwAAAAOAAAAkAAAABwAAAAEAAAAEAAAABpGg-51QEZ8EHAiodL3YIhsAAAAL-iyVo5k0UELpA9d_GrHIrh-1SIJliQXRFob4LRgAG8bnETC2jFSU8XZ8Yt5j0dResiOKBiB8P_FUxoUmfsWZFNa9UVRWcwboCZE3Pg1RSNMTUJPn8uSJWxPXhY6y_WY4Vu5U5hkLiFwWPMPDAAAAAYqxrsv0HOtXEF7viQAAABiMGQ4NTgwMy0zOGEwLTQyYjMtODA2ZS03YTRjZjhlMTk2ZWU";

// ! Uber Information Function
function callUber() {
  var uberURL =
    "https://cors-anywhere.herokuapp.com/https://api.uber.com/v1.2/estimates/price?start_latitude=" +
    userLat +
    "&start_longitude=" +
    userLng +
    "&end_latitude=" +
    barLat +
    "&end_longitude=" +
    barLng;

  // ? This retreives the barLat and barLng from sessionStorage
  barLat = sessionStorage.getItem("barLat");
  barLng = sessionStorage.getItem("barLng");
  var barName = sessionStorage.getItem("barName");

  $.ajax({
    url: uberURL,
    type: "GET",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + uberAuth);
    }
  }).then(function(response) {
    var endAddress = $("<h5>").html("To: " + barName);
    // $(".uber-response").empty();
    var totalDistance = $("<h5>").html(
      "Distance: " + response.prices[0].distance
    );

    for (m = 0; m < response.prices.length; m++) {
      var typeCar = $("<h6>");
      typeCar.html("Type: " + response.prices[m].display_name);
      var fee = $("<h6>");
      fee.html("Fee: " + response.prices[m].estimate);

      console.log("Type: " + response.prices[m].display_name);
      console.log("Fee Estimate: " + response.prices[m].estimate);
    }

    $(".uber-response").append(endAddress, totalDistance, typeCar, fee);
  });
}

// ? This was added to the getDataByID Function
// * sessionStorage.setItem("barLat", barLat);
// * sessionStorage.setItem("barLng", barLng);
// * sessionStorage.setItem("barName", data.name);

// ? This is for the GOOGLE Map API ??????
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: new google.maps.LatLng(latArray[0], lngArray[0])
  });

  var infoPopUp = new google.maps.InfoWindow();
  var marker, i;

  for (i = 0; i < searchLimit; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(latArray[i], lngArray[i]),
      // passive: false,
      icon: beerIcon,
      map: map
    });

    google.maps.event.addListener(
      marker,
      "click",
      (function(marker, i) {
        return function() {
          infoPopUp.setContent(nameArray[i]);
          infoPopUp.open(map, marker);
        };
      })(marker, i)
    );
  }
}

// ! This is for generating the bar page page using Yelp Fusion data
var key =
  "JARq9NBksYNIfR1HQQ8z3P5r7ypZW9-Xo_bVQUO-QRgXM3XJbnpvhKuo25EXjDrm1Xq8A9Vv6-p9dHcRJlH6dVqQVbXLU_iq3CYqI1YVwxyD12qLi0-xDNo8_ba5XHYx";

var term = "term=happy%20hour";
var businessID = "";

// ! Empty variables for storing information to pass between API's
var businessName = "";

// ? We need to use this to store the information about bar from the search
var nameArray = [];
var latArray = [];
var lngArray = [];

// ? will need this for local storage
var idArray = [];

// ? this can be used to display different icons by category
var catArray = [];

// ? this works when set to null to start
var userloc = null;

var searchLimit = 0;

// ! function for validation
var regEx = /\b\d{5}\b/g;

function zipValidation() {
  if (regEx.test($("#zip-input").val())) {
    $("#submit-search").attr("disabled", false);
    localStorage.setItem("zip", $("#zip-input").val());
    localStorage.setItem("search", $("#search-limit").val());
    localStorage.setItem("timestamp", Date().toString());
  } else {
    $("#submit-search").attr("disabled", true);
    $("#map").css("visibility", "hidden");
  }
}

// ! This resets the prior search
function reset() {
  $("#map").css("visibility", "hidden");
  $(".barDiv").empty();
  $("#reset-search").css("visibility", "hidden");
  nameArray = [];
  latArray = [];
  lngArray = [];
  catArray = [];

  // ! added
  $(".dynamic").css("visibility", "hidden");
}
// ! on click funtion for reset
$("#reset-search").on("click", function() {
  reset();
});

// ! listen for user input of zip code
$("#submit-search").on("click", function(event) {
  event.preventDefault();
  reset();

  $("#map").css("visibility", "visible");
  $("#reset-search").css("visibility", "visible");

  var zipCode = $("#zip-input").val();
  var search = $("#search-limit").val();

  userloc = zipCode;

  var loc = "location=" + userloc;
  searchLimit = search;

  // ! This is the first call made to fill the buttons and the map
  var buzzURL =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?" +
    loc +
    "&" +
    term +
    "&limit=" +
    searchLimit;

  // ! getting the first data for the buttons etc based on the user zip code
  function getData() {
    $.ajax({
      url: buzzURL,
      type: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + key);
        xhr.setRequestHeader("X-Requested-With", "true");
      },
      success: function(data) {
        console.log(data);

        if (data.businesses.length < 0) {
          alert("try a different zip");
        } else {
          businessID = data.businesses[0].id;
          businessName = data.businesses[1].name;
          // ! This function will create buttons (Repeating element) for each bar on the 1st page
          function barButton() {
            for (var i = 0; i < searchLimit; i++) {
              var barBtn = $("<button>");
              barBtn.addClass("btn btn-light btn-lg bar-btn");
              barBtn.html(
                data.businesses[i].name + "<br>" + [data.businesses[i].price]
              );
              barBtn.attr("bar-code", [data.businesses[i].id]);
              barBtn.appendTo(".barDiv");

              // !  Push the Bar Name, latitude, and longitude to array for the google map API
              var namePush = nameArray.push(data.businesses[i].name);
              newNameArray = namePush;

              var lat = [data.businesses[i].coordinates.latitude];
              latArray.push(lat);

              var lng = [data.businesses[i].coordinates.longitude];
              lngArray.push(lng);

              // ? This is needed to store the ID information for local storage
              var addAll = [data.businesses[i].id];
              idArray.push(addAll);
              idArray = idArray;

              // ! not necessary ... but with this array we could change the icons according to the categories with a series of if statements
              var cats = [data.businesses[i].categories[0].alias];
              catArray.push(cats);
              catArray = catArray;
              initMap();
            }

            $(".bar-btn").on("click", function() {
              var newBusinessID = $(this).attr("bar-code");
              businessID = newBusinessID;

              // ! This URL is used to query the API for a particular bar
              var buzzDetailURL =
                "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" +
                businessID;

              // ! This URL is used to query the API for the reviews of a particular bar
              var buzzReviewURL =
                "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" +
                businessID +
                "/reviews";

              function getDataByID() {
                $.ajax({
                  url: buzzDetailURL,
                  type: "GET",
                  beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + key);
                    xhr.setRequestHeader("X-Requested-With", "true");
                  },
                  success: function(data) {
                    $(".info,.image-here,.reviews").empty();
                    $(".dynamic").css("visibility", "visible");

                    var name = $("<h2>").html(data.name);
                    name.addClass("bar-name");

                    var price = $("<h4>").html(
                      "Price: " +
                        data.price +
                        "  |  " +
                        "    Rating: " +
                        data.rating
                    );

                    var cat = $("<h4>").html(
                      "Category: " + data.categories[0].title
                    );
                    var addr = $("<h4>").html(
                      "Street address: " + data.location.display_address
                    );
                    var phone = $("<h4>").html("Phone: " + data.display_phone);

                    $(".info").append(name, price, cat, addr, phone);

                    // ? adding photos
                    for (let j = 0; j < data.photos.length; j++) {
                      var photos = $("<img>");
                      photos.attr("src", data.photos[j]);
                      photos.css("height", "200px");
                      $(".image-here").append(photos);
                    }
                    // ? adding revews  (last call)

                    getreviewsByID();

                    barLat = data.coordinates.latitude;
                    barLng = data.coordinates.longitude;

                    // Storing the Data in Local Storage for Uber
                    sessionStorage.setItem("barLat", barLat);
                    sessionStorage.setItem("barLng", barLng);
                    sessionStorage.setItem("barName", data.name);
                  }
                });
              }
              // todo add usercomments in local storage
              function userComments() {}

              function getreviewsByID() {
                $.ajax({
                  url: buzzReviewURL,
                  type: "GET",
                  beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + key);
                    xhr.setRequestHeader("X-Requested-With", "true");
                  },

                  success: function(data) {
                    var reviewTitle = $("<h2>").html("Photos and Reviews");
                    reviewTitle.css("text-align", "center");
                    $(".info").append(reviewTitle);

                    for (let k = 0; k < data.reviews.length; k++) {
                      var reviews = $("<h5>").html(data.reviews[k].text);
                      reviews.addClass("user-reviews");
                      $(".reviews").append(reviews);
                    }
                  }
                });
              }

              getDataByID();
            });
          }
          barButton();
        }
      },
      error: function() {
        alert("We got an Error");
      }
    });
  }

  getData();
});

// ! For handling Errors
// jquery.ready
// document.addEventListener('touchstart', handler, {
//   capture: true
// });

// }
