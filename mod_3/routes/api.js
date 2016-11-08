var express = require("express");
var router = express.Router();

router.route('/posts')
  .get(function(req, res){

    //temporary solution
    res.send({message: "TODO return all posts"});
  })

  .post(function(req, res){

    //temporary solution
    res.send({message: 'TODO create a new post'});
  });

module.exports = router;
