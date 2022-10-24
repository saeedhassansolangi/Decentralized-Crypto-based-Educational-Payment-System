import React, { useState, useEffect } from "react";
import Home from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { MoralisProvider } from "react-moralis";
import Payment from "./pages/Payment";
import Buy from "./pages/Buy";
import { ethers } from "ethers";
import { abi, paymentAddr } from "./artifacts/";
import { ALCHEMY_API_KEY, WALLET_PRIVATE_KEY } from "./configs/secret";
import { PaymentContext } from "./contexts/Payment";
import { UserContext } from "./contexts/User";
import User from "./pages/user";
import Admin from "./pages/admin";
import { NotificationProvider } from "@web3uikit/core";
import About from "./pages/About";

const properties = [
  "wallet_address",
  "amount",
  "semester",
  "batch",
  "stdId",
  "dueDate",
  "feeType",
  "programType",
  "campus",
];

function App() {
  const [totalSupply, setTotalSupply] = useState([]);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [contractOwner, setContractOwner] = useState("");
  const [allTransactions, setAllTransactions] = useState("");
  const [initialTransactions, setInitialTransactions] = useState(false);
  const [user, setUser] = useState(() => {
    const isUser = localStorage.getItem("user");
    return isUser ? JSON.parse(isUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  const initialState = async function () {
    setInitialTransactions(true);

    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      5
    );
    const signer = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const Payment = new ethers.Contract(paymentAddr, abi, signer);

    setTotalSupply((await Payment.totalSupply()).toString());
    setTokenSymbol((await Payment.symbol()).toString());
    setTokenName((await Payment.name()).toString());
    setContractOwner((await Payment.getOwner()).toString());

    const transactions = await Payment.getAllTransactions();

    const newTranactions = [];

    transactions.forEach((transaction) => {
      const obj = {};
      transaction.forEach((item, index) => {
        obj[properties[index]] = item;
      });
      newTranactions.push(obj);
    });

    setAllTransactions(newTranactions);
    setInitialTransactions(false);
  };

  useEffect(() => {
    initialState();
  }, []);

  const values = {
    user,
    setUser,
    token,
    setToken,
    contractOwner,
    allTransactions,
    initialTransactions,
    initialState,
  };

  return (
    <>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <UserContext.Provider value={{ ...values }}>
            <PaymentContext.Provider
              value={[totalSupply, tokenName, tokenSymbol]}
            >
              <Router>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/buy" element={<Buy />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/user/:username" element={<User />} />
                  <Route path="/user/admin/:username" element={<Admin />} />
                </Routes>
              </Router>
            </PaymentContext.Provider>
          </UserContext.Provider>
        </NotificationProvider>
      </MoralisProvider>
    </>
  );
}

export default App;
