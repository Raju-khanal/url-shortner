const express = require("express");
const app = express();

const URL = require("./models/url");
const urlRouter = require("./routes/url");
const { connectToMongoDB } = require("./connect");

const PORT = 3000;

connectToMongoDB("mongodb://127.0.0.1:27017/urlDb")
    .then(() => console.log("Connected DB"))
    .catch((err) => console.log("Error:", err));

app.use(express.json());

app.use("/url", urlRouter);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});