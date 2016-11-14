var express = require("express");
var router = express.Router();

router.use(function(req, res, next){
  if(req.method === "GET"){
    // continue to the next middleware or request handler
    return next();
  }

  if(!req.isAuthenticated()){
    // user not authenticated, redircat to login page
    res.redirect('#login');
  }

  // user authenticated
  return next();
});
router.route('/posts')
  .get(function(req, res){

    //temporary solution
    res.send({message: "TODO return all posts"});
  })

  .post(function(req, res){

    //temporary solution
    res.send({message: 'TODO create a new post'});
  });

router.route('/posts/:id')
  //return a particular post
  .get(function(req, res){
    res.send({message: 'TODO return post with ID ' + req.params.id})
  })

  //update existing post
  .put(function(req, res){
    res.send({message: 'TODO modify post with ID ' + req.params.id})
  })

  //delete existing post
  .delete(function(req, res){
    res.send({message: 'TODO delete post with ID ' + req.params.id})
  })

module.exports = router;
