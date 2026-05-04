const axios = require("axios");

const client = axios.create({
  baseURL: process.env.NIBSS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get NIBSS token
const getToken = async () => {
  const response = await client.post("/api/auth/token", {
    apiKey: process.env.NIBSS_API_KEY,
    apiSecret: process.env.NIBSS_SECRET,
  });
  return response.data.token;
};

// Verify BVN
const verifyBVN = async (bvn) => {
  try {
    console.log("getToken about to be called");
    const token = await getToken();
    console.log("token received:", token);
    const response = await client.post("/api/validateBvn", { bvn }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("validateBvn response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Verify NIN
const verifyNIN = async (nin) => {
  try {
    const token = await getToken();
    const response = await client.post("/api/validateNin", { nin }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Name Enquiry
const nameEnquiry = async (accountNumber) => {
  try {
    const token = await getToken();
    const response = await client.get(`/api/account/name-enquiry/${accountNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Intra-bank transfer
const intraTransfer = async ({ amount, senderAccount, recipientAccount, reference }) => {
  try {
    const token = await getToken();
    const response = await client.post("/api/transfer", {
      from: senderAccount,
      to: recipientAccount,
      amount,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Inter-bank transfer
const interTransfer = async ({ amount, senderAccount, recipientAccount, recipientBankCode, narration, reference }) => {
  try {
    const token = await getToken();
    const response = await client.post("/api/transfer/inter", {
      amount,
      senderAccount,
      recipientAccount,
      recipientBankCode,
      narration,
      reference,
      bankCode: process.env.NIBSS_BANK_CODE,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Transaction Status Check
const checkTransactionStatus = async (reference) => {
  try {
    const token = await getToken();
    const response = await client.get(`/api/transaction/${reference}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// All Accounts
const getAllAccounts = async () => {
  try {
    const token = await getToken();
    const response = await client.get("/api/accounts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get Account Balance
const getNibssBalance = async (accountNumber) => {
  try {
    const token = await getToken();
    const response = await client.get(`/api/account/balance/${accountNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

module.exports = {
  verifyBVN,
  verifyNIN,
  nameEnquiry,
  intraTransfer,
  interTransfer,
  checkTransactionStatus,
  getAllAccounts,
  getNibssBalance,
};