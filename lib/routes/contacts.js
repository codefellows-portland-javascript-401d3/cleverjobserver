'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');

const Contact = require('../models/contact');
// const User = require('../models/user');

module.exports = router

.get('', (req,res,next) => {
  Contact.find()
  .populate('company')
  .lean()
  .then (contacts => res.send(contacts))
  .catch( err => {
    console.log('error getting full contact list');
    console.log(err);
    next(err);
  });
})

.get('/:id', (req,res,next) => {
  Contact.findById(req.params.id)
  .populate('company')
  .lean()
  .then(contact => res.send(contact))
  .catch( err => {
    console.log('error getting an contact by id');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId/byCompany/:companyId', (req, res, next) => {
  Contact.find({
    user: req.params.userId,
    company: req.params.companyId
  })
  .then(contacts => {
    res.send(contacts);
  })
  .catch(err => {
    console.log('error getting an contact by userid and companyid');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId/weekly', (req, res, next) => {
  Contact.contactsMadeWeek(req.params.userId)
  .then(contacts => res.send(contacts))
  .catch(err => {
    console.log('error getting weekly contacts count');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId', (req, res, next) => {
  Contact.findByUser(req.params.userId)
  .then(contacts => res.send(contacts))
  .catch(err => {
    console.log('error getting contacts by userid');
    console.log(err);
    next(err);
  });
})

.post('/:userId', bodyparser, (req, res, next) => {
  req.body.user = req.params.userId;
  new Contact(req.body)
  .save()
  .then( contact => {
    return Contact.populate(contact, {path: 'company'});
  })
  .then(contact => res.send(contact))
  .catch( err => {
    console.log('error creating a new contact');
    console.log(err);
    next(err);
  });
})

.put('/:id', bodyparser, (req,res,next) => {
  Contact.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then( contact => {
    return Contact.populate(contact, {path: 'company'});
  })
  .then( contact => res.send(contact) )
  .catch( err => {
    console.log('error updating a contact');
    console.log(err);
    next(err);
  });
})

.delete('/:id', (req,res,next) => {
  Contact.findByIdAndRemove(req.params.id)
  .then(message => res.send(message))
  .catch(err => {
    console.log('error deleting contact');
    console.log(err);
    next(err);
  });
});
