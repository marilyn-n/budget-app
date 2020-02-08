// BUDGET CONTROLLER
var budgetController = (function() {

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  var Expense = function(id, description, value) {
    this.id = id,
    this.description = description,
    this.value = value
  };

  var Income = function(id, description, value) {
    this.id = id,
    this.description = description,
    this.value = value
  };

  

})();

// UI CONTROLLER
var uIController = (function() {
  return {
    getInput: function() {
      return {
        type: document.querySelector('.add__type').value,
        description: document.querySelector('.add__description').value, 
        value: document.querySelector('.add__value').value
      }
    }
  }

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgCrt, uiCrt) {

  const form = document.querySelector('form.add__container');

  const addItem = (e) => {
    e.preventDefault();
    // get the value of input field
    var input = uiCrt.getInput();
    console.log(input);

    // add the item to the budget controller

    // add the item to the UI controller

    // calculate the budget

    // display budget on UI

  }


  

  form.addEventListener('submit', addItem);

})(budgetController, uIController);
