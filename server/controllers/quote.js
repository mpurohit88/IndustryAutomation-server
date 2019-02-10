const Quote = require("../models/quote.js")
const Task = require("../models/task")
const UserActivity = require("../models/userActivity")
const ActviityTaskHist = require("../models/activityTaskHist")
const QuoteProduct = require("../models/quoteProduct")

const create = function(req, res, next){
    let params = {
        createdBy: req.decoded.id,
        party_name: req.body.quote.party_name, 
        address: req.body.quote.address,
        phoneNo: req.body.quote.phoneNo,
        mobileNo: req.body.quote.mobileNo,
        products: req.body.productList
    };

    const newQuote = new Quote(params);

    try {
        if(req.body.productList.length <= 0) throw new Error('Product list can not be empty');

       newQuote.create().then(function(result) {
        if(req.decoded.role === 'admin') {
					new Quote({}).all().then(function(quoteList) {
						new Task().all().then(function(tasks) {
							new UserActivity().insert(req.decoded.id, result.quote_id).then(function(userActivityId) {
								new ActviityTaskHist().insert(userActivityId, tasks).then(function() {
									res.send(quoteList);
								});
							});
						});
					});
				} else {
					new Quote({}).allByUserId(req.decoded.id).then(function(quoteList) {
						new Task().all().then(function(tasks) {
							new UserActivity().insert(req.decoded.id, result.quote_id).then(function(userActivityId) {
								new ActviityTaskHist().insert(userActivityId, tasks).then(function() {
									res.send(quoteList);
								});
							});
						});
					});
				}
	   });
    } catch (err) {
			console.log("Error: ", err);
			res.status(500).send(err);
    }
};

const all = function(req, res, next){
	try {
        if(req.decoded.role === 'admin') {
					new Quote({}).all().then(function(quoteList) {
						res.send(quoteList);
					});
        } else {
					new Quote({}).allByUserId(req.decoded.id).then(function(quoteList) {
						res.send(quoteList);
					});
        }
 	} catch (err) {
	 	console.log("Error: ", err);
 	}
}

const getQuoteDetail = function(req, res, next){
	try {
        // if(req.decoded.role === 'admin') {
					new Quote({}).getQuoteDetail(req.decoded.id, req.query.quoteId).then(function(quoteList) {
						new UserActivity({}).getUserActivityId(req.decoded.id, req.query.quoteId).then(function(userActivityId) {
							new ActviityTaskHist({}).getByActivityId(userActivityId).then(function(tasks) {
								new QuoteProduct({}).getByQuoteId(req.query.quoteId).then(function(products) {
									res.send({quoteDetails: quoteList[0], tasks: tasks, products: products});
								})
							});
						});
					});
        // } else {
		// 			new Quote({}).allByUserId(req.decoded.id).then(function(quoteList) {
		// 				res.send(quoteList);
		// 			});
        // }
 	} catch (err) {
	 	console.log("Error: ", err);
 	}
}

const start = function(req, res, next){
	try {
		new Quote({}).update(req.body.quoteId, 2).then(function() {
			new ActviityTaskHist({}).update(req.body.taskHistId).then(function(userList) {
				new Quote({}).getQuoteDetail(req.decoded.id, req.body.quoteId).then(function(quoteList) {
					new UserActivity({}).getUserActivityId(req.decoded.id, req.body.quoteId).then(function(userActivityId) {
						new ActviityTaskHist({}).getByActivityId(userActivityId).then(function(tasks) {
							new QuoteProduct({}).getByQuoteId(req.body.quoteId).then(function(products) {
								res.send({quoteDetails: quoteList[0], tasks: tasks, products: products});
							})
						});
					});
				});
			});
		});		
 	} catch (err) {
	 	console.log("Error: ", err);
 	}
}

module.exports = {create: create, all: all, getQuoteDetail: getQuoteDetail, start: start};