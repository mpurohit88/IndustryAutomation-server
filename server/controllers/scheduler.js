const Schedule = require("../models/schedule");
const ActviityTaskHist = require("../models/activityTaskHist")

const add = function (req, res, next) {
    const params = {
        createdBy: req.decoded.id,
        scheduleId: req.body.nextSchedule.scheduleId,
        task_id: req.body.taskId,
        company_id: req.decoded.companyId,
        subject: req.body.nextSchedule.subject,
        message_body: '',
        next_reminder_date: req.body.next_reminder_date,
        from_address: req.body.nextSchedule.companyEmailId,
        to_address: req.body.nextSchedule.to,
        frequency: req.body.nextSchedule.schedule_day,
        time: req.body.nextSchedule.schedule_time
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
                new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                    res.status(200).send({ tasks: tasks });
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

module.exports = { add, getScheduleDetails };