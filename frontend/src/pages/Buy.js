import React, { useContext, useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, paymentAddr } from "../artifacts";
import { Dropdown, Input, Stepper } from "@web3uikit/core";
import axios from "axios";
import { UserContext } from "../contexts/User";
import ConnectWallet from "../components/ConnectWallet";

const TOKEN_PRICE_IN_PKR = 500;

function Index() {
  const { isWeb3Enabled, account } = useMoralis();
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [muetTokens, setMuetTokens] = useState("");
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [walletAddress, setWalletAddress] = useState(account);
  const [transactionId, setTransactionId] = useState("");
  const [completeMessage, setCompleteMessage] = useState("");
  const { user } = useContext(UserContext);

  const {
    runContractFunction: getSymbol,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: paymentAddr,
    functionName: "symbol",
    params: {},
  });

  useEffect(() => {
    const initialWork = async () => {
      const symbol = await getSymbol();
      setTokenSymbol(symbol);
    };

    if (isWeb3Enabled) {
      initialWork();
    }
  }, [isWeb3Enabled, getSymbol]);

  if (!isWeb3Enabled) {
    return <ConnectWallet />;
  }

  return (
    <div className="bg-color mgc vh pt-5">
      <div className="container">
        {isFetching || isLoading ? (
          <div className="mgc">loading...</div>
        ) : (
          <div className="">
            <Stepper
              completeTitle="Complete"
              completeMessage={completeMessage}
              onComplete={function noRefCheck() {
                if (!walletAddress || !paymentMethod || !transactionId) {
                  setCompleteMessage("Please fill all the fields");
                  return;
                } else {
                  axios
                    .post("http://localhost:5000/users/tokens", {
                      email: user && user.email,
                      transactionId: transactionId,
                      pkrAmount: TOKEN_PRICE_IN_PKR * muetTokens,
                      tokens: muetTokens,
                      paymentMethod: paymentMethod,
                      hasRecived: false,
                      wallletAddress: walletAddress,
                    })
                    .then((data) => {
                      console.log(data);
                    })
                    .catch((err) => {
                      console.log(err);
                    });

                  setCompleteMessage(
                    `You will receive ${muetTokens} ${tokenSymbol} tokens in your wallet ${walletAddress} in 2-3 business days`
                  );
                }
              }}
              step={1}
              stepData={[
                {
                  content: (
                    <div className="">
                      <h1 className="text-center text-3xl font-bold mb-5">
                        Enter Number of Tokens
                      </h1>
                      <Input
                        width="100%"
                        id="amount"
                        type="text"
                        value={muetTokens}
                        placeholder="enter amount"
                        onChange={(e) => {
                          const inpt = parseInt(e.target.value);
                          if (inpt) {
                            setMuetTokens(inpt);
                            setError("");
                          } else {
                            setError("Invalid Input");
                            setMuetTokens("");
                          }
                        }}
                      />
                      {error ? (
                        <h3 className="mt-5 text-red-400 text-2xl font-bold">
                          {error}
                        </h3>
                      ) : (
                        <h3 className="mt-5  text-2xl font-bold">
                          You will be charged
                          <span className="font-bold px-3 mx-1 bg-blue-500 rounded">
                            {muetTokens * TOKEN_PRICE_IN_PKR} PKR
                          </span>
                          for {muetTokens} muet token.
                        </h3>
                      )}
                    </div>
                  ),
                },
                {
                  content: (
                    <div>
                      <h1 className="text-center text-3xl font-bold mb-5">
                        Select your Payment Method
                      </h1>
                      <div className="mgc">
                        <Dropdown
                          width="100%"
                          showSelected={true}
                          selectedState={selectedPaymentMethod}
                          label="Method: "
                          onChange={function noRefCheck(selectedOption) {
                            setPaymentMethod(selectedOption.id);

                            selectedOption.id === "JazzCash"
                              ? setSelectedPaymentMethod(0)
                              : setSelectedPaymentMethod(1);
                          }}
                          onComplete={function noRefCheck() {}}
                          options={[
                            {
                              id: "JazzCash",
                              label: "JazzCash",
                            },
                            {
                              id: "Easypaisa",
                              label: "Easypaisa",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  content: (
                    <div>
                      <h1 className="text-center text-3xl font-bold mb-5">
                        Select your Wallet Address
                      </h1>

                      <Input
                        hasCopyButton
                        label="Wallet Address"
                        name="Test text Input"
                        width="100%"
                        value={walletAddress}
                        onBlur={function noRefCheck() {}}
                        onChange={function noRefCheck(e) {
                          setWalletAddress(e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                  ),
                },
                {
                  content: (
                    <div>
                      <h1 className="text-center text-3xl font-bold mb-5">
                        Send {muetTokens * TOKEN_PRICE_IN_PKR} PKR in{" "}
                        {paymentMethod} to the following Account
                      </h1>

                      {/* style the table  */}
                      <div className=" flex flex-row justify-center items-center mx-auto mt-5">
                        <table className="mx-auto">
                          <thead>
                            <tr>
                              <th className=" text-2xl font-bold px-5">
                                Account Name
                              </th>

                              <th className=" text-2xl font-bold px-5">
                                Account Number
                              </th>

                              <th className=" text-2xl font-bold px-5">
                                Wallet
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="m-1">
                              <td className="p-2">Saeed Hassan</td>
                              <td className="p-2  ">+923161607902</td>
                              <td className="p-2  ">{paymentMethod}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-5">
                        <Input
                          hasCopyButton
                          label="Enter your Transaction Id"
                          name="Test text Input"
                          width="100%"
                          value={transactionId}
                          onBlur={function noRefCheck() {}}
                          onChange={function noRefCheck(e) {
                            setTransactionId(e.target.value);
                          }}
                          type="text"
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
