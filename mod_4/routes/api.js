var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');

// check for GET or authentification
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

    Post.find(function(err, data){
      if(err){
        res.send(500, err);
      }
      res.send(data);
    });
  })

  .post(function(req, res){

    var post = new Post();
    post.text = req.body.text;
    post.username = req.body.created_by;
    post.save(function(err, post){
      if (err){
        return res.send(500, err);
      }
      return res.json(post);
    });
  });

router.route('/posts/:id')
  //return a particular post
  .get(function(req, res){
    Post.findById(req.params.id, function(err, post){
      if(err){
        res.send(err);
      }
      res.json(post);
    })
  })

  //update existing post
  .put(function(req, res){
    Post.findById(req.params.id, function(err, post){
      if(err){
        res.send(err);
      }
      post.username = req.body.created_by;
      post.text = req.body.text;

      post.save(function(err, post){
        if(err){
          res.send(err);
        }
        res.json(post);
      });
    });
  })

  //delete existing post
  .delete(function(req, res){
    Post.remove({_id: req.params.id}, function(err){
      if(err){
        res.send(err);
      }
      res.json("deleted :(");
    });
  });

module.exports = router;
