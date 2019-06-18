const Document = require("../models/product.js")

const add = function (req, res, next) {
  const data = req.body;

  let params = {
    createdBy: req.decoded.id,
    company_id: req.decoded.companyId,
    id: data.id,
    name: data.name,
    task_id: data.task_id,
    isActive: data.isActive
  };

  const newDocument = new Document(params);

  try {
    newDocument.add().then(function (result) {
      res.send({ "success": true });
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const all = function (req, res, next) {
  try {
    if (req.decoded.role === 'admin') {
      new Product({}).all().then(function (productList) {
        res.send(productList);
      });
    } else {
      new Product({}).allByCompanyId(req.decoded.companyId).then(function (productList) {
        res.send(productList);
      });
    }
  } catch (err) {
    console.log("Error: ", err);
  }
}

const detailsByCompanyId = function (req, res, next) {
  try {
    new Product({}).detailsByCompanyId(req.decoded.companyId).then(function (productList) {
      res.send(productList);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = { add: add, all: all, detailsByCompanyId: detailsByCompanyId };