// ? Changes to JS ... 
// var ourIcon = "https://i.imgur.com/ndJRlf9.png"
var ourIcon = "https://img.icons8.com/android/24/000000/beer-bottle.png";


// Initialize Firebase
var config = {
  apiKey: "AIzaSyChY5mXqIZ_vL2diYGm77VslwzNU5xwSrk",
  authDomain: "bar-finder-f116b.firebaseapp.com",
  databaseURL: "https://bar-finder-f116b.firebaseio.com",
  projectId: "bar-finder-f116b",
  storageBucket: "bar-finder-f116b.appspot.com",
  messagingSenderId: "1035338020280"
};
firebase.initializeApp(config);


// GLOBAL VARIABLES //

// this is the variable to use when pushing to / pulling from firebase
var barDB = firebase.database().ref();

// ! This function gets the user's Lat and Long via the Google Geocode API using an Axios Call
function getLatLng(userAddress) {
  axios
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: userAddress,
        key: "AIzaSyA2Z73bHqtsEJuas82kslWAoAegg5Rxrco"
      }
    })
    .then(function (response) {
      var formattedAddress = response.data.results[0].formatted_address;
      var newUserLat = response.data.results[0].geometry.location.lat;
      var newUserLng = response.data.results[0].geometry.location.lng;

      var startAddress = $("<h5>").html("From: " + formattedAddress);

      $(".uber-response").append(startAddress);
      userLat = newUserLat;
      userLng = newUserLng;
      if (formattedAddress.includes('TX')) {

        callUber();
      } else {
        var title = 'ERROR: out of State';
        var content = 'Please enter an address in Dallas';
        createModal(title, content);
      }
    })
    .catch(function (error) {
      console.log("The error looks like " + error);
    });
}

//  ! Geocoding Uber Button listner
$(document).on("click", "#submit-uber", function (event) {
  event.preventDefault();
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
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + uberAuth);
    }
  }).then(function (response) {
    var totalDistance = $("<h5>").html(
      "Distance: " + response.prices[0].distance
    );

    $(".uber-response").append(totalDistance);

    for (var i = 0; i < response.prices.length; i++) {
      var typeCar = $("<h5>" + response.prices[i].display_name + " Fee: " + response.prices[i].estimate + "</h5>");
      $(".uber-response").append(typeCar);
    }

  });
}

// ? This is for the GOOGLE Map API ??????
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(latArray[0], lngArray[0]),
  });

  var infoPopUp = new google.maps.InfoWindow;
  var marker, i;

  for (i = 0; i < searchLimit; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(latArray[i], lngArray[i]),

      icon: ourIcon,
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

var term = "term=happy%20hour";
var businessID = "VJyE0wCtZtoLev9YgXYpIQ"; // MEGAN DELETED

// ! Empty variables for storing information to pass between API's
var businessName = ""; //MEGAN DELETED

// ? We need to use this to store the information about bar from the search
var nameArray = [];
var latArray = [];
var lngArray = [];
var zip = '';
var search = '';

// ? will need this for local storage
var idArray = [];

// ? this can be used to display different icons by category
var catArray = [];

// ? this works when set to null to start
var userloc = null;

var searchLimit = 0;

// ! function for validation
var zipValue = $("#zip-input").val();
var regEx = /\b\d{5}\b/g;

function zipValidation() {
  if (regEx.test($("#zip-input").val())) {
    $("#submit-search").attr("disabled", false);

    console.log(Date().toString()); // Local Storage 
  } else {
    $("#submit-search").attr("disabled", true);
  }
}

function uberValidation() {
  if ($("#submit-uber").val('')) {
    $("#submit-uber").attr("disabled", true);
  } else {
    $("#submit-uber").attr("disabled", false);
  }
}


// ! This resets the prior search
function reset() {
  $('#zip-input').val('');
  $('#map').css("visibility", "hidden");
  $('.barDiv').empty();
  $('#reset-search').css("visibility", "hidden");
  nameArray = [];
  latArray = [];
  lngArray = [];
  catArray = [];
}
// ! on click function for reset
$('#reset-search').on("click", function () {
  reset();
})

// ! listen for user input of zip code
$('#submit-search').on("click", function (event) {
  event.preventDefault();
  var zipCode = $('#zip-input').val();
  var search = $('#search-limit').val();
  reset();
  $('#map').css("visibility", "visible");
  $('#reset-search').css("visibility", "visible");


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
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + key);
        xhr.setRequestHeader("X-Requested-With", "true");
      },
      success: function (data) {
        businessID = data.businesses[0].id;
        businessName = data.businesses[1].name;

        // ! This function will create buttons (Repeating element) for each bar on the 1st page
        function barButton() {

          for (var i = 0; i < searchLimit; i++) {
            var barBtn = $("<button>");
            barBtn.addClass("btn btn-light btn-lg bar-btn bar-code");
            barBtn.html(
              data.businesses[i].name +
              "<br>" + [data.businesses[i].price]
            );
            barBtn.attr("data-point", [data.businesses[i].id]);
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
        }
        barButton();
      }
    });
  }
  getData();
});

// Modal Creation Function
function createModal(t, b) {

  var modalTitle = $("#modal-title");
  var modalBody = $("#modal-text");

  if (t, b) {

    $(modalTitle).text(t);
    $(modalBody).text(b);
    $("#my-modal").modal("toggle");
  }

  // $(modalTop).modal(); // This reset back to first page.
  // $(modalTop).modal('show'); // This also reset back to first page.
}

// BAR BUTTON ON-CLICK //
$(document).on("click", ".bar-code", function () {
  event.preventDefault();

  var businessID = $(this).attr("data-point");
  console.log("businessID: " + businessID) //  working with hard coded value
  // Path for the second search by Bar ID. //

  var buzzDetailURL =
    'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/' + businessID;

  // Path for the third search by Bar ID for reviews. //
  var buzzReviewURL =
    'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/' + businessID + '/reviews';



  // ajax for the second Yelp API call - for bar's details.
  function getDataByID() {
    $.ajax({
      url: buzzDetailURL,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + key);
        xhr.setRequestHeader('X-Requested-With', 'true');
      },
      success: function (data) {

        if (!data.price) {
          data.price = "It's a mystery!";
        }
        //    var ident = data.id;
        // BarData
        var name = $('<h4>').html('Name: ' + data.name);
        var price = $('<p>').html('Price: ' + data.price);
        var rating = $('<p>').html('Rating: ' + data.rating);
        var reviewCount = $('<p>').html('Reviews Total: ' + data.review_count);
        var reviewHolder = $('<div id="reviews">');
        var addr = $('<p>').html('Address: ' + data.location.display_address);
        var phone = $('<p>').html('Phone: ' + data.display_phone);

        // ! This section is for the Buzzer Reviews ... Going to copy it for Dynamic Uber Card
        var buzzReviewTitle = $("<h4>").text("Buzzer Reviews");

        /////   Comment Form   /////
        var commentCard = $('<div class="card">');
        var cardBody = $('<div class="card-body">');
        var cardTitle = $('<h5 class="card-title">').text("Leave a comment!");
        var commentForm = $('<form>');
        var yourName = $('<div class="form-group">');
        var newNameLabel = $('<label for="userNameInput">').html("Your Name");
        var newNameInput = $('<input type="text" class="form-control" id="name-input">');

        var yourComment = $('<div class="form-group">');
        var newCommentLabel = $('<label for="userCommentInput">').html("Comment");
        var newCommentInput = $('<input type="text" class="form-control" id="comment-input" placeholder="Comment">');

        var commentSubmit = $('<button type="submit" class="btn btn-success" id="comment-input-submit" data-toggle="modal" data-target="#commentInfoModal" data-point="businessID">').html("Submit");


        // ? Repeating for UBER Card
        var uberTitle = $("<h4>").text("Order Uber");
        var uberCard = $('<div class="card">');
        var uberCardBody = $('<div class="card-body">');
        var uberCardTitle = $('<h5 class="card-title">').text("Need a Lift?");
        var uberForm = $('<form>');
        var uberDiv = $('<div class="form-group text-center">');
        var addressLabel = $('<label for="user-address">').html("Address");
        var userAddress = $('<input type="text" class="form-control" id="user-address" placeholder="123 Main Street, Dallas, TX">');

        var uberSubmit = $('<button type="submit" class="btn btn-primary btn-block mt-3" id="submit-uber" >').html("Submit");
        uberSubmit.html('<h5>' + 'check for' + '<i class="fab fa-uber fa-lg"></i></h5>')

        // var uberCol2 = $('div class ="col-5"');

        $('.bar-sub').empty();
        $(yourName).append(newNameLabel, newNameInput);
        $(yourComment).append(newCommentLabel, newCommentInput);
        $(commentForm).append(yourName, yourComment, commentSubmit);
        $(cardBody).append(cardTitle, commentForm);
        $(commentCard).append(cardBody);

        // $(uberRow).append(uberCol1);

        $(uberForm).append(uberDiv, addressLabel, userAddress, uberSubmit);
        $(uberCardBody).append(uberCardTitle, uberForm);
        $(uberCard).append(uberCardBody);
        // $(uberCard).append(uberCardBody);

        var barData = $('<div class="bar-info">');
        var barData2 = $('<div class="bar-info-2">');
        var barData3 = $('<div class="bar-info-3">');
        var photoDiv = $('<div class="image-here">');

        var uberData = $('<div class="uber-card">');


        //   debugger
        //         $(".info").append(name, price, cat, addr, phone, coords);
        for (let j = 0; j < data.photos.length; j++) {
          var photos = $("<img>");
          photos.attr("src", data.photos[j]);
          photos.css("height", "200px");
          $(photoDiv).append(photos);
        }
        // debugger
        $(uberData).append(uberTitle, uberCard);
        $('.uber-info').append(uberData);

        //   if (data.categories[0]) {
        //      var cat = $('<p>').html('Want to Delete This - Category: ' + data.categories[0].title);
        //    }
        //   
        $(barData).append(name, price, rating, reviewCount, addr, phone, reviewHolder); // , hours, cat
        $(barData2).append(buzzReviewTitle);

        checkDB(businessID);

        $(barData3).append(commentCard); // , hours, cat


        function getreviewsByID() {
          $.ajax({
            url: buzzReviewURL,
            type: "GET",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Bearer " + key);
              xhr.setRequestHeader("X-Requested-With", "true");
            },

            success: function (data) {
              var reviewTitle = $("<h4>").text("Reviews");
              $(reviewHolder).append(reviewTitle);
              for (let k = 0; k < data.reviews.length; k++) {
                var reviews = $("<p>").html(data.reviews[k].text);
                $(reviewHolder).append(reviews);
              }
            }
          });
        }

        function checkDB(n) {
          //debugger

          commentFound = barDB.on("child_added", function (snapshot) { // childSnapshot
            var found = false;
            let data = snapshot.val(); // childSnapshot
            // console.log(data);
            let comments = data.comment;
            let userName = data.userName;
            let busID = data.busID;
            // console.log(busID);

            if (busID === n) {
              //  var existingComments = $('<div class="existing-comment">').text(comments);
              //  var existingUserName = $('<div class="existing-user-name">').text(userName);
              var nameandComment = $('<div class="existing-name-comment">').text(userName + "- " + comments);

              $(barData2).append(nameandComment);
              found = true;

              console.log(comments);
              console.log(userName);
            }
            return found;
          });

          if (commentFound = false) {
            var noExisting = $('<h4 class="no-existing-comment">').text("Be the first Buzzer to review this spot!")
            $(barData2).append(noExisting);
          }
        }

        $('.bar-sub').append(photoDiv, barData, barData2, barData3);

        getreviewsByID();

        // ? Added for callUber
        barLat = data.coordinates.latitude;
        barLng = data.coordinates.longitude;

        // Storing the Data in Local Storage for Uber
        sessionStorage.setItem("barLat", barLat);
        sessionStorage.setItem("barLng", barLng);
        sessionStorage.setItem("barName", data.name);

      }
    });
  }


  getDataByID();

  // COMMENT SUBMIT ONCLICK //
  // ! hi

  $(document).on("click", "#comment-input-submit", function () {
    event.preventDefault();
    // debugger
    var newNameInput = "";
    var newCommentInput = "";
    var newNameInput = $("#name-input").val().trim();
    newCommentInput = $("#comment-input").val().trim();

    // console.log("New Comment: " + newCommentInput);
    // console.log("New Name: " + newNameInput);

    if (!newNameInput) {

      var modTitle = "Name Required";
      var modBody = "We've got to call you something!"
      console.log(modTitle);

      createModal(modTitle, modBody);
    }
    if (!newCommentInput) {
      ;
      var modTitle = "No Comment Provided";
      var modBody = "Do not deprive us of your keen observations!"
      console.log(modTitle);

      createModal(modTitle, modBody);
    }
    if (newNameInput && newCommentInput) {

      var newComment = {

        userName: newNameInput,
        comment: newCommentInput,
        busID: businessID,
      };

      barDB.push(newComment);
    }


  }); // End of comment-input-submit click.







}); // End of bar-code button click.