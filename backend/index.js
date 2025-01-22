const express = require("express");
const cors = require("cors");
const { groth16 } = require("snarkjs");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Load proving and verification keys
const zkeyPath = "../output/incomeProof_0001.zkey";
const vkey = JSON.parse(fs.readFileSync("../output/verification_key.json"));

// Endpoint to generate proof
app.post("/generate-proof", async (req, res) => {
  const { income, threshold } = req.body;

  const { proof, publicSignals } = await groth16.fullProve(
    { income, threshold },
    "../output/incomeProof_js/incomeProof.wasm",
    zkeyPath
  );

  res.json({ proof, publicSignals });
});

// Endpoint to verify proof
app.post("/verify-proof", async (req, res) => {
  const { proof, publicSignals } = req.body;

  // Check to see when proof becomes invalid
  //   if (publicSignals[0] === "1") {
  //     publicSignals[0] = "0";
  //   }

  // Verify the proof
  const isValid = await groth16.verify(vkey, publicSignals, proof);

  // Check if the income is above the threshold
  const isAboveThreshold = publicSignals[0] === "1";

  // Only return true if public signal is "1"
  res.json({ isValid: isValid && isAboveThreshold });

  res.json({ isValid });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
