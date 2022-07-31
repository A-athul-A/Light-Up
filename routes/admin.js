const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
const adminHelpers = require('../helpers/admin-helpers');

/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProcucts().then((products) => {
    console.log(products);
    res.render('admin/view-products', { admin: true, products });

  })
});
router.get('/add-products', function (req, res) {
  res.render('admin/add-products', { admin: true })
})
router.post('/add-products', (req, res) => {

  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image
    console.log(id);
    image.mv('./public/images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render("admin/add-products", { admin: true})
      } else {
        console.log(err);
      }
    })
  })
})
router.get("/delete-product/:id", (req,res)=>{
  let proId=req.params.id
  console.log(proId)
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect("/admin/")
  })
})
router.get("/edit-product/:id",async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render("admin/edit-product",{product, admin:true})
})
router.post("/edit-product/:id",(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect("/admin/")
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/images/' + id + '.jpg')
    }else{
      res.redirect("/admin/")
    }
  })
})

router.get('/Login', (req, res) => {
  if (req.session.admin) {
    res.redirect('/admin')
  } else {
    res.render('admin/Login', { "loginErr": req.session.adminLoginErr })
    req.session.adminLoginErr = false
  }

})

router.post('/Login', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      
      req.session.admin = response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin')
    } else {
      req.session.adminLoginErr = "Invaild username or password"
      res.redirect('/Login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/Login')
})

module.exports = router;
