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
    },
    budget: 0,
    percentage: -1
  }

  var Expense = function(id, description, value) {
    this.id = id,
    this.description = description,
    this.value = value
    return this
  };

  var Income = function(id, description, value) {
    this.id = id,
    this.description = description,
    this.value = value
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].map(item => {
      sum += item.value
    });

    data.totals[type] = sum;
  }

  return {
    // method to add a new expense or income item to list
    addItem: function(type, des, val) { 
      var newItem;
      var ID;

      // create new id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      } else {
        ID = 0;
      }
      
      // create new item based on type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if(type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // push newItem to data expense or income array
      data.allItems[type].push(newItem);
     
      return newItem
    },

    deleteItem: function(type, id) {

     var ids = data.allItems[type].map(function(item) {
      return item.id
     });

     var index = ids.indexOf(id);

     if (index !== -1) {
       data.allItems[type].splice(index, 1);
     }
    },

    budgetCalculator: function() {
      // calculate the budget
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate budget income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
       
      // display budget on UI
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
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
        value: Number(document.querySelector('.add__value').value)
      }
    },

    addListItem: function(obj , type) {
      const incomeContainer = document.querySelector('.income__list');
      const expenseContainer = document.querySelector('.expenses__list');

      // create HTML item list with placeholcer
      if (type === 'exp') {
        expenseContainer.innerHTML += 
        `
        <div class="item clearfix" id="exp-${obj.id}">
          <div class="item__description">${obj.description}</div>
          <div class="right clearfix">
              <div class="item__value">- ${obj.value}</div>
              <div class="item__delete">
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
          </div>
        </div>
        `
      } else if(type === 'inc') {
        incomeContainer.innerHTML += 
        `
        <div class="item clearfix" id="inc-${obj.id}">
          <div class="item__description">${obj.description}</div>
          <div class="right clearfix">
              <div class="item__value">+ ${obj.value}</div>
              <div class="item__delete">
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
          </div>
        </div>
        `
      }
    },

    clearFields: function () {
      var inputFields = document.querySelectorAll('input[name=field]');
      inputFields.forEach(input => input.value = '');
      inputFields[0].focus();
    },

    displayBudget: function(obj) {
      var budtitle = document.querySelector('.budget__value');
      var budIncome = document.querySelector('.budget__income--value');
      var budExpenses = document.querySelector('.budget__expenses--value');
      var percentageLabel = document.querySelector('.budget__expenses--percentage');

      budtitle.textContent = `$ ${obj.budget}`;
      budIncome.textContent = `+ ${obj.totalInc}`;
      budExpenses.textContent = `- ${obj.totalExp}`;

      obj.percentage > 0 ? percentageLabel.textContent = `${obj.percentage}%` : '---'
      
    }
  }

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgCrt, uiCrt) {
  const form = document.querySelector('form.add__container');
  const container = document.querySelector('.container.clearfix');

  const updateBudget = () => {
    // calculate budget
    budgCrt.budgetCalculator()
    // return the budget
    var budget = budgCrt.getBudget()
    // display budget to UI
    uiCrt.displayBudget(budget)
    
  }

  const addItem = function(e) {
    e.preventDefault();
    // get the value of input field

    var input = uiCrt.getInput();
    if (input.description && input.value > 0) {

      // add the item to the budget controller
      var newItem = budgCrt.addItem(input.type, input.description, input.value);  

      // add the item to the UI controller
      uiCrt.addListItem(newItem, input.type);

      // calculate and update budget
      updateBudget()
    }

  }

  const crtDeleteItem = function(e) {
    var itemID = e.target.parentElement.parentElement.parentElement.parentElement.id;
    if (itemID) {
      var splitID = itemID.split('-')
      var type = splitID[0];
      var ID = Number(splitID[1]);
      // 1. delete the item from the data structure
        budgetController.deleteItem(type, ID)
      // 2. detele item from the UI
      // 3. update and show new budget
    }
    
  }

  container.addEventListener('click', crtDeleteItem);
  form.addEventListener('submit', addItem);
  form.addEventListener('submit', uiCrt.clearFields);

})(budgetController, uIController);
