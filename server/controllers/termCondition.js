const TermCondition = require("../models/termCondition");

const getTermCondition = function (req, res, next) {

  new TermCondition({}).getByCompanyId(req.decoded.companyId, req.query.type).then(function (text) {
    res.status(200).send({ TermCondition: text[0] });
  });
};

const updateTermCondition = function (req, res, next) {
  const type = req.decoded.email.indexOf('export') > -1 ? parseInt(req.body.type) + 1 : req.body.type;

  new TermCondition({}).updateTermCondition(req.body.text, req.decoded.companyId, type).then(function (text) {
    res.status(200).send({ TermCondition: text[0] });
  });
}

module.exports = { getTermCondition: getTermCondition, updateTermCondition: updateTermCondition };