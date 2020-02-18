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
    this.value = value,
    this.percentage = -1
    return this
  };

  var Income = function(id, description, value) {
    this.id = id,
    this.description = description,
    this.value = value
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100)
    } else {
      this.percentage = -1;
    }
  }

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }

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

    calculatePercentages: function () {
      data.allItems.exp.forEach(exp => exp.calcPercentage(data.totals.inc))
    },

    getPercentages: function () {
      var allPercentages = data.allItems.exp.map(exp => exp.getPercentage())
      return allPercentages;
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
  
  var formatNumber = function(num) {
    return num.toFixed(2)
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector('.add__type').value,
        description: document.querySelector('.add__description').value, 
        value: parseInt(document.querySelector('.add__value').value)
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
              <div class="item__value">- ${formatNumber(obj.value)}</div>
              <div class="item__percentage">${obj.percentage}%</div>
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
              <div class="item__value">+ ${formatNumber(obj.value)}</div>
              <div class="item__delete">
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
          </div>
        </div>
        `
      }
    },

    deleteListItem: function(itemId) {
      var el = document.getElementById(itemId);
      el.parentNode.removeChild(el);
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

      budtitle.textContent = `$ ${formatNumber(obj.budget)}`;
      budIncome.textContent = `+ ${formatNumber(obj.totalInc)}`;
      budExpenses.textContent = `- ${formatNumber(obj.totalExp)}`;

      obj.percentage > 0 ? percentageLabel.textContent = `${obj.percentage}%` : '---'
      
    },

    displayPercentages: function(percentagesArr) {
      var labels = [...document.querySelectorAll('.item__percentage')];
      labels.map((label , index ) => {
        label.textContent = `${percentagesArr[index]}%`
      });
    }

  }

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgCrt, uiCrt) {
  const form = document.querySelector('form.add__container');
  const container = document.querySelector('.container.clearfix');
  const month = document.querySelector('.budget__title--month');
  var option = document.querySelector('.add__type');

  const updatePercentages = () => {
    // 1. calculate percentages
    budgCrt.calculatePercentages();
    // 2. Read percentages from the budget controller
    var percentages = budgCrt.getPercentages();
    // 3. update UI with new percentages
    uiCrt.displayPercentages(percentages);
    console.log(percentages);
    
  }

  const updateBudget = () => {
    // calculate budget
    budgCrt.budgetCalculator()
    // return the budget
    var budget = budgCrt.getBudget()
    // display budget to UI
    uiCrt.displayBudget(budget)
    updatePercentages()
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
      uiCrt.deleteListItem(itemID)
      // 3. update and show new budget
      updateBudget();
    }
    
  }

  const focusColor = () => {
    var fields = [...document.querySelectorAll('.add__description, .add__value, .add__type')];
    var valueBtn = document.querySelector('.add__btn');

    fields.map(field => field.classList.toggle('red-focus'));

    valueBtn.classList.toggle('red');

    
  }

  container.addEventListener('click', crtDeleteItem);
  form.addEventListener('submit', addItem);
  form.addEventListener('submit', uiCrt.clearFields);
  window.addEventListener('load', function() {
    var now = new Date();
    var currentMonth = now.toDateString();
    month.textContent = currentMonth;
  })

  option.addEventListener('change', focusColor)
  


})(budgetController, uIController);
