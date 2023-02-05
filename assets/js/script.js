// get working queries for Unsplash and Spoonacular

// SPOONACULAR
// interperate response of user input for desired dish
// allow user to select a recipe for the dish they want

// set up localstorage if a user decides to save the recipe

// set up a getItem so the user can recall a recipe that they previously saved

// Once the user selects a recipe, get dish image from Spoonacular along with recipe data

// Unsplash
// once the application displays a list of dishes, use unsplash to show an image next to each dish title


// if theres time, allow user to get a search result from list of ingredients

// Global variables
var savedRecipesBtn = $("#saved-recipes");
var apiKeyInput = $("#api-key");
var searchInput = $("#search-text");
var searchBtn = $("#search-button");
var recipeDisplay = $("#recipe-display");
var saveModal = $("#saved-modal");
var apiKey = "";
var recipeArr = [];
var savedRecipes = localStorage.getItem("savedRecipes");
var recipeSearch = "";
var currentRecipe = [];

// dark light mode favicon change
const faviconTag = document.getElementById("faviconTag");
const isDark = window.matchMedia("(prefers-color-scheme: dark)");
const changeFavicon = () => {
  if (isDark.matches) faviconTag.href = "./assets/images/light.svg";
  else faviconTag.href = "./assets/images/dark.svg";
};
// change favicon when theme mode changes 
changeFavicon();
isDark.addEventListener("change", changeFavicon);

// Event Handlers
// Search button event handler for searching for recipes
$(searchBtn).on("click", function (event) {
  event.preventDefault();
  apiKey = $(apiKeyInput).val();
  recipeSearch = $(searchInput).val();
  getRecipes();
  searchInput.val("");
});

// Modal Event Handlers
// Event handler to display recipes marked as favourites
$(savedRecipesBtn).on("click", function (event) {
  event.preventDefault();
  $(saveModal).addClass("is-active");
  var myRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  recipeArr = myRecipes;
  if (recipeArr == []) {
    return;
  }
  $("#recipes").empty();
  for (i = 0; i < recipeArr.length; i++) {
    var recipeName = recipeArr[i].recipeTitle;
    var result = $("<section>").addClass("recipe-item").val(recipeName);
    var resultAnchor = $("<a>").attr("class", "recipeUrl").attr("data-link", recipeName);
    resultAnchor.append($("<h2>").addClass("has-text-black is-size-4 pt-3 recipe-card-title").text(recipeName));
    result.append(resultAnchor);
    $("#recipes").append(result);
  };
});

// Event handler to favourite a recipe
$("#displayed-modal").on("click", ".save-recipe", function () {
  localStorage.getItem("savedRecipes");
  var recipeTitleFromModal = $(this).closest(".modal").find(".modal-card-title").text()

  for (i = 0; i < recipeArr.length; i++) {
    if (recipeArr !== null && recipeArr[i].recipeTitle.includes(recipeTitleFromModal) === true) {
      return;
    }
  }

  getIngredients($(this).closest(".modal").find("#recipe-id").text());

  var tosaveRecipe = {
    recipeTitle: $(this).closest(".modal").find(".modal-card-title").text(),
    recipeInstructions: $(this).closest(".modal").find(".modal-card-body").text(),
    id: $(this).closest(".modal").find("#recipe-id").text(),
    ingredients: localStorage.getItem("ingredients")
  }
  console.log(tosaveRecipe);

  recipeArr.push(tosaveRecipe);
  localStorage.setItem("savedRecipes", JSON.stringify(recipeArr));
});

// Event handler to open the recipe instructions from the favourite recipes
$("#saved-modal").on("click", ".recipeUrl", function () {
  currentRecipe = [];
  $("#saved-recipe-title").empty();
  $("#display-saved-recipe").empty();
  var currentTitle = $(this).text();
  currentRecipe.push(currentTitle);
  recipeArr.forEach(function (e) {
    if (currentTitle === e.recipeTitle) {
      $(saveModal).removeClass("is-active");
      $("#recipe-modal").addClass("is-active");
      var recipe = $("<h2>").addClass("text-dark recipe-modal-header").text(currentTitle);
      $("#saved-recipe-title").append(recipe);
      var instructions = $("<div>").addClass("text-dark recipe-modal-body");
      var recipeTextString = e.recipeInstructions;
      // remove button text from modal text grab by trimming the end of the string
      recipeTextString = recipeTextString.substr(0, recipeTextString.length - 67);
      var recipeTextArr = recipeTextString.split("   ");

      for (let i = 0; i < recipeTextArr.length; i++) {
        var instructionText = $("<p>");
        instructionText.text(recipeTextArr[i]);
        instructions.append(instructionText);
        $("#display-saved-recipe").append(instructions);
      }
      var backButton = $("<button>").addClass("back-btn button is-primary").text("< Back").attr("id", "back-btn");
      var ingredientList = $("<button>").addClass("ingredients button is-primary is-pulled-right").text("Ingredients");
      $("#display-saved-recipe").append(backButton, ingredientList);
    }
  });
});

// Event handler to display ingredients required for a recipe from searched recipes
$("#displayed-modal").on("click", ".ingredients", function () {
  $("#ingredients-title").empty();
  $("#ingredientsrecipe").empty();

  $("#displayed-modal").removeClass("is-active");
  $("#ingredients-modal").addClass("is-active");

  var currentTitle = $(this).text();
  $("#ingredients-title").append(currentTitle)
  var ingredientsArr = localStorage.getItem("ingredients")
  ingredientsArr = ingredientsArr.split("   ");

  for (let i = 0; i < ingredientsArr.length; i++) {
    var ingredientsText = $("<p>");
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
  $("#saved-modal").removeClass("is-active");
  $("#ingredients-modal").addClass("is-active");
  
  var recipeId = JSON.parse(localStorage.getItem("savedRecipes"));
  var ingredientsTitle = $(this).text();
  $("#ingredients-title").append(ingredientsTitle);

  var ingredientsArr = localStorage.getItem("ingredients");
  ingredientsArr = ingredientsArr.split("   ");

  for (let i = 0; i < recipeId.length; i++) {
    if (recipeArr[i].recipeTitle.includes(currentRecipe)) {
      console.log(recipeArr[i].recipeTitle);
      console.log("yepo" + recipeArr[i].id);
      console.log(recipeArr[i].ingredients);
      var ingredientsText = $("<p>");
      ingredientsText.text(recipeArr[i].ingredients);
      $("#ingredientsrecipe").append(ingredientsText);
    }
  }

  var backButton = $("<button>").addClass("back-to-saved-steps button is-primary").text("< Back").attr("id", "back-btn");
  $("#ingredientsrecipe").append(ingredientsText, backButton);
});

// Event handlers to close / open modals
// Event handler to close saved modal
$(".close-modal").on("click", function () {
  $("#saved-modal").removeClass("is-active");
});

// Event handler to close displayed-modal
$(".close-modal").on("click", function () {
  $("#displayed-modal").removeClass("is-active");
});

// Event handler to close recipe-modal
$(".close-modal").on("click", function () {
  $("#recipe-modal").removeClass("is-active");
});

// Event handler for close ingredients modal
$(".close-modal").on("click", function () {
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

// function to get recipes and place them in cards
function getRecipes() {
  localStorage.getItem("savedRecipes");
  
  // Clearing the #recipe-display and #recipe elements on a new search
  $("#recipe-display").empty();
  $("#recipe").empty();
  
  // Spoonacular API query
  const recipeIdSearch = "https://api.spoonacular.com/recipes/complexSearch?query=" + recipeSearch + "&apiKey=" + apiKey + "&includeInstruction=true&addRecipeInformation=true";
  
  // API call
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
      $(".card-body").text("Sorry! no recipe results found -  Please try another search").addClass("no-results-text");
      return;
    }
    for (i = 0; i < response.results.length; i++) {
      var recipeCard = $("<div>").addClass("col-lg-3 col-md-5 m-2 p-0 card");
      var recipeImage = $("<img>").attr("src", response.results[i].image);
      var header = $("<div>").addClass("card-header h-100");
      var headerTitle = $("<h5>").text(response.results[i].title).addClass("card-title text-dark");
      $(header).append(headerTitle);
      $(recipeCard).append(header, recipeImage);
      $(resultCardRow).append(recipeCard);

      // Event handler to display the recipeCard when the image is clicked
      recipeCard.click(function (e) {

        $("#recipe").empty();
        $("#recipe-title").empty();
        $("#displayed-modal").addClass("is-active");
        var recipe = $("<h2>").addClass("text-dark recipe-modal-header").text(e.currentTarget.firstChild.innerText);
        $("#recipe-title").append(recipe);
        for (i = 0; i < 10; i++) {
          if (response.results[i].title === e.currentTarget.firstChild.innerText) {
            var recipeLength = response.results[i].analyzedInstructions[0].steps.length
            var recipeId = response.results[i].id
            $("#recipe-id").text(recipeId);
            getIngredients(recipeId)
            for (k = 0; k < recipeLength; k++) {
              var recipeSteps = $("<p>");
              // putting a large space at the start of each recipe step to separate on later
              recipeSteps.text("   " + (k + 1) + ".) " + response.results[i].analyzedInstructions[0].steps[k].step);
              $("#recipe").append(recipeSteps);
            }

            // Buttons to save the recipe as a favourite or view the ingredients list
            var saveRecipe = $("<button>").addClass("save-recipe button is-primary").text("Mark as Favourite ❤");
            var ingredientList = $("<button>").addClass("ingredients button is-primary is-pulled-right").text("Ingredients"); // ❤
            $("#recipe").append(saveRecipe, ingredientList);
          }
        }
      })
    }
  });
  unsplashImg();
}

// Function to call the background images from Unsplash as part of the recipe search
function unsplashImg() {
  var APIKeyUnsplash = "6E6B5n0kcsJUWySMsG9ewE8Ddesw6MegtEY4FU5_8gE";
  recipeSearch = $(searchInput).val();
  var imageURL = "https://api.unsplash.com/search/photos/?query=" + recipeSearch + "&client_id=" + APIKeyUnsplash;

  $.ajax({
    url: imageURL,
    method: "GET",
  }).then(function (responseUnsplash) {
    var backgroundURL = responseUnsplash.results[0].urls.full;
    $("main").css("background", "transparent url('" + backgroundURL + "') no-repeat center center fixed");
    $("main").css("background-size", "cover")
    $("main").css("background-position", "center")
    $("main").css("background-repeat", "no-repeat")
  });
}

// Function to get the ingredients for the selected recipes
function getIngredients(recipeId) {
  var queryURL = "https://api.spoonacular.com/recipes/" + recipeId + "/information?includeNutrition=false&apiKey=" + apiKey;
  var ingredientArr = [];

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (recipeIdResponse) {
    for (i = 0; i < recipeIdResponse.extendedIngredients.length; i++) {
      var ingredient = recipeIdResponse.extendedIngredients[i].name;
      var measureAmount = recipeIdResponse.extendedIngredients[i].measures.metric.amount.toFixed(1);
      var measureUnit = recipeIdResponse.extendedIngredients[i].measures.metric.unitLong;

      ingredientArr.push("   " + measureAmount + " " + measureUnit + " " + ingredient)
    }
    localStorage.setItem("ingredients", ingredientArr);
  })
}