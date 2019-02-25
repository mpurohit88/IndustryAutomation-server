const Schedule = require("../models/schedule");
const ActviityTaskHist = require("../models/activityTaskHist")

const add = function (req, res, next) {
    const params = {
        createdBy: req.decoded.id,
        task_id: req.body.taskId,
        subject: 'req.body.subject',
        message_body: '',
        next_reminder_date: req.body.next_reminder_date,
        from_address: req.body.nextSchedule.companyEmailId,
        to_address: req.body.nextSchedule.to,
        frequency: req.body.nextSchedule.schedule_day,
        time: req.body.nextSchedule.schedule_time,
    };

    const newSchedule = new Schedule(params);

    try {
        newSchedule.add().then(function (result) {

            new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                res.status(200).send({ tasks: tasks });
            });

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        })
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

module.exports = { add };