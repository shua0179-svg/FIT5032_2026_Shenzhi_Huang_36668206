const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

setGlobalOptions({ maxInstances: 10 });

// Connect this Cloud Function to the Firestore database
admin.initializeApp();

// Count all documents in the "books" collection
exports.countBooks = onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const snapshot = await admin.firestore().collection("books").get();

      response.status(200).json({
        count: snapshot.size,
      });
    } catch (error) {
      console.error("Error counting books:", error);

      response.status(500).json({
        error: "Unable to count books.",
      });
    }
  });
});