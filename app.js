//jshint esversion:8

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
const dateNow = date.getDate();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://huge-orange-master:3cWvoZjQRbsVEZFqUq@cluster0.arlckwg.mongodb.net/blogwebsiteDB?retryWrites=true&w=majority');

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  dateAdded: String
});
const Post = new mongoose.model('Post', postSchema);

const userSchema = new mongoose.Schema({
  name: String,
  posts: [postSchema]
});
const User = new mongoose.model('User', userSchema);

const contentSchema = new mongoose.Schema({
  body: String,
  page: String
});
const Content = new mongoose.model('Content', contentSchema);

const content1 = new Content({
  body: 'Dolores rerum architecto laudantium ut est libero qui modi ut quia iste sed veritatis. Optio ut reiciendis eos dolorem dicta aut cupiditate veniam veritatis officia in perferendis distinctio. Et cupiditate at est minima et. Et explicabo sequi totam unde cum deserunt ea. Aperiam earum natus quia porro non voluptate. Officia ut est doloribus placeat eveniet blanditiis quia et ex. Dolores voluptas incidunt natus ut rerum doloribus.',
  page: 'home'
});
const content2 = new Content({
  body: 'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.',
  page: 'about'
});
const content3 = new Content({
  body: 'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.',
  page: 'contact'
});
const defaultContent = [content1, content2, content3];

app.get('/', (req, res) => {

  Content.findOne({
    page: 'home'
  }, (err, foundContent) => {
    if (err) {
      console.log(err);

    } else if (foundContent.length === 0) {
      Content.insertMany(defaultContent, (err) => {
        if (err) {
          console.log(err);
        }
      });

      res.redirect('/');

    } else {

      Post.find({}, (err, foundPost) => {
        if (err) {
          console.log(err);
        } else {
          res.render('home', {
            defaultContent: foundContent.body,
            posts: foundPost
          });
        }
      });

    }
  });
});

app.get('/about', (req, res) => {
  Content.findOne({
    page: 'about'
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('about', {
        defaultContent: result.body
      });
    }
  });
});

app.get('/contact', (req, res) => {
  Content.findOne({
    page: 'contact'
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('contact', {
        defaultContent: result.body
      });
    }
  });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {

  const newPost = new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
    dateAdded: dateNow
  });
  newPost.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/post/:postID', (req, res) => {
  const requestedPost = req.params.postID;

  Post.findOne({
    _id: requestedPost
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('post', {
        title: result.title,
        body: result.body,
        dateAdded: result.dateAdded
      });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.listen(port, function (req, res) {
  console.log('The server is runing on port ' + port + '.');
});