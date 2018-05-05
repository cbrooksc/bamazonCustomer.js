var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  //username
  user: "root",

  //Your password
  password: "blank123",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  displayItems();
});

function displayItems() {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) {
      console.log(err);
    }
    for (var i = 0; i < response.length; i++) {
      console.log(
        "item_id: " + response[i].item_id +
        "| product_name: " +
          response[i].product_name +
          "| department_name: " +
          response[i].department_name +
          "| price: " +
          response[i].price +
          "| stock_quantity: " +
          response[i].stock_quantity
      );
    }
    askQuestion();
  });
}

function askQuestion() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "input",
        message: "Please pick a item_id ranging from 1 -12"
        // choices: [
        //     "What's the the ID of the product you would like to buy",
        //     "How many units of the product they would like to buy"
        // ]
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"
      }
    ])
    .then(function(answer) {
      console.log(answer.quantity);
      console.log(answer.action);

      if (answer.quantity < answer.action) {
        console.log(answer);
      } else {
        return "Insufficient quantity!";
      }
      connection.query(
        "Update products SET stock_quantity = - ? where item_id = ? ",
        // "Update products SET stock_quantity = - ? where item_id = ? (SELECT stock_quantity FROM products where item_id = ?)",
        [parseInt(answer.quantity), answer.action],
        function(err, response) {
          if (err) {
            console.log(err);
          }
          console.log(response);
        }
      );
      //   switch (answer.action) {
      //     case "What's the the ID of the product you would like to buy":
      //       ();
      //       break;
      //     case "How many units of the product they would like to buy":
      //       ();
      //       break;
      //   }
      newDisplay();
    });
}

function newDisplay() {
  console.log("Selecting the new items with the total price of the items..\n");
  connection.query(
    "SELECT item_id, price, stock_quantity, (price * stock_quantity) as totalPrice FROM products",
    function(err, response) {
      if (err) {
        console.log(err);
      }
      debugger;
      for (var i = 0; i < response.length; i++) {
        console.log(
          "Item_id: " + 
            response[i].item_id +
            "| Price: " +
            response[i].price +
            "| Stock_quantity: " +
            response[i].stock_quantity +
            "| TotalPrice: " +
            response[i].price * response[i].stock_quantity
        );
      }
    }
  );
}
