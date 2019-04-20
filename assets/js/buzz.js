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

// function initMap() {
//   // Map options
//   var options = {
//     zoom: 12,
//     center: {
//       lat: 32.845885,
//       lng: -96.783393
//     }
//   };
//   //  * create new map
//   var map = new google.maps.Map(document.getElementById("map"), options);
//   var beerImage = "https://img.icons8.com/ios/50/000000/beer.png";

//   // ! add marker function *
//   // addMarker({
//   //   coordinates: {
//   //     lat: 32.87232,
//   //     lng: -96.772507
//   //   },
//   //   iconImage: "https://img.icons8.com/color/48/000000/cafe.png",
//   //   content: '<img src="http://i.imgur.com/4H1Fei6.jpg"><h3>Panera</><h3>Address</h3><a href="https://locations.panerabread.com/tx/dallas/7839-park-ln.html?utm_medium=display-ad&utm_source=paid-digital&utm_campaign=yext&utm_content=local-search">Panera</a><h3>Ratings</h3>'
//   // });
//   // addMarker({
//   //   coordinates: {
//   //     lat: 32.847997,
//   //     lng: -96.787064
//   //   },
//   //   // iconImage: 'https://img.icons8.com/color/48/000000/cafe.png',
//   //   content: '<h2>Coffee Shop</h2>'
//   // });

//   // addMarker({
//   //   coordinates: {
//   //     lat: 32.880896,
//   //     lng: -96.769267
//   //   },
//   //   iconImage: "https://img.icons8.com/color/48/000000/cafe.png",
//   //   content: "<h2>Coffee Shop</h2>"
//   // });

//   addMarker({
//     coordinates: {
//       lat: 32.8419369,
//       lng: -96.7706972
//     },
//     iconImage: beerImage,
//     content: '<h2>Barley House</h2><a href="./location.html">Location Page</a>'
//   });

//   // addMarker({
//   //   coordinates: {
//   //     lat: 32.845885,
//   //     lng: -96.783393
//   //   },
//   //   iconImage: schoolImage,
//   //   content: "<h2>We meet Jon here!</h2>"
//   // });

//   // ! function to add markers to the map after when creating the buttons


//   var barMarkers = {
//     coords: {
//       lat: latArray[0],
//       lng: lngArray[0]
//     },
//     iconImage: beerImage,
//     content: '<h1>testing testing 1 2 3</h1>'
//   }
//   console.log("barMarkers outsideFunction: " + barMarkers.lat);


//   function makeMarkers() {
//     for (j = 0; j < searchLimit; j++) {
//       addMarker(barMarkers[j]);
//       console.log(barMarkers[j])
//     };
//   }

//   function addMarker(props) {
//     var marker = new google.maps.Marker({
//       position: props.coordinates,
//       map: map
//     });
//     // Check for an Icon
//     if (props.iconImage) {
//       // Set Icon Image
//       marker.setIcon(props.iconImage);
//     }

//     // check for content
//     if (props.content) {
//       var info = new google.maps.InfoWindow({
//         content: props.content
//       });
//       marker.addListener("click", function () {
//         info.open(map, marker);
//       });
//     }
//   }
//   makeMarkers()
// }

// ! This is for generating the bar page page data

var key =
  "JARq9NBksYNIfR1HQQ8z3P5r7ypZW9-Xo_bVQUO-QRgXM3XJbnpvhKuo25EXjDrm1Xq8A9Vv6-p9dHcRJlH6dVqQVbXLU_iq3CYqI1YVwxyD12qLi0-xDNo8_ba5XHYx";

var userloc = 75240;
var loc = "location=" + userloc;
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
var searchLimit = 5;




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
      $(".bar-btn").click(function (event) {
        var myBar = $(this).prop("text");
        console.log("hello");

      });
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


getDataByID();

getData();


// }