const express=require('express')
const router=express.Router()

const {userLogin,registerUser,places,weather,trip}=require('../controllers/User')

router.route('/login').post(userLogin)
router.route('/register').post(registerUser)
router.route('/places').get(places)
router.route('/weather').get(weather)
router.route('/trip').get(trip)

module.exports=router