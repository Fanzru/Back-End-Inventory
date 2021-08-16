const router = require('express').Router();
const ITEMS   = require('../models/Item');
const {response} = require('../controllers/response')
// Get all Data
const error = null
router.get('/',async (req,res)=>{
    try {
        const items = await ITEMS.find();
        response(res,true,items,'Get All Items Succes',200)
    } catch{
        response(res,false,error,'Item Not Found',400)
    }
})
// Input New item
router.post('/inputnewItem',async (req,res)=>{
    let kode = "BRG-"
    let itemCode = kode + 0
    var lastDoc = await ITEMS.find().sort({_id: -1}).limit(1);
    
    if (ITEMS != null){
        var code = (lastDoc[0].itemCode).split("-")
        var noid = parseInt(code[1]) + 1
        itemCode = kode +  noid
    }

    const itemExist = await ITEMS.findOne({itemName: req.body.itemName});
    if (itemExist) return response(res,false,lastDoc,'Item Already Exist',400)

    const newItem = new ITEMS({
        categoryId: req.body.categoryId,
        itemName: req.body.itemName,
        itemCode: itemCode,
        itemAmount: req.body.itemAmount,
        itemInBorrow: 0,
    })
    

    try{
        const savedItem = await newItem.save();
        response(res,true,savedItem,'Input Item Succes',200)
    } catch {
        response(res,false,error,'Input Item Failed',400)
    }
    
})
// get item using id item
router.get('/findItem/:itemid',async (req,res)=>{
    try {
        const Item = await ITEMS.findOne({_id: req.params.itemid});
        if (Item != null) return response(res,true,Item,'Search Data Succes',200)
    } catch {
        response(res,false,Item,`${req.params.itemid} Not Found`,400)
    }
})
// rename item using item id
router.patch('/renameItem/:itemid',async (req,res)=>{
    try {
        const updateItem = await ITEMS.updateOne(
            {_id: req.params.itemid}, 
            {$set:{itemName: req.body.itemName}
        });
        response(res,true,updateItem,'Update Success',200)
    } catch {
        response(res,false,error,`${req.params.itemid} Not Found`,400)
    }
})
// delete item using item id
router.delete('/deleteItem/:itemid', async (req,res)=>{
    try{
        const deleteItem = await ITEMS.remove({_id: req.params.itemid});
        response(res,true,deleteItem,'delete item success',200)
    } catch{
        response(res,false,error,'delete item failed',400)
    }
})

router.patch('/minItem/:itemid/:amountitem', async (req,res)=> {
    try{
        const item = await ITEMS.findOne({_id: req.params.itemid});
        if ( (item!= null) &&  (item.itemAmount >= req.params.amountitem) && ((parseInt(item.itemInBorrow) - parseInt(req.params.amountitem)) >= 0)){
            item.itemAmount   += parseInt(req.params.amountitem)
            item.itemInBorrow -= parseInt(req.params.amountitem)
            const savedItem = await item.save();
            response(res,true,savedItem,'Return Item Succes',200)
        } else if (item!= null){
            response(res,false,savedItem,'item not enough',400)
        }
    } catch {
        response(res,false,error,'item not found',400)
    }
})

router.patch('/addItem/:itemid/:amountitem', async (req,res)=> {
    try{
        const item = await ITEMS.findOne({_id: req.params.itemid});
        if ( (item!= null) &&  (item.itemAmount >= req.params.amountitem) && ((parseInt(item.itemInBorrow) - parseInt(req.params.amountitem)) >= 0)){
            item.itemAmount   -= parseInt(req.params.amountitem)
            item.itemInBorrow += parseInt(req.params.amountitem)
            const savedItem = await item.save();
            response(res,true,savedItem,'Return Item Succes',200)
        } else if (item!= null){
            response(res,false,error,'item not enough',400)
        }
    } catch {
        response(res,false,error,'item not found',400)
    }
})

router.patch('/updateItem/:itemid', async (req,res)=> {
    try {
        const item = await ITEMS.findOne({_id: req.params.itemid});
    } catch {
        response(res,false,error,'item not found',400)
    }
})
module.exports = router;
