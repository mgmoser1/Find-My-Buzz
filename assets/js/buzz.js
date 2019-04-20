// $('document').ready(function () {
// ! Function for loading the map on page 1


//  ! This is the call for the creation of the barButton

// ? This is for the GOOGLE Map API ??????
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(latArray[0], lngArray[0]),

  });

  // console.log(nameArray.0)
  var infoPopUp = new google.maps.InfoWindow;

  var marker, i;
  // debugger
  for (i = 0; i < searchLimit; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng

      (latArray[i], lngArray[i]),
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infoPopUp.setContent(nameArray[i]);
        infoPopUp.open(map, marker);
      }
    })(marker, i));
  }
}

// ! This is for generating the bar page page data

var key =
  "JARq9NBksYNIfR1HQQ8z3P5r7ypZW9-Xo_bVQUO-QRgXM3XJbnpvhKuo25EXjDrm1Xq8A9Vv6-p9dHcRJlH6dVqQVbXLU_iq3CYqI1YVwxyD12qLi0-xDNo8_ba5XHYx";


// var categories = 'categories=beerbar';
var term = "term=happy%20hour";
var businessID = "VJyE0wCtZtoLev9YgXYpIQ";

// ! Empty variables for storing information to pass between API's
var businessName = "";

// ? We need to use this to store the latitude and longitude of each bar in the search

var nameArray = [];
var latArray = [];
var lngArray = [];

// var centerMap = latArray[0],
//   lngArray[0];

var thisBusiness = 0;
var businessCount = 0;

var searchLimit = 0;

// ! listen for user input of zip code
$('#submit-search').on("click", function (event) {
  event.preventDefault();
  $(".barDiv").empty();

  var userloc = null;


  console.log("original: " + loc);

  var zipCode = $('#zip').val();
  var search = $('#search-limit').val();

  userloc = zipCode;
  var loc = "location=" + userloc;
  console.log(zipCode);
  console.log(userloc);

  userloc = zipCode;
  // userloc = zipCode.toString();

  console.log("new " + loc);
  searchLimit = search;

  // ? Need to add a clear function for the form

  // ! This is the first call made to fill the buttons and the map
  var buzzURL =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?" +
    loc +
    "&" +
    term +
    "&limit=" +
    searchLimit +
    "&open_now=true";

  // Things we can add
  //   categories;
  // '&' +

  // ! This URL is used to query the API for a particular bar
  var buzzDetailURL =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" +
    businessID;

  // ! This URL is used to query the API for the reviews of a particular bar
  var buzzReviewURL =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" +
    businessID +
    "/reviews";

  // ! getting the first data for the buttons etc based on the user zip code
  function getData() {
    $.ajax({
      url: buzzURL,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + key);
        xhr.setRequestHeader("X-Requested-With", "true");
      },
      success: function (data) {
        businessID = data.businesses[0].id;
        businessName = data.businesses[1].name;
        var open = data.businesses[0].is_closed

        console.log(data.businesses[0]);
        // console.log("Open Now:" + data.businesses[0].hours.is_open_now);
        // ! This function will create buttons (Repeating element) for each bar on the 1st page
        function barButton() {
          for (var i = 0; i < searchLimit; i++) {
            if (open === false) {
              var barBtn = $("<button>");
              barBtn.addClass("btn btn-light btn-lg bar-btn");
              barBtn.html(
                data.businesses[i].name +
                "<br>" + [data.businesses[i].price]
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

              initMap();
            }
          }
        }
        barButton();

        //* add click function to barbutton 
        // $(".bar-btn").click(function (event) {
        //   var myBar = $(this).attr(id);
        //   console.log(myBar);

        // });
      }
    });
  }

  function getDataByID() {
    $.ajax({
      url: buzzDetailURL,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + key);
        xhr.setRequestHeader("X-Requested-With", "true");
      },

      success: function (data) {
        var name = $("<h2>").html(data.name);
        var price = $("<h4>").html("Price: " + data.price);
        var cat = $("<h3>").html("Category: " + data.categories[0].title);
        var addr = $("<h4>").html(
          "Street address: " + data.location.display_address
        );

        var phone = $("<h4>").html("Phone: " + data.display_phone);
        var coords = $("<h4>").html(
          "Latitude: " + data.coordinates.latitude +
          "  Longitude: " +
          data.coordinates.longitude
        );
        // var hours = $('<h4>').html('Hours: Monday-Saturday ' + data.hours[0].open[0].start + ' - ' + data.hours[0].open[0].end);
        var hoursObject = data.hours[0];
        // console.log("Here are the hours: " + hoursObject);

        $(".info").append(name, price, cat, addr, phone, coords);
        for (let j = 0; j < data.photos.length; j++) {
          var photos = $("<img>");
          photos.attr("src", data.photos[j]);
          photos.css("height", "200px");
          $(".image-here").append(photos);
        }

        getreviewsByID();
      }
    });
  }

  function getreviewsByID() {
    $.ajax({
      url: buzzReviewURL,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + key);
        xhr.setRequestHeader("X-Requested-With", "true");
      },

      success: function (data) {
        var reviewTitle = $("<h2>").html("Reviews");
        $(".info").append(reviewTitle);
        for (let k = 0; k < data.reviews.length; k++) {
          var reviews = $("<p>").html(data.reviews[k].text);
          var br = $(".reviews").append(reviews);
        }
      }
    });
  }

  getData();
  // getDataByID();
})



// }