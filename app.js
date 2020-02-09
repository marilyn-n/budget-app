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

  return {
    // method to add a new expense or income item to list
    addItem: function(type, des, val) { 
      var newItem, ID;

      // create new id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      } else {
        ID = 0;
      }
      
      // create new item based on type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val) 
      } else if(type === 'inc') {
        newItem = new Income(ID, des, val) 
      }

      // push newItem to data expense or income array
      data.allItems[type].push(newItem);
    },

    testing: function (){
      console.log(data);
      
    }
    
  }

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
    var newItem = budgCrt.addItem(input.type, input.description, input.value);
    
    // add the item to the budget controller

    // add the item to the UI controller

    // calculate the budget

    // display budget on UI

  }


  

  form.addEventListener('submit', addItem);

})(budgetController, uIController);
