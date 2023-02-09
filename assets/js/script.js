// Global variables
var savedRecipesBtn = $("#saved-recipes");
var apiKeyInput = $("#api-key");
var searchInput = $("#search-text");
var searchBtn = $("#search-button");
var recipeDisplay = $("#recipe-display");
var saveModal = $("#saved-modal");
var creditInfo = $(".credit-info-1");
var apiKey = "";
var recipeArr = [];
var savedRecipes = localStorage.getItem("savedRecipes");
var recipeSearch = "";
var currentRecipe = [];
var ingredientArr = [];

// function that picks a random image for homescreen backdrop on page load
// placed at top of file as runs as soon as page loaded
$(document).ready(function () {
  var images = ["strawberry", "banana", "beans", "steak", "salad", "pizza", "burger", "roast chicken", "bbq", "lasagne"];
  var loadingBackground = Math.floor(Math.random() * images.length);
  recipeSearch = images[loadingBackground];
  unsplashImg();
});

// on scroll up, drop the header down - StackOverflow FTW !
$(window).bind('mousewheel', function(event) {
  if (event.originalEvent.wheelDelta >= 0) {
      console.log('Scroll up');
      $("#slide-header").slideDown("slow");
  }
  else {
    // on scroll down, pull the header up - also happens in card populate func
      console.log('Scroll down');
      $("#slide-header").slideUp("slow");
  }
});

// dark to light mode favicon change
const faviconTag = document.getElementById("faviconTag");
const isDark = window.matchMedia("(prefers-color-scheme: dark)");
const changeFavicon = () => {
  if (isDark.matches) faviconTag.href = "./assets/images/light.svg";
  else faviconTag.href = "./assets/images/dark.svg";
};
// run this to make sure it gets called at least once
changeFavicon();
// change favicon when theme mode changes 
isDark.addEventListener("change", changeFavicon);

// Event Handlers
// Search button event handler for searching for recipes
$(searchBtn).on("click", function (event) {
  event.preventDefault();
  $(".result-heading").attr("class", "title is-4 col-lg-12 has-text-centered");
  $("#recipe-title-main").css("display", "inline");
  apiKey = $(apiKeyInput).val();
  recipeSearch = $(searchInput).val();
  getRecipes();
  searchInput.val("");
});

// Modal Event Handlers
// Event handler to display recipe steps from diplayed favoutites
$(savedRecipesBtn).on("click", function (event) {
  event.preventDefault();
  //modal background color
  $("#recipes").css("background-color", "black");
  $(saveModal).addClass("is-active");
  var myRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  recipeArr = myRecipes;
  if (recipeArr === null) {
    recipeArr = [];
    return;
  }
  $("#recipes").empty();
  for (let i = 0; i < recipeArr.length; i++) {
    var recipeName = recipeArr[i].recipeTitle;
    var result = $("<section>").addClass("recipe-item").val(recipeName);
    var resultAnchor = $("<a>").attr("class", "recipeUrl").attr("data-link", recipeName).css("color", "white");
    resultAnchor.append($("<h2>").addClass("has-text-black is-size-4 pt-3 recipe-card-title").text(recipeName));
    result.append(resultAnchor);
    $("#recipes").append(result);
  };
  var clearButton = $("<button>").addClass("clear-btn button is-pulled-right is-primary").text("CLEAR Favourites").attr("id", "clear-btn");
  $("#recipes").append(clearButton);
});

// listener for clear button 
$("#saved-modal").on("click", ".clear-btn", function (event) {
  event.preventDefault();
  localStorage.clear();
  $("#recipes").empty();
  // $("#display-saved-recipe").empty();
});


// Event handler to favourite a recipe
$("#displayed-modal").on("click", ".save-recipe", function () {
  $('.heart').css('color', 'red')

  localStorage.getItem("savedRecipes");
  var recipeTitleFromModal = $(this).closest(".modal").find(".modal-card-title").text()

  if (recipeArr !== null) {
    for (let i = 0; i < recipeArr.length; i++) {
      if (recipeArr[i].recipeTitle.includes(recipeTitleFromModal) === true) {
        return;
      }
    }
  }

  // gets the id of the recipe clicked in the modal to use in function call for ingredients
  getIngredients($(this).closest(".modal").find("#recipe-id").text());
  // grab the single search data with id and add to main obj
  var ingredients = [];
  ingredients.push(JSON.parse(localStorage.getItem("ingredients")));
  var tosaveRecipe = {
    recipeTitle: $(this).closest(".modal").find(".modal-card-title").text(),
    recipeInstructions: $(this).closest(".modal").find(".modal-card-body").text(),
    id: $(this).closest(".modal").find("#recipe-id").text(),
    ingredients: ingredients
  }

  recipeArr.push(tosaveRecipe);
  localStorage.setItem("savedRecipes", JSON.stringify(recipeArr));
});

// Event handler to open the recipe steps from the favourite recipes modal
$("#saved-modal").on("click", ".recipeUrl", function () {
  currentRecipe = [];
  $("#saved-recipe-title").empty();
  $("#display-saved-recipe").empty();
  //modal background color
  $("#display-saved-recipe").css("background-color", "black");
  var currentTitle = $(this).text();
  currentRecipe.push(currentTitle);
  recipeArr.forEach(function (e) {
    if (currentTitle === e.recipeTitle) {
      $(saveModal).removeClass("is-active");
      $("#recipe-modal").addClass("is-active");
      var recipe = $("<h2>").addClass("recipe-modal-header").text(currentTitle);
      $("#saved-recipe-title").append(recipe);

      var instructions = $("<div>").addClass("text-dark recipe-modal-body");
      var recipeTextString = e.recipeInstructions;
      // remove button text from modal text grab by trimming the end of the string
      recipeTextString = recipeTextString.substr(0, recipeTextString.length - 77);
      var recipeTextArr = recipeTextString.split("   ");
      // add recipe steps to modal
      $("")
      for (let i = 0; i < recipeTextArr.length; i++) {
        var instructionText = $("<p>").css("color", "white");
        instructionText.text(recipeTextArr[i]);
        instructions.append(instructionText);
        $("#display-saved-recipe").append(instructions);
      } // adding back button and ingredients button to the modal
      var backButton = $("<button>").addClass("back-btn button is-primary").text("< Back").attr("id", "back-btn");
      var ingredientList = $("<button>").addClass("ingredients button is-primary is-pulled-right").text("Ingredients");
      $("#display-saved-recipe").append(backButton, ingredientList);
    }
  });
});

// Event handler to display ingredients required for a recipe from searched recipes
$("#displayed-modal").on("click", ".ingredients", function () {
  // clear contents before adding new content
  $("#ingredients-title").empty();
  $("#ingredientsrecipe").empty();
  // hide / show modals
  $("#displayed-modal").removeClass("is-active");
  $("#ingredients-modal").addClass("is-active");

  var currentTitle = $(this).text();
  $("#ingredients-title").append(currentTitle);
  //var ingredientsArr = [];
  var ingredientsArr = JSON.parse(localStorage.getItem("ingredients"));
  // ingredientsArr = ingredientsArr.split(",");
  $("#display-ingredients").css("background-color", "rgb(77, 0, 77)");

  for (let i = 0; i < ingredientsArr.length; i++) {

    var ingredientsText = $("<p>").css("color", "white");
    ingredientsText.text(ingredientsArr[i]);
    $("#ingredientsrecipe").append(ingredientsText);
  }
  var backButton = $("<button>").addClass("back-btn button is-primary").text("< Back").attr("id", "back-btn");
  $("#ingredientsrecipe").append(ingredientsText, backButton);
});

// Event handler to display the required ingredients for the favourite recipes
$("#recipe-modal").on("click", ".ingredients", function () {
  $("#ingredients-title").empty();
  $("#ingredientsrecipe").empty();
  $("#recipe-modal").removeClass("is-active");
  $("#ingredients-modal").addClass("is-active");

  var recipeFromLocalStorageObj = JSON.parse(localStorage.getItem("savedRecipes"));
  var ingredientsTitle = $(this).text();
  $("#ingredients-title").append(ingredientsTitle);

  $("#display-ingredients").css("background-color", "rgb(77, 0, 77)");
  for (let i = 0; i < recipeFromLocalStorageObj.length; i++) {
    if (recipeArr[i].recipeTitle.includes(currentRecipe)) {

      var ingredientStep = recipeFromLocalStorageObj[i].ingredients.toString();
      ingredientStep = ingredientStep.split("   ");
      for (let k = 0; k < ingredientStep.length; k++) {
        var ingredientsText = $("<p>").css("color", "white");
        ingredientsText.text(ingredientStep[k]);
        $("#ingredientsrecipe").append(ingredientsText);
      }
    }
  }
  // add back button and ingredients button to recipe steps
  var backButton = $("<button>").addClass("back-to-saved-steps button is-primary").text("< Back").attr("id", "back-btn");
  $("#ingredientsrecipe").append(ingredientsText, backButton);
});

// Event handlers to close / open modals
// Event handler to close saved modal
$(".close-modal").on("click", function () {
  $("#saved-modal").removeClass("is-active");
  $("#displayed-modal").removeClass("is-active");
  $("#recipe-modal").removeClass("is-active");
  $("#ingredients-modal").removeClass("is-active");

});

// Event handlers for back button
// Event handler for back button on the recipe-modal to saved-modal
$("#recipe-modal").on("click", ".back-btn", function () {
  $("#recipe-modal").removeClass("is-active");
  $("#saved-modal").addClass("is-active");
});

// Event handler for back button on the ingredients-modal to display-modal
$("#ingredients-modal").on("click", ".back-btn", function () {
  $("#ingredients-modal").removeClass("is-active");
  $("#displayed-modal").addClass("is-active");
});

// Event handler for back button on the ingredients-modal to recipe-modal
$("#ingredients-modal").on("click", ".back-to-saved-steps", function () {
  $("#ingredients-modal").removeClass("is-active");
  $("#recipe-modal").addClass("is-active");
});

// Functions
// function to get recipes and place them in cards
function getRecipes() {
  // localStorage.getItem("savedRecipes");

  // Clearing the #recipe-display and #recipe elements on a new search ready to append content
  $("#recipe-display").empty();
  $("#recipe").empty();

  // Spoonacular API query
  const recipeIdSearch = "https://api.spoonacular.com/recipes/complexSearch?query=" + recipeSearch + "&apiKey=" + apiKey + "&includeInstruction=true&addRecipeInformation=true&number=9";

  // Initial Spoonacular API call
  $.ajax({
    url: recipeIdSearch,
    method: "GET",
  }).then(function (response) {

    // Setting the recipe results card display
    var resultCard = $("<div>").addClass("card result-card has-background-black");
    var resultBody = $("<div>").addClass("card-body");
    var resultCardRow = $("<div>").addClass("row justify-content-center");
    $(resultBody).append(resultCardRow);
    $(resultCard).append(resultBody);
    $(recipeDisplay).append(resultCard);
    if (response.totalResults === 0) {
      $("#recipe-title-main").css("display", "none");
      $(".card-body").text("Sorry! No recipe results found -  Please try another search").addClass("no-results-text");
      return;
    }
    // slide header up when cards populate
    $("#slide-header").slideUp("slow");
    for (let i = 0; i < response.results.length; i++) {
      var recipeCard = $("<div>").addClass("col-lg-3 col-md-5 m-2 p-0 card");
      var recipeImage = $("<img>").attr("src", response.results[i].image);
      var header = $("<div>").addClass("card-header h-100");
      var headerTitle = $("<h5>").text(response.results[i].title).addClass("card-title text-dark");
      $(header).append(headerTitle);
      $(recipeCard).append(header, recipeImage);
      $(resultCardRow).append(recipeCard);
      // set the credits at the bottom from json response
      creditInfo.text(response.results[i].creditsText);

      // Event handler to display the recipe steps when the image is clicked
      recipeCard.click(function (e) {
        $("#recipe").empty();
        $("#recipe-title").empty();
        $("#displayed-modal").addClass("is-active");
        var recipe = $("<h2>").addClass("recipe-modal-header").text(e.currentTarget.firstChild.innerText);
        $("#recipe-title").append(recipe);

        for (let i = 0; i < response.results.length; i++) {
          if (response.results[i].title === e.currentTarget.firstChild.innerText) {


            var recipeLength = response.results[i].analyzedInstructions[0].steps.length;
            var recipeId = response.results[i].id;
            $("#displayed-recipe").css("background-color", "black");
            $("#recipe-id").text(recipeId);
            getIngredients(recipeId);

            for (k = 0; k < recipeLength; k++) {
              var recipeSteps = $("<p>").css("color", "white");
              // putting a large space at the start of each recipe step to separate on later
              recipeSteps.text("   " + (k + 1) + ".) " + response.results[i].analyzedInstructions[0].steps[k].step);
              $("#recipe").append(recipeSteps);
            }

            // Buttons to save the recipe as a favourite or view the ingredients list
            var saveRecipe = $("<button>").addClass("save-recipe button is-primary").html("Mark as Favourite &nbsp; <span class='heart'> ❤</span>");
            var ingredientList = $("<button>").addClass("ingredients button is-primary is-pulled-right").text("Ingredients"); // ❤
            $("#recipe").append(saveRecipe, ingredientList);
          }
        }
      })
    }
  });
  unsplashImg();
}

// Function to call the background images from Unsplash
function unsplashImg() {
  var APIKeyUnsplash = "6E6B5n0kcsJUWySMsG9ewE8Ddesw6MegtEY4FU5_8gE";
  if ($(searchInput).val()) {
    recipeSearch = $(searchInput).val();
  }
  var imageURL = "https://api.unsplash.com/search/photos/?query=" + recipeSearch + "&client_id=" + APIKeyUnsplash;

  $.ajax({
    url: imageURL,
    method: "GET",
  }).then(function (responseUnsplash) {
    // using unsplash image as background for each user search
    var backgroundURL = responseUnsplash.results[0].urls.full;
    $("main").css("background", "transparent url('" + backgroundURL + "') no-repeat center center fixed");
    $("main").css("background-size", "cover");
    $("main").css("background-position", "center");
    $("main").css("background-repeat", "no-repeat");
  });
}

// Function to get the ingredients for the selected recipe id
function getIngredients(recipeId) {
  var queryURL = "https://api.spoonacular.com/recipes/" + recipeId + "/information?includeNutrition=false&apiKey=" + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (recipeIdResponse) {
    ingredientArr = [];
    for (let i = 0; i < recipeIdResponse.extendedIngredients.length; i++) {
      var ingredient = recipeIdResponse.extendedIngredients[i].name;
      var measureAmount = recipeIdResponse.extendedIngredients[i].measures.metric.amount.toFixed(1);
      var measureUnit = recipeIdResponse.extendedIngredients[i].measures.metric.unitLong;
      // store array of ingredients pre-formatted per line
      ingredientArr.push("   " + (i + 1) + ".)  " + measureAmount + " " + measureUnit + " " + ingredient);
    } // save ingredients from API call with recipe ID
    localStorage.setItem("ingredients", JSON.stringify(ingredientArr));


  })
}

