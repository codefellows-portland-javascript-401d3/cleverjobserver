'use strict';

const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
// const checkAuth = require('../auth/checkAuth')();

const Company = require('../models/company');

module.exports = router

.get('', (req,res,next) => {
  Company.find()
  .lean()
  .then ( companies => res.send(companies) )
  .catch( err => {
    console.log('error getting full company list');
    console.log(err);
    next(err);
  });
})

.get('/:id', (req,res,next) => {
  Company.findById(req.params.id)
  .lean()
  .then( company => res.send(company) )
  .catch( err => {
    console.log('error getting an company by id');
    console.log(err);
    next(err);
  });
})

.get('/byUser/:userId', (req, res, next) => {
  Company.findByUser(req.params.userId)
  .then(companies => res.send(companies))
  .catch(err => {
    console.log(err);
    next(err);
  });
})

.post('/:userId', bodyparser, (req, res, next) => {
  req.body.user = req.params.userId;
  new Company(req.body)
  .save()
  .then(company => res.send(company))
  .catch(err => {
    console.log('error creating a new contact');
    console.log(err);
    next(err);
  });
})

// .post('', bodyparser, (req,res,next) => {
//   new Company(req.body)
//   .save()
//   .then( company => res.send(company) )
//   .catch( err => {
//     console.log('error creating a new company');
//     console.log(err);
//     next(err);
//   });
// })
.delete('/:id', (req,res,next)=>{
  Company.findByIdAndRemove(req.params.id)
    .then(deleted => res.send(deleted))
    .catch( err => {
      console.log('error deleting company');
      console.log(err);
      next(err);
    });
})

.put('/:id', bodyparser, (req,res,next) => {
  Company.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then( company => res.send(company) )
  .catch( err => {
    console.log('error updating company');
    console.log(err);
    next(err);
  });
})

;