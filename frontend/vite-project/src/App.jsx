import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [income, setIncome] = useState("");
  const [threshold, setThreshold] = useState(50000);
  const [proof, setProof] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateProof = async () => {
    if (!income || isNaN(income)) {
      setError("Please enter a valid income.");
      return;
    }

    setLoading(true);
    setError("");
    setVerificationResult(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/generate-proof",
        {
          income: parseInt(income),
          threshold,
        }
      );
      setProof(response.data);
    } catch (error) {
      console.error("Error generating proof:", error);
      setError("Failed to generate proof. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProof = async () => {
    if (!proof) {
      setError("No proof available to verify.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/verify-proof",
        proof
      );
      setVerificationResult(response.data.isValid);
    } catch (error) {
      console.error("Error verifying proof:", error);
      setError("Failed to verify proof. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Proof of Income</h1>
      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Income:
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              style={styles.input}
              placeholder="Enter your income"
            />
          </label>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Threshold:
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              style={styles.input}
              placeholder="Enter the threshold"
            />
          </label>
        </div>
        <button
          onClick={handleGenerateProof}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Generating Proof..." : "Generate Proof"}
        </button>
        {proof && (
          <div style={styles.proofSection}>
            <h3 style={styles.subtitle}>Proof Generated!</h3>
            <button
              onClick={handleVerifyProof}
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Verifying Proof..." : "Verify Proof"}
            </button>
          </div>
        )}
        {error && <p style={styles.error}>{error}</p>}
        {verificationResult !== null && (
          <h3 style={styles.result}>
            Verification Result:{" "}
            <span style={{ color: verificationResult ? "green" : "red" }}>
              {verificationResult ? "Valid" : "Invalid"}
            </span>
          </h3>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "16px",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  proofSection: {
    marginTop: "20px",
    textAlign: "center",
  },
  subtitle: {
    color: "#333",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  result: {
    textAlign: "center",
    color: "#333",
  },
};

export default App;
