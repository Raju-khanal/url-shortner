const shortid = require("shortid");
const url = require("../models/url")
async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ "msg": "Fill the input" });
    }
    const shortId = shortid();
    await url.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
    });
    return res.json({ id: shortId });
}
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await url.findOne({ shortId });

    if (!result) {
        return res.status(404).json({
            message: "Short URL not found",
        });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });

}
module.exports = { handleGenerateNewShortUrl, handleGetAnalytics };