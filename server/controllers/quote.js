const Quote = require("../models/quote.js")
const Task = require("../models/task")
const UserActivity = require("../models/userActivity")
const ActviityTaskHist = require("../models/activityTaskHist")
const QuoteProduct = require("../models/quoteProduct")
const DispatchSummary = require("../models/dispatchSummary")
const Schedule = require("../models/schedule")
const TaskEmail = require("../models/taskEmail");
const DispatchProduct = require("../models/dispatchProduct");
const Document = require("../models/document");

const create = function (req, res, next) {
	let params = {
		createdBy: req.decoded.id,
		companyId: req.decoded.companyId,
		id: req.body.quote.id,
		party_name: req.body.quote.party_name,
		contact_person: req.body.quote.contact_person,
		address: req.body.quote.address,
		currency_type: req.body.quote.currency_type,
		phoneNo: req.body.quote.phoneNo,
		mobileNo: req.body.quote.mobileNo,
		products: req.body.productList
	};

	const newQuote = new Quote(params);

	try {
		if (req.body.productList.length <= 0) throw new Error('Product list can not be empty');

		if (params.id) {
			newQuote.updateQuote().then(function () {
				new QuoteProduct({}).delete(params.id).then(() => {
					new QuoteProduct({}).add(params.id, params.products, params.createdBy).then(function () {

						if (req.decoded.role === 'admin') {
							getQuoteDetailsFun(res, { id: params.createdBy, quoteId: params.id });
						} else {
							getQuoteDetailsFun(res, { id: params.createdBy, quoteId: params.id });
						}

					});
				});
			});
		} else {
			newQuote.create().then(function (result) {
				if (req.decoded.role === 'admin') {
					new Quote({}).all().then(function (quoteList) {
						new Task().all().then(function (tasks) {
							new UserActivity().insert(req.decoded.id, result.quote_id).then(function (userActivityId) {
								new ActviityTaskHist().insert(userActivityId, tasks).then(function () {
									res.send(quoteList);
								});
							});
						});
					});
				} else {
					new Quote({}).allByUserId(req.decoded.id).then(function (quoteList) {
						new Task().all().then(function (tasks) {
							new UserActivity().insert(req.decoded.id, result.quote_id).then(function (userActivityId) {
								new ActviityTaskHist().insert(userActivityId, tasks).then(function () {
									res.send(quoteList);
								});
							});
						});
					});
				}
			});
		}
	} catch (err) {
		console.log("Error: ", err);
		res.status(500).send(err);
	}
};

// Seperate code written for admin and other user.
const all = function (req, res, next) {
	try {
		const customerId = req.query.customerId;
		const userId = req.query.userId;
		const statusId = req.query.statusId;
		const from_date = req.query.from_date;
		const to_date = req.query.to_date;

		if (req.decoded.role === 'admin') {
			new Quote({}).all(customerId, userId, statusId, from_date, to_date).then(function (quoteList) {
				res.send(quoteList);
			});
		} else {
			new Quote({}).allByUserId(req.decoded.id, customerId, statusId, from_date, to_date).then(function (quoteList) {
				res.send(quoteList);
			});
		}
	} catch (err) {
		console.log("Error: ", err);
	}
}

const getQuoteDetail = function (req, res, next) {
	try {
		if (req.decoded.role === 'admin') {
			getQuoteDetailsFun(res, { id: undefined, quoteId: req.query.quoteId });
		} else {
			getQuoteDetailsFun(res, { id: req.decoded.id, quoteId: req.query.quoteId });
		}
	} catch (err) {
		console.log("Error: ", err);
	}
}

const getQuoteDetailsFun = function (res, data) {
	new Quote({}).getQuoteDetail(data.id, data.quoteId).then(function (quoteList) {
		new UserActivity({}).getUserActivityId(data.id, data.quoteId).then(function (userActivityId) {
			new ActviityTaskHist({}).getByActivityId(userActivityId).then(function (tasks) {
				new QuoteProduct({}).getByQuoteId(data.quoteId).then(function (products) {
					res.send({ quoteDetails: quoteList[0], tasks: tasks, products: products });
				})
			});
		});
	});
}

const start = function (req, res, next) {
	try {
		new Quote({}).update(req.body.quoteId, 2).then(function () {
			new ActviityTaskHist({}).update(req.body.taskHistId).then(function (userList) {
				new Quote({}).getQuoteDetail(req.decoded.id, req.body.quoteId).then(function (quoteList) {
					new UserActivity({}).getUserActivityId(req.decoded.id, req.body.quoteId).then(function (userActivityId) {
						new ActviityTaskHist({}).getByActivityId(userActivityId).then(function (tasks) {
							new QuoteProduct({}).getByQuoteId(req.body.quoteId).then(function (products) {
								res.send({ quoteDetails: quoteList[0], tasks: tasks, products: products });
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

const updateStatus = function (req, res, next) {
	try {
		const status = req.body.status;

		new Quote({}).update(req.body.quoteId, req.body.status).then(function () {

			if (Number(status) > 99) {
				new Schedule({}).stopAll(req.body.quoteId)
			}

			new Quote({}).getQuoteDetail(req.decoded.id, req.body.quoteId).then(function (quoteList) {
				new UserActivity({}).getUserActivityId(req.decoded.id, req.body.quoteId).then(function (userActivityId) {
					new ActviityTaskHist({}).getByActivityId(userActivityId).then(function (tasks) {
						new QuoteProduct({}).getByQuoteId(req.body.quoteId).then(function (products) {
							res.send({ quoteDetails: quoteList[0], tasks: tasks, products: products });
						})
					});
				});
			});
		});
	} catch (err) {
		console.log("Error: ", err);
	}
}

const updateDispatchSummary = function (req, res, next) {
	try {

		let params = {
			createdBy: req.decoded.id,
			company_id: req.decoded.companyId,
			task_id: req.body.acivityTaskId,
			customer_id: req.body.customerId,
			quote_id: req.body.quoteId,
			from: req.body.data.companyEmailId,
			to: req.body.data.to,
			cc: req.body.data.cc,
			bcc: req.body.data.bcc,
			order_no: req.body.data.order_no,
			invoice_no: req.body.data.invoice_no,
			invoice_date: req.body.data.invoice_date,
			transporter_name: req.body.data.transporter_name,
			bilty_no: req.body.data.bilty_no,
			up_to: req.body.data.up_to,
			amount: req.body.data.amount
		};

		let taskParams = {
			createdBy: req.decoded.id,
			task_id: req.body.acivityTaskId,
			subject: 'Dispatch Details of Material',
			body: req.body.body,
			quoteId: req.body.quoteId
		};

		const params1 = {
			createdBy: params.createdBy,
			scheduleId: undefined,
			task_id: params.task_id,
			company_id: req.decoded.companyId,
			subject: 'Dispatch Details of Material',
			message_body: '',
			next_reminder_date: new Date(),
			from_address: params.from,
			to_address: params.to,
			cc_address: params.cc || '',
			bcc_address: params.bcc || '',
			attachments: '',
			is_reminder: false,
			is_payment_reminder: false,
			frequency: 0,
			time: 0
		};

		const newSchedule = new Schedule(params1);

		new DispatchSummary(params).add().then((result) => {
			new DispatchProduct({}).add(result, req.body.products).then(() => {
				new TaskEmail(params).InactivateEmail(params1.task_id, req.body.nextTaskId).then(() => {
					new TaskEmail(taskParams).add().then(() => {
						newSchedule.add().then(function (result) {
							new Quote({}).getQuoteDetail(req.decoded.id, req.body.quoteId).then(function (quoteList) {
								new UserActivity({}).getUserActivityId(req.decoded.id, req.body.quoteId).then(function (userActivityId) {
									new ActviityTaskHist({}).getByActivityId(userActivityId).then(function (tasks) {
										new QuoteProduct({}).getByQuoteId(req.body.quoteId).then(function (products) {
											res.send({ quoteDetails: quoteList[0], tasks: tasks, products: products });
										});
									});
								});
							});
						});
					});
				});
			});
		});
	} catch (err) {
		console.log("Error: ", err);
	}
}

const orderConfirmation = function (req, res, next) {
	const data = JSON.parse(req.body.data)
	const imgName = req.file ? req.file.filename : '';

	let status = data.status || 5;
	const docParam = {
		createdBy: req.decoded.id,
		company_id: req.decoded.companyId,
		id: data.id,
		task_id: data.taskId,
		name: imgName,
		isActive: 1
	}

	new Document(docParam).add().then(() => {
		new ActviityTaskHist().complete(data.taskId).then(() => {
			new Quote({}).update(data.quoteId, status).then(() => {

				if (data.nextTaskid) {
					new ActviityTaskHist().update(data.nextTaskid).then(() => {
						new ActviityTaskHist({}).getByActivityId([{ id: data.userActivityId }]).then(function (tasks) {
							res.status(200).send({ tasks: tasks });
						});
					});
				} else {
					new ActviityTaskHist({}).getByActivityId([{ id: data.userActivityId }]).then(function (tasks) {
						res.status(200).send({ tasks: tasks });
					});
				}
			});
		});
	});
}

const getDispatchSummary = function (req, res, next) {
	new DispatchSummary({}).getByQuoteId(req.query.quote_id).then(function (result) {
		res.status(200).send({ dispatchSummary: result });
	});
}

const sendPaymentReminder = function (req, res, next) {
	try {
		const body = req.body;

		const taskParams = {
			createdBy: req.decoded.id,
			task_id: body.acivityTaskId,
			subject: 'Reminder to Release Outstanding Payment',
			body: body.body,
			quoteId: body.quoteId
		};

		const params1 = {
			createdBy: req.decoded.id,
			scheduleId: undefined,
			task_id: body.acivityTaskId,
			company_id: req.decoded.companyId,
			subject: 'Reminder to Release Outstanding Payment',
			message_body: '',
			next_reminder_date: new Date(),
			from_address: body.data.companyEmailId,
			to_address: body.data.to,
			cc_address: body.data.cc || '',
			bcc_address: body.data.bcc || '',
			attachments: '',
			is_reminder: false,
			is_payment_reminder: false,
			frequency: 0,
			time: 0
		};

		const newSchedule = new Schedule(params1);

		new TaskEmail(taskParams).add().then(() => {
			taskParams.task_id = body.nextActivityTaskId;
			new TaskEmail(taskParams).add().then(() => {
				newSchedule.add().then(function (result) {
					new Quote({}).getQuoteDetail(req.decoded.id, body.quoteId).then(function (quoteList) {
						new UserActivity({}).getUserActivityId(req.decoded.id, body.quoteId).then(function (userActivityId) {
							new ActviityTaskHist({}).getByActivityId(userActivityId).then(function (tasks) {
								new QuoteProduct({}).getByQuoteId(body.quoteId).then(function (products) {
									res.send({ quoteDetails: quoteList[0], tasks: tasks, products: products });
								});
							});
						});
					});
				});
			});
		});
	} catch (err) {
		console.log("Error: ", err);
	}
}

module.exports = { create: create, all: all, getQuoteDetail: getQuoteDetail, start: start, updateStatus: updateStatus, updateDispatchSummary: updateDispatchSummary, orderConfirmation: orderConfirmation, getDispatchSummary: getDispatchSummary, sendPaymentReminder: sendPaymentReminder };