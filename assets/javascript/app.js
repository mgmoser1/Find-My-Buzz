$(document).ready(function(barFinder){

// New YELP API Key: here's the new key JARq9NBksYNIfR1HQQ8z3P5r7ypZW9-Xo_bVQUO-QRgXM3XJbnpvhKuo25EXjDrm1Xq8A9Vv6-p9dHcRJlH6dVqQVbXLU_iq3CYqI1YVwxyD12qLi0-xDNo8_ba5XHYx

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
    var barDB = firebase.database();

    var comments = "";
    var commentorName = "";


  // BAR BUTTON ON-CLICK //
  $(document).on("click",".bar-code", function (barSubmit) {
    event.preventDefault();

    var businessID = $(this).attr("data-point");
    // Path for the second search by Bar ID. //

    var existingComments = [];
    var commentsPresent = checkDB(businessID);
    function checkDB(n) {
      if (n)
    }

    var buzzDetailURL =
    'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/' + businessID;
  
  // Path for the third search by Bar ID for reviews. //
    var buzzReviewURL =
    'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/' + businessID + '/reviews';
  
     
    
});