import React, { useContext, useState } from "react";
import Footer from "../components/Footer";
import { PaymentContext } from "../contexts/Payment";
import { paymentAddr } from "../artifacts/address";
import { shortenAddress } from "../utils/shortenURL";
import Loader from "../components/Loader";
import Input from "../components/Input";
import { useWeb3Contract, useChain } from "react-moralis";
import { abi } from "../artifacts";
import { UserContext } from "../contexts/User";
import { useNotification } from "@web3uikit/core";
import Table from "../components/Table";
import CardInfo from "../components/CardInfo";
import { FaEthereum } from "react-icons/fa";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { GiBuyCard } from "react-icons/gi";
import { SiSamsungpay } from "react-icons/si";
import Circle from "../components/Circle";

const ETH_PRICE_PER_TOKEN = 0.0015;

const RINKEBY_NETWORK_CHAIN_ID = "0x5";

function Index() {
  const [totalSupply, tokenName, tokenSymbol] = useContext(PaymentContext);

  const [walletAddr, setWalletAddr] = useState("");
  const [userTokens, setUserTokens] = useState("");
  const dispatch = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { allTransactions } = useContext(UserContext);

  const { chain, switchNetwork } = useChain();

  const { runContractFunction: sendEthers, isFetching } = useWeb3Contract({
    abi: abi,
    contractAddress: paymentAddr,
    functionName: "transfer",
    params: {
      to: walletAddr,
      amount: userTokens,
    },
  });

  const handleNewNotification = (
    notifyType,
    notifyMessage,
    notifyTitle,
    icon,
    position
  ) => {
    dispatch({
      type: notifyType,
      message: notifyMessage,
      title: notifyTitle,
      icon: "info",
      position: position || "topL",
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!userTokens || !walletAddr) {
      setIsLoading(false);
      return alert("please provide complete data");
    }

    await sendEthers({
      onSuccess: () => {
        handleNewNotification(
          "success",
          "Transaction Successful",
          "Success",
          "success",
          "bottomR"
        );
      },
      onError: (err) => {
        console.log(err.message);
        handleNewNotification(
          "error",
          "Transaction Failed",
          "Error",
          "error",
          "bottomR"
        );
      },
    });
    setIsLoading(false);
  };

  if (chain && chain.chainId !== RINKEBY_NETWORK_CHAIN_ID) {
    return (
      <div className="d-flex bg-color vh flex-column justify-content-center align-items-center flex-nowrap">
        <div>
          <p>You are on the Wrong Network</p>
          <button onClick={() => switchNetwork(RINKEBY_NETWORK_CHAIN_ID)}>
            Switch to Goerli Testnet
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-color">
      <div className="container">
        <div className="row vh">
          <div className="col-md-12 col-sm-12 mt-5">
            <h2 className="font-weight-bolder mt-3">
              <span className="d-block text-header">Pay your...</span>
              <span className="">Educational fees across the World</span>
            </h2>
            <p className="">via CryptoCurrencies</p>
            <div className="row purp mt-2">
              <div className="col-6 purp-child">Transparency</div>
              <div className="col-6 purp-child">Security</div>
              <div className="col-6 purp-child">Ethereum</div>
              <div className="col-6 purp-child">Web 3.0</div>
              <div className="col-6 purp-child">Low fees</div>
              <div className="col-6 purp-child">Blockchain</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className="text-center">
          Pay your Education Fees in a few minutes
        </h2>
        <div className="row mx-5 mt-5 text-center">
          <div className="col-md col-sm-12 info">
            <BsFillPersonPlusFill size={50} />
            <p>Create an account</p>
          </div>
          <div className="col-md col-sm-12 info">
            <GiBuyCard size={50} />
            <p>Buy Muet Coins</p>
          </div>
          <div className="col-md col-sm-12 info">
            <SiSamsungpay size={50} />
            <p>Pay Fees </p>
          </div>
        </div>
      </div>

      <div className="container pt-5 mb-5 mt-5 ">
        <div className="row mt-5 mb-5">
          <div className="col-md-6 col-sm-12">
            <div className="card-styles">
              <FaEthereum size={200} />
              <p>View Muet Coin on the Ethereum Blockchain explorere</p>
              <a className="link" href="#1">
                Click here.
              </a>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 mt-3">
            <h3 className="text-2xl mb-5">Buy {tokenName} with ethers</h3>
            <Input
              placeholder="Wallet Address"
              name="wallet_address"
              type="text"
              handleChange={(e) => {
                setWalletAddr(e.target.value);
              }}
            />
            <Input
              placeholder={`Amount ${tokenName}`}
              name="amount"
              type="text"
              step={1}
              value={userTokens}
              handleChange={(e) => {
                setUserTokens(e.target.value);
              }}
            />

            {userTokens ? (
              <small className="text-1xl">
                you Will be Charged {userTokens * ETH_PRICE_PER_TOKEN} ETH
              </small>
            ) : null}

            <div className="" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isFetching}
                className="w-full mt-2 border-2 p-2 border-blue-500 rounded-full cursor-pointer"
              >
                Send Now
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="container mt-5 mb-5">
        <Circle text={"Coin Details"} />
        <div className="row mx-auto">
          <CardInfo title={"tokenName"} name="Coin Name" size={"col-md"} />
          <CardInfo
            title={shortenAddress(paymentAddr)}
            name="Coin Address"
            size="col-md"
          />
          <CardInfo size={6} title={totalSupply} name="Max Total Supply:" />
          <CardInfo title={18} name="Decimals" size={"col-md"} />
          <CardInfo title={tokenSymbol} name="Coin Symbol" size={3} />

          <CardInfo
            size="col-md"
            title={chain ? chain.name : "Ethereum Testnet"}
            name="Network"
          />
        </div>
      </div>
      <div className="container mt-5 mb-5">
        <Circle text={"Transactions"} />
        <div className="table-responsive-sm table-responsive-md">
          <Table transactions={allTransactions} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Index;
