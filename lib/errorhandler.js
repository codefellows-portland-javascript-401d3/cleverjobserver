
module.exports = function(err,req,res,next) { // eslint-disable-line
  if (err) {
    console.log('Error in route request:', err);
    res.status(err.status || 400);
    res.json(err);
  }
};
