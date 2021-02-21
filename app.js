const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

 const app =express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Admin_deepshikha:shikha123@cluster0.oaxax.mongodb.net/todolistDB" , {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your To-Do List!"
});

const item2 = new Item({
    name: "Hit '+' to add a new item."
});

const item3 = new Item({
    name: "<-- Select this to delete item."
});

const defaultItems =[item1, item2, item3];


app.get("/", function(req, res){
    
 

    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log("Items added successfully.");
                }
            });
            res.redirect("/");
        }
        else
        {
            res.render("list", {
                kindofday: "Today" , newlistitem: foundItems
            });
        }

       
    });

      

    app.post("/", function(req,res){
        
        const itemName = req.body.newitem;

        const item = new Item({
            name: itemName
        });

        item.save();

        res.redirect("/");
    });

    app.post("/delete", function(req,res){

        const checkedItemId = req.body.checkbox;

        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err)
            {
                console.log("Removal Successful!");
                res.redirect("/");
            }
        });

    });

});

 app.listen(3000, function(){
     console.log("server is running");
 });
