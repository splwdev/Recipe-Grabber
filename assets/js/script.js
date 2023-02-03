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

// event handler for searchBtn
$(searchBtn).on("click", function (event) {
  event.preventDefault();
  apiKey = $(apiKeyInput).val();
  recipeSearch = $(searchInput).val();
  // console.log(recipeSearch);
  getRecipes();
  searchInput.val("");
});

// event handler for savedRecipesBtn, opens modal with saved recipes
// still need to work on button to save recipes
$(savedRecipesBtn).on("click", function (event) {
  event.preventDefault();
  $(saveModal).addClass("is-active");
  var myRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  if (myRecipes == null) return;
  $("#recipes").empty();
  myRecipes.forEach(function (savedRecipes) {
    var result = $("<section>").addClass("recipe-item").val(JSON.stringify(savedRecipes));
    result.append($("<h2>").addClass("has-text-black is-size-4 pt-3").text(savedRecipes));
    $("#recipes").append(result);
  });
});

// event handler to close save modal
$(".close-modal").on("click", function () {
  $("#saved-modal").removeClass("is-active");
});
// event handler to close displayed-modal
$(".close-modal").on("click", function () {
  $("#displayed-modal").removeClass("is-active");
});

// event handler to add saved recipe to local storage
$("#displayed-modal").on("click", ".save-recipe", function () {
  localStorage.getItem("savedRecipes");
  var recipeTitle = $(this).closest(".modal").find(".modal-card-title").text();
  console.log(recipeTitle);
  recipeArr.push(recipeTitle);
  localStorage.setItem("savedRecipes", JSON.stringify(recipeArr));
});

// function to get recipes and place them in cards
// currently only using spoonacular, need to incorporate unsplash for images instead
function getRecipes() {
  $("#recipe-display").empty();
  $("#recipe").empty();
  recipeArr = [];
  const recipeIdSearch =
    "https://api.spoonacular.com/recipes/complexSearch?query=" +
    recipeSearch +
    "&apiKey=" +
    apiKey +
    "&includeInstruction=true&addRecipeInformation=true";
  $.ajax({
    url: recipeIdSearch,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var resultCard = $("<div>").addClass("card result-card");
    var resultBody = $("<div>").addClass("card-body");
    var resultCardRow = $("<div>").addClass("row justify-content-center");
    $(resultBody).append(resultCardRow);
    $(resultCard).append(resultBody);
    $(recipeDisplay).append(resultCard);
    if(response.totalResults === 0){
      $(".card-body").text("No results -  Please try another search" );
      return;
    }
    for (i = 0; i < response.results.length; i++) {
      var recipeCard = $("<div>").addClass("col-lg-3 col-md-5 m-2 p-0 card");
      //var recipeTitle = $("<a>").attr("id", response.results[i].title.replaceAll(' ', '-'));
      var recipeImage = $("<img>").attr("src", response.results[i].image).attr("target", "_blank").attr("rel", "noopener noreferrer");
      var header = $("<div>").addClass("card-header h-100");
      var headerTitle = $("<h5>").text(response.results[i].title).addClass("card-title text-dark");
      // var saveRecipe = $("<button>").addClass("save-recipe button is-primary").text("Save Recipe");
      $(header).append(headerTitle);
      //$(recipeTitle).append(recipeImage);
      $(recipeCard).append(header, recipeImage);
      //var getRecipe = $("<button>").addClass("get-recipe button is-primary").text("Get Recipe");

      //$(recipeTitle).append(recipeImage);
      $(resultCardRow).append(recipeCard);

      recipeCard.click(function(e) {
        $('#recipe').empty();
        $("#recipe-title").empty();
        $("#displayed-modal").addClass("is-active");
        var recipe = $('<h2>').addClass("text-dark recipe-modal-header").text(e.currentTarget.firstChild.innerText);
      $('#recipe-title').append(recipe);
        for(i = 0; i < 10; i++) {
          if(response.results[i].title === e.currentTarget.firstChild.innerText) {
            var recipeLength = response.results[i].analyzedInstructions[0].steps.length

            for (k = 0; k < recipeLength; k++) {
             var recipeSteps = $('<p>');
             recipeSteps.text(k + 1 + ".) " + response.results[i].analyzedInstructions[0].steps[k].step);
             $('#recipe').append(recipeSteps);
            }
            
            var saveRecipe = $("<button>").addClass("save-recipe button is-primary").text("Save Recipe");
            $('#recipe').append(saveRecipe);
          }
        }
      })
    }
  });
  unsplashImg();
}

function unsplashImg() {
  var APIKeyUnsplash = "6E6B5n0kcsJUWySMsG9ewE8Ddesw6MegtEY4FU5_8gE";
  recipeSearch = $(searchInput).val();
  var imageURL ="https://api.unsplash.com/search/photos/?query=" + recipeSearch + "&client_id=" + APIKeyUnsplash;

  $.ajax({
    url: imageURL,
    method: "GET",
  }).then(function (responseUnsplash) {
    var backgroundURL = responseUnsplash.results[0].urls.full;
    $("main").css("background", "transparent url('"+backgroundURL+"') no-repeat center center fixed");
    $("main").css("background-size", "cover")
    $("main").css("background-position", "center")
    $("main").css("background-repeat", "no-repeat")
  });
}

