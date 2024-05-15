const express=require('express')
const router=express.Router()

const {userLogin,registerUser,places,weather,trip,getRestaurants, getLocationData}=require('../controllers/User')

router.route('/login').post(userLogin)
router.route('/register').post(registerUser)
router.route('/places').get(places)
router.route('/weather').get(weather)
router.route('/trip').get(trip)
router.route("/location").get(getLocationData)
router.route('/restaurants').get(getRestaurants)

module.exports=router