var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[

  ]
  res.render('admin/view-products',{admin:true});
});
router.get('/add-products', function(req,res){
  res.render('admin/add-products')
})
router.post('/add-products', (req,res)=> {
  console.log(req.body);
  console.log(req.files.Image);
  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/images/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-products")
       }else{
        console.log(err);
       }
    })
    


  })

})

module.exports = router;
