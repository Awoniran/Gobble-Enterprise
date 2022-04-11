const router = require('express').Router({ strict: true });
const {
  HttpProtectRoute,
} = require('../../../controllers/auth/authController');

const {
  addReview,
  getReviews,
} = require('../../../controllers/reviews/review');

router.route('/reviews/:id').get(getReviews).post(HttpProtectRoute, addReview);

module.exports = router;
