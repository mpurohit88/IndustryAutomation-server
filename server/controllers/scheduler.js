const Schedule = require("../models/schedule");
const ActviityTaskHist = require("../models/activityTaskHist");
const Quote = require("../models/quote")

const add = function (req, res, next) {

    const params = {
        createdBy: req.decoded.id,
        scheduleId: req.body.nextSchedule.scheduleId,
        task_id: req.body.taskId,
        company_id: req.decoded.companyId,
        subject: req.body.nextSchedule.subject,
        message_body: '',
        next_reminder_date: req.body.nextSchedule.schedule_day,
        from_address: req.body.nextSchedule.companyEmailId,
        to_address: req.body.nextSchedule.to,
        cc_address: req.body.nextSchedule.cc || '',
        bcc_address: req.body.nextSchedule.bcc || '',
        frequency: req.body.nextSchedule.schedule_time,
        time: req.body.nextSchedule.schedule_time,
        is_reminder: true
    };

    const newSchedule = new Schedule(params);

    try {
        if (params.scheduleId) {
            newSchedule.update().then(function (result) {
                new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                    res.status(200).send({ tasks: tasks });
                });
            });
        } else {
            newSchedule.add().then(function (result) {
                new Quote({}).update(req.body.quoteId, 4).then(() => {
                    new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                        res.status(200).send({ tasks: tasks });
                    });
                });
            });
        }
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

const getScheduleDetails = function (req, res, next) {
    try {
        new Schedule({}).getScheduleDetails(req.query.scheduleId).then(function (result) {
            res.status(200).send({ schedule: result });
        })
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

const done = function (req, res, next) {
    let status = req.body.status || 5;

    new Schedule({}).stop(req.body.scheduleId).then(function (result) {
        new ActviityTaskHist().complete(req.body.taskId).then(() => {
            new Quote({}).update(req.body.quoteId, status).then(() => {
                if (req.body.nextTaskId) {
                    new ActviityTaskHist().update(req.body.nextTaskId).then(() => {
                        new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                            res.status(200).send({ tasks: tasks });
                        });
                    });
                } else {
                    new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                        res.status(200).send({ tasks: tasks });
                    });
                }
            });
        });
    });
};

module.exports = { add, getScheduleDetails, done };