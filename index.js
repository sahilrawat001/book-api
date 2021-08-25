
const express= require("express");
const Database= require("./database");
const ourApp=express();
//home 

ourApp.get("/", (request,response)=>{
    response.json({message:"request is being  served  "})
} );
ourApp.get("/book", (request,response)=>{
   return response.json({books:Database.Book});
} );
  


//book 



ourApp.listen(4000,()=> 
    console.log("its working")
); 