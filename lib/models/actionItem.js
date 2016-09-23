const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const ActionItem = new Schema({
  dateAdded: Date,
  dateDue: Date,
  action: String,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

ActionItem.statics.findByUser = function (userId) {
  return this.find({
    user: userId,
    completed: false
  })
  .populate('company')
  .populate('position')
  .sort({createdAt: -1})
  .then(actionItems => {
    // Not having any actionItems doesn't seem like a server error to me
    if (!actionItems) throw {status: 400, message: 'You have no action items at this time.'};
    return actionItems;
  });
};

// the "id" is required, "which" is a modifier
// so I would have ordered the parameters:
// function (id, which) {
ActionItem.statics.findByPosOrComp = function (which, id) {
  // don't repeat common code across conditional branches 
  const query = which === 'position' ? {position: id} :{company: id};

  return this.find(query)
  .sort({createdAt: -1})
  .populate('company')
  .populate('position')
  .then(actionItems => {
    if (!actionItems) throw {status: 400, message: `You have no action items for that ${which}.`};
    return actionItems;
  });
};

function getDueActions(user, dateDue) {
  return ActionItem.find({
    user,
    dateDue
  }).sort({dateDue: 1})
  .populate('company')
  .populate('position');
}

ActionItem.statics.getOverdueAndDue = function (userId) {
  const dueTime = moment().endOf('day').add(3, 'days');
  const today = moment().endOf('day');
  return Promise.all([
    getDueActions( userId, {
      $lt: today.toDate()
    }),
    getDueActions(userId, {
      $gte: today.toDate(),
      $lt: dueTime.toDate()
    })])
    .then(([overDue, almostDue]) => {
      if (!overDue && !almostDue) throw {status: 400, message: 'You have no overdue or due action items.'};

      return {overDue, almostDue};
    });
};

ActionItem.statics.getRecent = function () {};

module.exports = mongoose.model('ActionItem', ActionItem);
