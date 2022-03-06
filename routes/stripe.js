const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51KZueYSH2RYxFIuZZPXJ74UEaTgrF9ZCxbcHG0oPldbVygGWT9CowE7ZVlbDEt9O2hzp7FiXgfQmz9t4ER8IBbMD00aU0SFNpU"
);

router.post("/payment", async (req, res) => {
  // console.log(req.body);
  const { token, amount } = req.body;
  const idempontencyKey = uuidv4();

  stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then(async (customer) => {
      stripe.charges.create({
        amount: amount,
        currency: "INR",
        customer: customer.id,
      });
    })
    .then((result) => res.send(result))
    .catch((e) => console.log(e));
});
module.exports = router;

// console.log(req.body);
// const { token, amount } = req.body;
// const idempontencyKey = uuidv4();
// try {
//   stripe.customers
//     .create({
//       email: token.email,
//       source: token.id,
//     })
//     .then(async (customer) => {
//       stripe.charges.create(
//         {
//           amount: amount,
//           currency: "usd",
//           customer: customer.id,
//           shipping: {
//             name: token.card.name,
//             address: {
//               country: token.card.address_country,
//             },
//           },
//         },
//         { idempontencyKey }
//       );
//     })
//     .then((result) => res.status(200).json(result))
//     .catch((e) => console.log(e));
// } catch (e) {
//   console.log(e);
// }

// stripe.customers
//   .create({
//     email: "ttestt@gmail.com",
//     source: req.body.token.id,
//     name: "Gautam Sharma",
//     address: {
//       line1: "510 Townsend St",
//       postal_code: "98140",
//       city: "San Francisco",
//       state: "CA",
//       country: "US",
//     },
//   })
//   .then((customer) => {
//     return stripe.charges.create({
//       amount: 7000, // Charing Rs 25
//       description: "Web Development Product",
//       currency: "usd",
//       customer: customer.id,
//     });
//   })
//   .then((charge) => {
//     res.status(200).json({ msg: "Success" }); // If no error occurs
//   })
//   .catch((err) => {
//     res.status(500).json(err); // If some error occurs
//   });
