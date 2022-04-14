const express=require("express");
const router=express.Router();
const Note=require("../moduls/NoteModuls");

router.route("/create").post((req,res)=>{
    console.log("the post is send")
    const title=req.body.title;
    const content=req.body.content;
    const newNote=new Note({
        title,
        content
    });
    newNote.save();

});
router.route("/note").get((res,req)=>{
  
    Note.find()
    .then(foundNotes=>res.json(foundNotes))
})
module.exports=router;