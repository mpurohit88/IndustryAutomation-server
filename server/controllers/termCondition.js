const TermCondition = require("../models/termCondition");

const getTermCondition = function (req, res, next) {

  console.log("***************", req.query)
  new TermCondition({}).getByCompanyId(req.decoded.companyId, req.query.type).then(function (text) {
    res.status(200).send({ TermCondition: text[0] });
  });
};

module.exports = { getTermCondition: getTermCondition };