const Token = require("../models/Token");
// 👉 Get the last called token
const getCurrentToken = async (req, res) => {
  try {
    const lastCalled = await Token.findOne({ status: "called" }).sort({
      number: -1,
    });
    if (!lastCalled) {
      return res.status(404).json({ message: "No token called yet" });
    }
    res.json(lastCalled);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Create a new token
const createToken = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    const last = await Token.findOne().sort({ number: -1 });
    const nextNumber = last ? last.number + 1 : 1;

    const newToken = await Token.create({
      number: nextNumber,
      name: name.trim(),
    });
    const io = req.app.get("io");
    io.emit("newToken", newToken);

    res.status(201).json(newToken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Get waiting tokens
const getWaitingTokens = async (req, res) => {
  try {
    const tokens = await Token.find({ status: "waiting" }).sort({ number: 1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Call next token (change first 'waiting' token to 'called')
const callNextToken = async (req, res) => {
  try {
    const nextToken = await Token.findOneAndUpdate(
      { status: "waiting" },
      { status: "called" },
      { new: true }
    );

    if (!nextToken) {
      return res.status(404).json({ message: "No waiting tokens" });
    }

    //   Emit tokenCalled event via Socket.IO
    const io = req.app.get("io"); // access the io instance
    io.emit("tokenCalled", nextToken); // broadcast to all clients

    console.log("📢 tokenCalled event emitted:", nextToken.number);

    res.json(nextToken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Reset all tokens (dangerous!)
const resetQueue = async (req, res) => {
  try {
    await Token.deleteMany({});
    res.json({ message: "  Queue has been reset." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createToken,
  getWaitingTokens,
  callNextToken,
  getCurrentToken,
  resetQueue,
};
