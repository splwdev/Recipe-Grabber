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

// event handler for searchBtn
$(searchBtn).on("click", function (event) {
  event.preventDefault();
  apiKey = $(apiKeyInput).val();
  recipeSearch = $(searchInput).val();
  // console.log(recipeSearch);
  recipeArr.push(recipeSearch);
  localStorage.setItem("savedRecipes", JSON.stringify(recipeArr));
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
    var result = $("<section>")
      .addClass("recipe-item")
      .val(JSON.stringify(savedRecipes[1]));
    result.append(
      $("<h2>").addClass("has-text-black is-size-4 pt-3").text(savedRecipes[0])
    );
    $("#recipes").append(result);
  });
});

// event handler to close modal
$(".close-modal").on("click", function () {
  $("#saved-modal").removeClass("is-active");
});

// function to get recipes and place them in cards
// currently only using spoonacular, need to incorporate unsplash for images instead
function getRecipes() {
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
    var resultCard = $("<div>").addClass("card result-card");
    var resultBody = $("<div>").addClass("card-body");
    var resultCardRow = $("<div>").addClass("row justify-content-center");
    $(resultBody).append(resultCardRow);
    $(resultCard).append(resultBody);
    $(recipeDisplay).append(resultCard);
    for (i = 0; i < response.results.length; i++) {
      //console.log(response.results[i].title);
      //log(response.results[i].image);
      var recipeCard = $("<div>").addClass("col-lg-3 col-md-5 m-2 p-0 card");
      var recipeImage = $("<img>").attr("src", response.results[i].image);
      var header = $("<div>").addClass("card-header h-100");
      var headerTitle = $("<h5>").text(response.results[i].title).addClass("card-title text-dark");
      var getRecipe = $("<button>")
        .addClass("get-recipe button is-primary")
        .text("Get Recipe");
      $(header).append(headerTitle);
      $(recipeCard).append(header, recipeImage, getRecipe);
      $(resultCardRow).append(recipeCard);
    }
  });
  unsplashImg();
}

function unsplashImg() {
  var APIKeyUnsplash = "6E6B5n0kcsJUWySMsG9ewE8Ddesw6MegtEY4FU5_8gE";
  recipeSearch = $(searchInput).val();
  var imageURL =
    "https://api.unsplash.com/search/photos/?query=" +
    recipeSearch +
    "&client_id=" +
    APIKeyUnsplash;

  $.ajax({
    url: imageURL,
    method: "GET",
  }).then(function (responseUnsplash) {
    var backgroundURL = responseUnsplash.results[0].urls.full;
    console.log(backgroundURL)
    $("main").css("background", "transparent url('"+backgroundURL+"') no-repeat center center fixed");
  });

}
// dark light mode favicon change
const faviconTag = document.getElementById("faviconTag");
const isDark = window.matchMedia("(prefers-color-scheme: dark)");
const changefavicon = () => {
if (isDark.matches) faviconTag.href = "./assets/images/light.svg";
else faviconTag.href = "./assets/images/dark.svg";
};
// change favicon when theme mode changes 
changefavicon();
isDark.addEventListener("change", changefavicon);  
