function dumbUser(userObject) {
   return {
      id: userObject.id,
      name: userObject.name,
      createdAt: userObject.createdAt,
      email: userObject.email,
      role: userObject.role,
      active: userObject.active,
      image: userObject.image,
      address: userObject.address,
      phoneNo: userObject.phoneNo,
   };
}

function dumbReview(reviewObject) {
   return {
      id: reviewObject.id,
      review: reviewObject.review,
      date: reviewObject.date,
      userId: reviewObject.userId,
      productId: reviewObject.productId,
      User: {
         name: reviewObject.User.name,
         image: reviewObject.User.image,
         phoneNo: reviewObject.User.phoneNo,
      },
   };
}

module.exports = { dumbUser, dumbReview };
