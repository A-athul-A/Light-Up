const { response } = require('express');
var express = require('express');
const session = require('express-session');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');


const verifyLogin = (req, res, next) => {
  if (req.session.user.loggedIn) {
    next()
  } else {
    res.redirect('/Login')
  }
}
 
/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  console.log(user);
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }

  productHelpers.getAllProcucts().then((products) => {

    res.render('user/view-products', { products, user, cartCount });

  })
});
router.get('/Login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/Login', { "loginErr": req.session.userLoginErr })
    req.session.userLoginErr = false
  }

})
router.get('/Signup', (req, res) => {
  res.render('user/Signup')
})
router.post('/Signup', (req, res) => {
  userHelpers.DoSignup(req.body).then((response) => {
    console.log(response);
    
    req.session.user = response
    req.session.user.loggedIn = true
    res.redirect("/")
  })

})
router.post('/Login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      
      req.session.user = response.user
      req.session.user.loggedIn = true
      res.redirect('/')
    } else {
      req.session.userLoginErr = "Invaild username or password"
      res.redirect('/Login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.user=null
  req.session.user.loggedIn=false
  res.redirect('/')
})
router.get('/cart', verifyLogin, async (req, res) => {
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let totalValue = 0
  if (products.length > 0) {
    totalValue = await userHelpers.getTotalAmount(req.session.user._id)
  }


  console.log(products);
  res.render('user/cart', { products, user: req.session.user, totalValue })
})
router.get("/add-to-cart/:id", verifyLogin, (req, res) => {
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true })
  })
})
router.post("/change-product-quantity", (req, res, next) => {

  userHelpers.changeProductQuantity(req.body).then((response) => {
    res.json(response)

  })
})
router.get('/place-order', verifyLogin, async (req, res) => {
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order', { total, user: req.session.user })
})
router.post('/place-order', async (req, res) => {
  let products = await userHelpers.getCartProductsList(req.body.userId)
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.plceOrder(req.body, products, totalPrice).then((orderId) => {
    if (req.body['payment-method'] === 'COD') {
      res.json({ codSuccess: true })
    } else {
      userHelpers.generateRazrorpay(orderId, totalPrice).then((response) => {
        res.json(response)
      })
    }
    //res.json({status:true})
  })
  console.log(req.body);
})
router.get('/order-success', verifyLogin, (req, res) => {
  res.render('user/order-success', { user: req.session.user })
})
router.get('/orders', verifyLogin, async (req, res) => {
  let orders = await userHelpers.getUserOrders(req.session.user._id)
  res.render('user/orders', { user: req.session.user, orders })
})
router.get('/order-list/:id', verifyLogin, async (req, res) => {
  let products = await userHelpers.getOrderProducts(req.params.id)
  console.log(products);
  res.render('user/order-list', { user: req.session.user, products })
})
router.post('/verify-payment', (req, res) => {
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(() => {
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
      res.json({ status: true })
    })
  }).catch((err) => {
    console.log(err);
    res.json({ status:false,errMsg:'' })
  })
})




module.exports = router;
