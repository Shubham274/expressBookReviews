const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}
const doesReviewExist = (isbn) => {
    if (books[isbn]) {
        if (Object.keys(books[isbn].reviews).length === 0) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    console.log("login", username, password)
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
    //Write your code here
    let review = req.body.review;
    let isbn = req.params.isbn;
    let user = req.body.username;
    let existing_review = doesReviewExist(isbn);
    if (!existing_review) {
        books[isbn].reviews = {
            "user": user,
            "review": review
        }
        return res.send(`this is the first review -  ${JSON.stringify(books[isbn].reviews)}`);
    } else {
        if (existing_review.user === user) {
            books[isbn].reviews[user] = {
                "review": review
            }
            return res.send(`you have updated your review -  ${JSON.stringify(books[isbn].reviews)}`);
        } else {
            books[isbn].reviews[user] = {
                "review": review
            }
            return res.send(`there is a review  ${JSON.stringify(books[isbn].reviews)}`);
        }
    }
});

regd_users.delete("/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    books = books.filter((book) => book.isbn != isbn);
    res.send(`book with the isbn  ${isbn} deleted.`);
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


