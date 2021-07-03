//////      Node And Express      //////


/*

------------ Node Intro -------------

const http = require("http");
http.createServer((request, response) => {
    console.log(request.headers);
    response.end("Hello Client!!")}).listen(5000)



------------- EXPRESS Introduction  ----------

const { request, response } = require("express");
const express  = require("express");
const app = express();

app.use(express.json());
app.get("/:userid", (req, resp) =>
{
    const users = [
    {
        id: 1,
        name: "Sandy",
    },
    {
        id: 2,
        name: "Sandeep",
    },
];
    const userID = req.params.userid;
    console.log(userID);
    const getUser = users.filter((user) => user.id === parseInt(userID));

    if(getUser.length === 0){
        return resp.json({ error: "No user found!!!"})
    }

    return resp.json({ user: getUser[0] });
});

app.listen(3000, () => console.log("server is running"));

*/




/////-------- BOOK API PROJECT ---------/////

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose")

// Database
const database = require("./database/index");


// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Establishing MongoDB connection
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("Connection established!!!"))

// Initializing express
const app = express();

// Configuration
app.use(express.json());



// Get API


/*
Route:          /
Description:    to get all books
Access:         Public
Parameters:     None
*/

app.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json({ books: getAllBooks})
});

// app.get("/", (req, res) => {
//     return res.json({books: database.books});
// });



/*
Route:          /
Description:    to get specific book
Access:         Public
Parameters:     isbn
*/

app.get("/is/:isbn", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ 
    ISBN: req.params.isbn 
    });
    

    if(!getSpecificBook){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBook });
});


// app.get("/is/:isbn", (req,res) => {
//     const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

//     if(getSpecificBook.length === 0){
//         return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
//     }

//     return res.json({book: getSpecificBook });
// });



/*
Route:          /c
Description:    to get specific books based on category
Access:         Public
Parameters:     category
*/

app.get("/c/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.findOne({
        category : req.params.category
    })

    if(!getSpecificBooks){
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }

    return res.json({book: getSpecificBooks });
});


// app.get("/c/:category", (req, res) => {
//     const getSpecificBooks = database.books.filter((book) => book.category.includes(req.params.category));

//     if(getSpecificBooks.length === 0){
//         return res.json({error: `No book found for the category of ${req.params.category}`});
//     }

//     return res.json({book: getSpecificBooks });
// });



/*
Route:          /authors
Description:    to get specific books based on author
Access:         Public
Parameters:     author
*/
app.get("/authors/:author", (req, res) => {
    const getSpecificBooks = database.books.filter((book) =>  book.authors.includes(parseInt(req.params.author))
    );
    // console.log(getSpecificBooks);
    if(getSpecificBooks.length === 0){
        return res.json({error: `No book found for the author of ${req.params.author}`});
    }

    return res.json({book: getSpecificBooks });
});



/*
Route:          /authors
Description:    to get the list of all authors
Access:         Public
Parameters:     None
*/

app.get("/authors", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({authors: getAllAuthors});
});

// app.get("/authors", (req, res) => {
//     return res.json({authors: database.authors});
// });



/*
Route:          /authors
Description:    to get the list of all authors based on books's isbn
Access:         Public
Parameters:     isbn
*/
app.get("/authors/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter((author) => author.books.includes(req.params.isbn));

    if(getSpecificAuthors.length === 0){
        return res.json({error: `No author found for the book of ${req.params.isbn}`});
    }

    return res.json({ authors: getSpecificAuthors });
});





// Post API


/*
Route:          /book/new
Description:    add new books
Access:         Public
Parameters:     None
*/

app.post("/book/new", async (req, res) => {
    const {newBook} = req.body;
    BookModel.create(newBook);

    return res.json({books: newBook, message: "book was added!"});
});

// app.post("/book/new", (req, res) => {
//     const {newBook} = req.body;
//     database.books.push(newBook);
//     return res.json({books: database.books, message: "book was added!"})
// });



/*
Route:          /author/new
Description:    add new author
Access:         Public
Parameters:     None
*/

app.post("/author/new", async (req, res) => {
    const { newAuthor } = req.body;
    AuthorModel.create(newAuthor);

    return res.json({ message: "Author was added!"});
});

// app.post("/author/new", (req, res) => {
//     const { newAuthor } = req.body;
//     database.authors.push(newAuthor);
//     return res.json({authors: database.authors, message: "Author was added!"});
// });




// Put API



/*
Route:          /book/title/update/
Description:    update title of a book
Access:         Public
Parameters:     isbn
*/

app.patch("/book/title/update/:isbn", async (req, res) => {

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: req.body.bookTitle, 
        },
        {
            new: true,
        }
);

    return res.json({ books: updatedBook });
});

// app.put("/book/update/:isbn", (req, res) => {
//     database.book.forEach((book) =>{
//         if(book.ISBN === req.params.isbn) {
//             book.title = req.body.bookTitle;
//             return;
//         }
//     });

//     return res.json({ books: database.books});
// });



/*
Route:          /book/author/update
Description:    update/add new author
Access:         Public
Parameters:     isbn
*/

app.put("/book/author/update/:isbn", async (req, res) => {

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $addToSet: {
                authors: req.body.newAuthor,
            },
        },
        {
            new: true,
        }
);

    const updatedAuthor =  await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor,
        },
        {
            $addToSet: {
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
);
    return res.json({ books: updatedBook, 
        authors: updatedAuthor, message:"New author added"});
});



// Delete API

/*
Route:          /book/delete
Description:    delete a book
Access:         Public
Parameters:     isbn
*/

app.delete("/book/delete/:isbn", async (req, res) => {
    const deletedBook = await BookModel.findOneAndDelete({
        ISBN : req.params.isbn,
    });
    return res.json({ books: deletedBook , message: "Book deleted from the database"});
});



/*
Route:          /book/delete/author
Description:    delete an author from a book
Access:         Public
Parameters:     isbn,author id
*/

app.delete("/book/delete/author/:isbn/:authorId", async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN : req.params.isbn,
    },
    {
        $pull: {
            authors: parseInt(req.params.authorId),
        }
    },
    {
        new: true,
    });

    const updatedAuthor =  await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId),
        },
        {
            $pull: {
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
);

    return res.json({ books: updatedBook ,
        author: updatedAuthor, message: "Author deleted for the required book"});
});

app.listen(3000, () => console.log("server is running"));






