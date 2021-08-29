require("dotenv").config();
// const { json } = require("express");
const express = require("express");

const mongoose= require("mongoose"); 
var bodyParser = require("body-parser");
const Database = require("./database");

 mongoose.connect(process.env.MongO_URL,
  {
  
    useNewUrlParser: true,
   // useUnifiedTopology: true,
   // useFindAndModify: false,
   // useCreateIndex: true,  

  }).then(()=> console.log("connection established") ).catch( (err)=>{
    console.log(err)
  }
   );
const ourAPP = express();
ourAPP.use(express.json());
//home

ourAPP.get("/", (request, response) => {
  response.json({ message: "request is  being  served.. " });
});

//book
// Route    - /book
// Des      - to get a books
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none

ourAPP.get("/book", (request, response) => {
  return response.json({ books: Database.Book });
});

//get secific book
// Route    - /book/bookid
// Des      - to get  secific book
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
ourAPP.get("/book/:bookid", (request, response) => {
  const getbook = Database.Book.filter(
    (book) => book.ISBN === request.params.bookid
  );
  if (getbook.length === 0) {
    return response.json({
      error: `no book is  founded at ${request.params.bookid} ...`,
    });
  } else {
    return response.json({ book: getbook });
  }
});

//get book from category
//category contains array
// Route    - /book/c/category
// Des      - to get book from category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
ourAPP.get("/book/c/:category", (request, response) => {
  const getbook = Database.Book.filter((book) =>
    book.category.includes(request.params.category)
  );

  if (getbook.length === 0) {
    return response.json({
      error: `no book is found at ${request.params.category} ...`,
    });
  } else {
    return response.json({ book: getbook });
  }
});

//get book from author
//authors also contain array
// Route    - /book/a/authors
// Des      - to get  book from author
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
ourAPP.get("/book/a/:authorid", (request, response) => {
  //  authors=parseInt(authors);
  const getbook = Database.Book.filter((book) =>
    book.authors.includes(parseInt(request.params.authorid))
  );
  //currently in string and change to int
  if (getbook.length === 0) {
    return response.json({
      error: `no book is found at ${request.params.authorid} ...`,
    });
  } else {
    return response.json({ book: getbook });
  }
});

// route- authors
//method-get
// Route    - /author
// Des      - to get authors
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
ourAPP.get("/author", (request, response) => {
  return response.json({ authors: Database.Author });
});

// Route    - /author/authorid
// Des      - to get a list of authors
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
ourAPP.get("/author/:authorid", (request, response) => {
  const getauthor = Database.Author.filter(
    (author) => author.id === parseInt(request.params.authorid) //change to int form
  );
  if (getauthor.length === 0) {
    return response.json({
      error: `...no book is  founds at ${request.params.authorid} ...`,
    });
  } else {
    return response.json({ author: getauthor });
  }
});

// Route    - /author/b/bookid
// Des      - to get a list of authors based on books
// Access   - Public
// Method   - GET
// Params   - bookid
// Body     - none
ourAPP.get("/author/b/:bookid", (req, res) => {
  const getauthor = Database.Author.filter((author) =>
    author.books.includes(req.params.bookid)
  );
  if (getauthor.length === 0) {
    return res.json({ error: `no ${req.params.bookid} is  present.` });
  } else {
    return res.json({ books: getauthor });
  }
});

// Route    - /publications
// Des      - to get all publications
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
ourAPP.get("/publications", (req, res) => {
  return res.json({ publications: Database.Publication });
});

// Route    - /publications/:id
// Des      - to get all publications
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

ourAPP.get("/publications/:publicid", (req, res) => {
  const getpublic = Database.Publication.filter(
    (publications) => publications.id === parseInt(req.params.publicid)
  );
  if (getpublic.length === 0) {
    return res.json({
      error: `no book is  founded at ${req.params.publicid} ...`,
    });
  } else {
    return res.json({ publications: getpublic });
  }
});
// Route    - /publications/b/bookid
// Des      - to get a list of authors based on books
// Access   - Public
// Method   - GET
// Params   - bookid
// Body     - none
ourAPP.get("/publications/b/:bookid", (req, res) => {
  const getPublication = Database.Publication.filter((publication) =>
    publication.books.includes(req.params.bookid)
  );
  if (getPublication.length === 0) {
    return res.json({ error: `no ${req.params.bookid} is  present.` });
  } else {
    return res.json({ publications: getPublication });
  }
});

// Route    - /book/new
// Des      - add new book
// Access   - Public
// Method   - post
// Params   - none
// Body     - none
ourAPP.post("/book/new", (req, res) => {
  const { newBook } = req.body;
  Database.Book.push(newBook);
  return res.json({ message: "books added" });
});
// Route    - /author/new
// Des      - add new author
// Access   - Public
// Method   - post
// Params   - none
// Body     - none
ourAPP.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  Database.Author.push(newAuthor);
  return res.json({ message: "authors added" });
});

// Route    - /publications/new
// Des      - add new publications
// Access   - Public
// Method   - post
// Params   - none
// Body     - none
ourAPP.post("/publications/new", (req, res) => {
  const { newPublication } = req.body; //{}it is used for estructuring .
  //while useing post same name should be used as we mention in {}
  Database.Publication.push(newPublication);
  return res.json(Database.Publication);
});
//update from book id
// route -/book/update/:isbn
// method-put
ourAPP.put("/book/update/:isbn", (req, res) => {
  const { updateBook } = req.body;
  const { isbn } = req.params;

  const book = Database.Book.map((book) => {
    if (book.ISBN === isbn) {
      return { ...book, ...updateBook };
    }
    return book;
  });
  return res.json(book);
});
// author update here

ourAPP.put("/author/update/:id", (req, res) => {
    const { updateAuthor } = req.body;
    const { id } = req.params;
  
    const author= Database.Author.map((author)=> {
      if (author.id === parseInt(id)) {
        return { ...author, ...updateAuthor };
      }
      return author;
    });
    return res.json(author);
  });
// route: /bookauthor/update/:isbn
// update author in books
// method : put
ourAPP.put("/book/updateAuthor/:isbn", (req, res) => {
        const { newAuthor } = req.body;
        const { isbn } = req.params;
        Database.Book.forEach((book) => {
            // check if ISBN match
            if (book.ISBN === isbn) {
                // check if author already exist
                if (!book.authors.includes(newAuthor)) {
                    book.authors.push(newAuthor);
                    return book;}
              return book; 
  }else{

            return book;
  }
        });
        Database.Author.forEach((author) => {
            if (author.id === newAuthor) {
                if (!author.books.includes(isbn)) {
                    author.books.push(isbn);
                    return author ;  }                   
                 return author;   
          }
  else{

           return author;
  }
        });
        return res.json({ book: Database.Book, author: Database.Author });    
    });

// route: /author/updateName/:id
// update author name 
// method : put

ourAPP.put("/author/updatauthoreName/:id",(req,res)=>{  
const {updateAuthor}=req.body;
const {id}=req.params;
Database.Author.forEach( (author)=>{
  if(author.id===parseInt( id) ){
    author.name=updateAuthor.name;
    return author;
  }
  return author;
});
return res.json(Database.Author);

} );


// update publication
// method:put
ourAPP.put("publications/update/book/:isbn", (req, res) => {
        const { pubId } = req.body;
  Database.Publication.forEach((pub) => {
    if (pub.id ==pubId) {
      pub.books.push(req.params.isbn);

      return pub;
    }
    return pub;
  });

  Database.Book.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication.push(pubId);
      return book;
    }
    console.log(book);
    return book;
  });
  return res.json({
    books: Database.Book,
    publications: Database.Publication,
    message: "succesfull",
  });
});

// Route    - /book/delete/:isbn
// Des      - delete a book
// Access   - Public
// Method   - delete
// Params   - none
// Body     - none

ourAPP.delete("/book/delete/:isbn",(req,res)=>{
const {isbn}=req.params;
const filteredBook=Database.Book.filter( (book)=>book.ISBN !== isbn)
Database.Book=filteredBook;
return res.json(Database.Book);
} );




// Route    - /book/delete/author/:isbn/id
// Des      - delete a author from book
// Access   - Public
// Method   - delete
// Params   - none
// Body     - none

ourAPP.delete("/book/delete/author/:isbn/:id",(req,res)=>{
  const {isbn}=req.params;
   const { id}=req.params;
 Database.Book.forEach( (book)=>{
   if( book.ISBN===isbn){
     if(!book.authors.includes(parseInt(id))){
       return book;
     }
     book.authors=book.authors.filter((databaseId)=>databaseId !==parseInt(req.params.id)  );
     return book;
   }
   return book;
 });
 Database.Author.forEach( (author)=>{
   if(author.id===parseInt(id)){
    if(!author.books.includes(isbn)){
      return;
    }
   author.books=author.books.filter((book)=>book !==isbn );
   return   author;
   }
   return author;
 } );
  
  return res.json({book: Database.Book, author: Database.Author});
  } );




  
 // Route    - /publications/delete/:id
// Des      - delete a publication 
// Access   - Public
// Method   - delete
// Params   - none
// Body     - none


ourAPP.delete("/publications/delete/:id",(req,res)=>{
  const {id}=req.params;
 /* const filterPub=Database.Publication.filter( (pub)=>pub.id !==parseInt(id))
  Database.Publication=filterPub;  ---> 1st method*/
  Database.Publication=Database.Publication.filter( (pub)=>pub.id !==parseInt(id))
  return res.json( Database.Publication);
}  );




// Route    - /publications/delete/book
// Des      - delete a publication from book
// Access   - Public
// Method   - delete
// Params   - nid,isbn
// Body     - none


/*
ourAPP.delete("/publication/delete/book/:isbn/:id", (req, res) => {
  const { isbn, id } = req.params;
  Database.Book.forEach((book) => {
      if (book.ISBN === isbn) {
          book.publication = 0;
          return book; }
      return book;
  });

  Database.Publication.forEach((publication) => {
      if (publication.id === parseInt(id)) {
          const filteredBooks = publication.books.filter(
              (book) => book !== isbn
          );
          publication.books = filteredBooks;
          return publication;
      }
      return publication;  
  });
  return res.json({ book: Database.Book, publication: Database.Publication });
});
*/

//2nd
//error somewhere
ourAPP.delete("/publications/book/delete/:id/:isbn ", (req,res)=>{
  const{ isbn,id }=req.params;
 /*
Database.Book.forEach((book)=>{
  if(book.ISBN===isbn){
    book.publication=0;
    return book;
  }
  return book;
});*/
Database.Book.forEach((book) => {
  if (book.ISBN === isbn) {
      book.publication = 0;
      return book;
  }
  return book;
});


/*
  Database.Publication.forEach((publication)=>{
    if(publication.id=== parseInt( id)){
    const filteredBook= publication.books.filter(
       (book) => book !== isbn);
    publication.books=filteredBook;
    return publication;
  }
  return publication;
  } );*/

  Database.Publication.forEach((publication) => {
    if (publication.id === parseInt(id)) {
        const filteredBooks = publication.books.filter(
            (book) => book !== isbn
        );
        publication.books = filteredBooks;
        return publication;
    }
    return publication;
});

return res.json({ book: Database.Book, publication: Database.Publication });


  //return res.json( {book:Database.Book, publication:Database.Publication});
  } );


ourAPP.listen(4000, () => console.log("it  is working"));
