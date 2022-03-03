const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51KSOH5SJ3Qu163yRZuWvcgHCw2YmV9TTiGVgjGcGRl362SIWIRLKIiS9sWEBxo86XMYqn8qsCQnaCgvoNaTsN5Ob00XwPqXHUP"
);

router.post("/payment", (req, res) => {
  console.log(req.body);
  const { token, amount } = req.body;
  const idempontencyKey = uuidv4();
  try {
    stripe.customers
      .create({
        email: token.email,
        source: token.id,
      })
      .then(async (customer) => {
        stripe.charges.create(
          {
            amount: amount,
            currency: "usd",
            customer: customer.id,
            shipping: {
              name: token.card.name,
              address: {
                country: token.card.address_country,
              },
            },
          },
          { idempontencyKey }
        );
      })
      .then((result) => res.status(200).json(result))
      .catch((e) => console.log(e));
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
