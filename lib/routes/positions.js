'use strict';
//routes for positions
const express = require('express');
const router = express.Router();

const bodyparser = require('../bodyparser');
// const checkAuth = require('../auth/checkAuth')();
const Position = require('../models/position');
// const ActionItem = require('../models/actionItem');
//const Company = require('../models/company');

// so eventually in your career, you'll start getting
// tired of typing these patterns over and over and 
// you'll look for abstractions you can use to encapsulate
// the repetitive parts

module.exports = router

//gets all postions
.get('', (req,res,next) => {
  Position.find()
  .lean()
  .populate('position')
  .then ( positions => res.send(positions) )
  .catch( err => {
    console.log('error getting full position list');
    console.log(err);
    next(err);
  });
})

//gets a specific position
.get('/:id', (req,res,next) => {
  Position.findById(req.params.id)
  .populate('company')
  .lean()
  .then( position => {
    res.send(position) ;
  })
  .catch( err => {
    console.log('error getting an position by id');
    console.log(err);
    next(err);
  });
})

//gets positions use applied for in the last week
.get('/byUser/:userId/weekly', (req, res, next) => {
  Position.positionsAppliedWeek(req.params.userId)
  .then(positions => res.send(positions))
  .catch(err => {
    console.log('error getting positions applied to this week');
    console.log(err);
    next(err);
  });
})

//gets all user's positions
.get('/byUser/:userId', (req, res, next) => {
  Position.findByUser(req.params.userId)
  .then(positions => res.send(positions))
  .catch(err => {
    console.log('error getting positions by userid');
    console.log(err);
    next(err);
  });
})

//adds a new position
.post('/:userId', bodyparser, (req, res, next) => {
  req.body.user = req.params.userId;
  new Position(req.body)
  .save()
  .then( position => {
    return Position.populate(position, {path: 'company'});
  })
  .then( position => res.send(position) )
  .catch( err => {
    console.log('error creating a new position');
    console.log(err);
    next(err);
  });
})

//changes a position
.put('/:id', bodyparser, (req,res,next) => {
  Position.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .populate('position')
  .then( position => res.send(position) )
  .catch( err => {
    console.log('error updating a position');
    console.log(err);
    next(err);
  });
})

//deletes a position
.delete('/:id', (req,res,next)=>{
  Position.findByIdAndRemove(req.params.id)
    .then(deleted => res.send(deleted))
    .catch( err => {
      console.log('error deleting position');
      console.log(err);
      next(err);
    });
})

;
