var db = require('../config/connection')
var collection=require('../config/collections');
var ObjectId = require('mongodb').ObjectId
const { response } = require('express');
const { PRODCUT_COLLECTION } = require('../config/collections');

module.exports={
    addProduct:(product,callback)=>{
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data);
            callback(data.insertedId)

        })

    },
    getAllProcucts:()=>{
        return new Promise(async(reslove,reject)=> {
            let products=await db.get().collection(collection.PRODCUT_COLLECTION).find({}).toArray()
            reslove(products)
        })

    },
    deleteProduct:(proId)=>{
        return new Promise((reslove,reject)=>{
            console.log(proId);
            console.log(ObjectId(proId));
            db.get().collection(collection.PRODCUT_COLLECTION).deleteOne({_id:ObjectId(proId)}).then((response)=>{
                reslove(response)
            

        })
    })
  },
  getProductDetails:(proId)=>{
    return new Promise((reslove,reject)=>{
        db.get().collection(collection.PRODCUT_COLLECTION).findOne({_id:ObjectId(proId)}).then((product)=>{
            reslove(product)
        })
    })
  },
  updateProduct:(proId,proDetails)=>{
    return new Promise((reslove,reject)=>{
        db.get().collection(collection.PRODCUT_COLLECTION)
        .updateOne({_id:ObjectId(proId)},{
            $set:{
                Name:proDetails.Name,
                Category:proDetails.Category,
                Price:proDetails.Price,
                Description:proDetails.Description,

            }
        }).then((response)=>{
            reslove()
        })
    })
  }
}