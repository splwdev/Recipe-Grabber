var APIKeySpoonacular = "34eb103a0ad24befb4b7e0baab8e14c4"

var ingredietsArr = ['rice,', '+lemongrass,'];

// var recipeURL = 'https://api.spoonacular.com/recipes/complexSearch?query=Shrimp With Scallop Pasta&apiKey=' + APIKeySpoonacular + "&addRecipeInformation=true";
// var recipeIdSearch = "https://api.spoonacular.com/recipes/complexSearch?query=lasagna&apiKey=" + APIKeySpoonacular + "&addRecipeInformation=true";

var ingredientsURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" + ingredietsArr + "&apiKey=" + APIKeySpoonacular; // gets titles from ingredients list

var workingQuery = "https://api.spoonacular.com/recipes/complexSearch?query=" + response.title + "&apiKey=" + APIKey + "&includeInstruction=true&addRecipeInformation=true" // working query once we have titles from the ingredients search.

$.ajax({
    url: recipeIdSearch,
    method: 'GET'
}).then(function(response) {
    
    console.log(response)
})

var APIKeyUnsplash = "6E6B5n0kcsJUWySMsG9ewE8Ddesw6MegtEY4FU5_8gE"
var imageURL = 'https://api.unsplash.com/search/photos/?query=Lasagna&client_id=' + APIKeyUnsplash;
$.ajax({
    url: imageURL,
    method: 'GET'
}).then(function(response) {
    console.log(response)
})
