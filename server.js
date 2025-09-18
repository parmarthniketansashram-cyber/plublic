import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// API route to send BNB
app.post("/send-bnb", async (req, res) => {
  try {
    const { toAddress } = req.body;
    if (!toAddress) {
      return res.status(400).json({ error: "Missing toAddress" });
    }

    const amountToSend = ethers.parseEther(process.env.SEND_AMOUNT || "0.001");

    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: amountToSend,
    });

    console.log("Sending BNB:", tx.hash);
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error("Error sending BNB:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
