const CurrencyType = require("../models/CurrencyType.js")

const add = function (req, res, next) {
  let params = {
    createdBy: req.decoded.id,
    id: req.body.id,
    name: req.body.name,
    html_code: req.body.html_code,
    isActive: req.body.isActive
  };
  const newCurrencyType = new CurrencyType(params);

  if (!req.body.name || !req.body.html_code) {
    res.send({ "Error: ": "Input is not proper" });
  } else {
    try {
      newCurrencyType.add().then(function (currencyList) {
        res.send(currencyList);
      });
    } catch (err) {
      res.send({ "Error: ": err });
      console.log("Error: ", err);
    }
  }
}

const all = function (req, res, next) {
  try {
    new CurrencyType({}).all().then(function (currencyList) {
      res.send(currencyList);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = { add: add, all: all };