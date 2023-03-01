const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": "59cfd79bbdc6a47fd24dda52",
      "PLAID-SECRET": "f01658ba432e63faf4f912cf6d6e33",
    },
  },
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

const plaidClient = new PlaidApi(configuration);
exports.createPayment = functions.https.onRequest(async (request, response) => {
  const plaidrequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: "user ",
    },
    client_name: "Plaid Test App",
    products: ["auth"],
    language: "en",
    redirect_uri:
      "https://cdn-testing.plaid.com/link/v2/stable/sandbox-oauth-a2a-react-native-redirect.html",
    country_codes: ["US"],
  };

  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidrequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    response.status(500).send({ msg: "fail", error });
    // handle error
  }
});

exports.ExchangePublic_token = functions.https.onRequest(
  async (request, response) => {
    const publicToken = request.body.public_token;
    try {
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const accessToken = response.data.access_token;
      const itemID = response.data.item_id;
      res.json({ public_token_exchange: "complete" });
    } catch (error) {
      console.log("error >> ", error);
      // handle error
    }
  }
);
