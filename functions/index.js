const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

//configuration for the plaid
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

//create token Api
const plaidClient = new PlaidApi(configuration);
exports.createPayment = functions.https.onRequest(async (request, response) => {
  const name = request.body.name;
  const id = request.body.id;
  console.log("name ", name);
  console.log("idd???  ", id);
  const plaidrequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: id,
    },
    client_name: name,
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

exports.publicTokenGenrate = functions.https.onRequest(
  async (request, response) => {
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
      const createTokenResponse = await plaidClient.sandboxPublicTokenCreate(
        plaidrequest
      );
      response.json(createTokenResponse.data);
    } catch (error) {
      response.status(500).send({ msg: "fail", error });
      // handle error
    }
  }
);

//create ExchangePublic token
exports.ExchangePublic_token = functions.https.onRequest(
  async (request, response) => {
    const publicToken = request.body.public_token;
    try {
      const responseExchange = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const accessToken = responseExchange.data.access_token;
      const itemID = responseExchange.data.item_id;
      response.json({
        public_token_exchange: "complete",
        accessToken: accessToken,
        itemID: itemID,
      });
      // response.json({ public_token_exchange: "complete" });
    } catch (error) {
      console.log("error >> ", error);
      // handle error
    }
  }
);

// account details api
exports.accountsDetails = functions.https.onRequest(
  async (request, response) => {
    const accessToken = request.body.accessToken;

    try {
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });
      // prettyPrintResponse(accountsResponse);
      // response.status(200).send(accountsResponse.data);
      response.json(accountsResponse.data);
    } catch (error) {
      // prettyPrintResponse(error);
      return response.json(error.response);
    }
  }
);

//get account balance
exports.getAccountBalance = functions.https.onRequest(
  async (request, response) => {
    const accessToken = request.body.accessToken;
    try {
      const responsedata = await plaidClient.accountsBalanceGet(accessToken);
      console.log("response >?>ʔ", responsedata);
    } catch (error) {
      // handle error
    }
  }
);

const { AssetReportCreateRequest } = require("plaid");

exports.assetReportCreate = functions.https.onRequest(
  async (request, response) => {
    const daysRequested = 60;
    const options = {
      client_report_id: "123",
      webhook: "https://www.example.com",
      user: {
        client_user_id: "789",
        first_name: "Jane",
        middle_name: "Leah",
        last_name: "Doe",
        ssn: "123-45-6789",
        phone_number: "(555) 123-4567",
        email: "jane.doe@example.com",
      },
    };
    const accessTokens = "access-sandbox-c5ea252e-459f-4f89-bc73-18bb76a5b88b";
    // accessTokens is an array of Item access tokens.
    // Note that the assets product must be enabled for all Items.
    // All fields on the options object are optional.
    const responseData = await plaidClient.assetReportCreate(
      accessTokens,
      daysRequested,
      options
    );
    console.log("responseData >> ", responseData).catch((err) => {
      console.log("error ?? ", err);
      // handle error
    });
  }
);

exports.assetReportCreate = functions.https.onRequest(
  async (request, response) => {
    const AssetReportGetRequest = {
      asset_report_token: assetReportToken,
      include_insights: true,
    };
    try {
      const responsedata = await plaidClient.assetReportGet(
        AssetReportGetRequest
      );
      console.log("response >?>ʔ", responsedata);
      const assetReportId = response.data.asset_report_id;
    } catch (error) {
      // handle error
    }
  }
);
