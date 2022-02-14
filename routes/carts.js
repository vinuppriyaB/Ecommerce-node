const router=require("express").Router();
const Cart = require("../models/Cart");

const CryptoJS= require("crypto-js");
var jwt = require('jsonwebtoken');
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} =require ("./verifyToken");


// create
router.post("/",verifyToken,async(req,res)=>{
    
    const newCart = new Cart(req.body);
    try{
        const savedCart=await newCart.save();
        res.status(200).json(savedCart)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// //update
router.put("/:id",verifyToken,async(req,res)=>{
    
    try{
       const updateCart =await Cart.findByIdAndUpdate(req.params.id,
        {
           $set:req.body,
       },
       {new:true}
       );
       res.status(200).send(updateCart)
    }catch(err){
        res.status(500).send(err);
    }
    
})
// Delete
router.delete("/:id",verifyToken,async(req,res)=>{
    
    try{
       await Cart.findByIdAndDelete(req.params.id)

       res.status(200).json("product has been deleted")
    }catch(err){
        res.status(500).send(err);
    }
    
})

// Get user cart
router.get("/find/:userId",verifyTokenAndAuthorization,async(req,res)=>{
    
    try{
       const cart = await Cart.findOne({userId:req.params.userId})
       

       res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err);
    }
    
})
// get all carts
router.get("/",verifyTokenAndAdmin,async(req,res)=>{

    
    try{
        const cart = await Cart.find()
       
       res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err);
    }
    
})





module.exports = router;