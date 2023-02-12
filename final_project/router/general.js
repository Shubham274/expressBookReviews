const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
};

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
        users.push({ username: username, password: password });
        return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
        return res.status(404).json({ message: "User already exists!" });
    }
}
return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const booksArray = Object.values(books);
  
  for(var i=0;i<=booksArray.length;i++){
      if(booksArray[i].author==req.params.author){
        return res.send(booksArray[i]);
      }
      }
 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const booksArray = Object.values(books);
  
  for(var i=0;i<=booksArray.length;i++){
      if(booksArray[i].title==req.params.title){
        return res.send(booksArray[i]);
      }
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  res.send(books[isbn]);
});


public_users.get('/', (req, res) => {
    axios.get('http://localhost:5000/books')
      .then((response) => {
        res.send(response.data);
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Error retrieving books",
          error: err
        });
      });
  });


  public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.send(response.data);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });

 

  public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.send(response.data);
      } catch (err) {
        console.log(err);
        res.send(err);
      }
  });

  public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.send(response.data);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });

module.exports.general = public_users;
