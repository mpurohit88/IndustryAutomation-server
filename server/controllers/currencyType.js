const CurrencyType = require("../models/CurrencyType.js")

const all = function (req, res, next) {
  try {
    new CurrencyType({}).all().then(function (currencyList) {
      res.send(currencyList);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = { all: all };