// BUDGET CONTROLLER
var budgetController = (function() {

})();

// UI CONTROLLER
var uIController = (function() {

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgCrt, uiCrt) {

  const form = document.querySelector('form.add__container');

  const addItem = (e) => {
    e.preventDefault();
    console.log('hi');
    
    // get the value of input field

    // add the item to the budget controller

    // add the item to the UI controller

    // calculate the budget

    // display budget on UI

  }

  form.addEventListener('submit', addItem);

})(budgetController, uIController);
