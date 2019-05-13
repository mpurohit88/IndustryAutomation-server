const Reminder = require("../models/reminder")

const allReminders = function (req, res, next) {
  try {
    const from_date = req.query.from_date;
    const to_date = req.query.to_date;

    new Reminder({}).AllReminders(from_date, to_date, req.decoded.id, req.decoded.role === 'admin').then(function (reminders) {
      res.send(reminders);
    });
   
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = { allReminders: allReminders };