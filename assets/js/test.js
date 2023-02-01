var savedRecipesBtn = $("#saved-recipes");
var apiKeyInput = $("#api-key");
var searchInput = $("#search-text");
var searchBtn = $("#search-button");
var recipeDisplay = $("#recipe-display");
var apiKey = "";
var recipeArr = [];
var savedRecipes = localStorage.getItem("savedRecipes");
var recipeSearch = "";


$(searchBtn).on("click", function (event) {
    event.preventDefault();
    apiKey = $(apiKeyInput).val();
    console.log(apiKey);
    recipeSearch = $(searchInput).val();
    console.log(recipeSearch);
    recipeArr.push(recipeSearch);
    console.log(recipeArr);
    localStorage.setItem("savedRecipes", JSON.stringify(recipeArr));
    getRecipes();
    searchInput.val("");
}) 

function getRecipes() {
    const recipeIdSearch = "https://api.spoonacular.com/recipes/complexSearch?query=" + recipeSearch + "&apiKey=" + apiKey + "&includeInstruction=true&addRecipeInformation=true";
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
        for (i = 0; i < response.results.length; i++) {
            console.log(response.results[i].title);
            console.log(response.results[i].image);
            var recipeCard = $("<div>").addClass("col-lg-3 col-md-5 m-2 p-0 card");
            var recipeImage = $("<img>").attr("src", response.results[i].image);
            var header = $("<div>").addClass("card-header");
            var headerTitle = $("<h5>").text(response.results[i].title);
            $(header).append(headerTitle);
            $(recipeCard).append(recipeImage, header);
            $(resultCardRow).append(recipeCard);
        }
    });
}
