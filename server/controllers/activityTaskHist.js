const ActviityTaskHist = require("../models/activityTaskHist");

const done = function (req, res, next) {
    new ActviityTaskHist().complete(req.body.taskId).then(() => {
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
};

module.exports = { done: done };