import React, { useContext, useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, paymentAddr } from "../artifacts";
import Input from "../components/Input";
import Loader from "../components/Loader";
import { PaymentContext } from "../contexts/Payment";
import { useNotification } from "@web3uikit/core";
import { feeTypes, programTypes } from "../utils/types";
import ConnectWallet from "../components/ConnectWallet";
import axios from "axios";
import { UserContext } from "../contexts/User";

function Admin(props) {
  const [walletAddr, setWalletAddr] = useState("");
  const [userTokens, setUserTokens] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useNotification();
  const { isWeb3Enabled } = useMoralis();
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [amount, setAmount] = useState("");
  const [feeType, setFeeType] = useState(0);
  const [programType, setProgramType] = useState(0);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [studentTransactions, setStudentTransactions] = useState([]);

  const [, tokenName, ,] = useContext(PaymentContext);
  const { user } = useContext(UserContext);

  const { runContractFunction: trasferNow } = useWeb3Contract({
    abi: abi,
    contractAddress: paymentAddr,
    functionName: "transfer",
    params: {
      to: walletAddr,
      amount: userTokens,
    },
  });

  const { runContractFunction: addSemesterDetails } = useWeb3Contract({
    abi: abi,
    contractAddress: paymentAddr,
    functionName: "addSemesterDetails",
    params: {
      _semester: semester,
      _batch: batch,
      _amount: amount,
      _feeType: feeTypes[feeType],
      _programType: programTypes[programType],
    },
  });

  const fetchAllTokens = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/users/tokens/all"
      );
      setStudentTransactions(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTokens();
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
      icon: icon || "info",
      position: position || "topR",
    });
  };

  const updateTokenRecord = async (transactionId) => {
    await axios
      .post(`http://localhost:5000/users/${user.email}/${transactionId}`, {
        transactionId: transactionId,
      })
      .then((response) => {
        console.log(response);
        fetchAllTokens();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTransfer = async (walletAddr, _amount, tId) => {
    setWalletAddr(walletAddr);
    setUserTokens(_amount);

    await trasferNow({
      onSuccess: async (data) => {
        setUserTokens(0);
        await updateTokenRecord(tId);
        handleNewNotification(
          "success",
          "Tokens transfered successfully",
          "Success",
          "success",
          "BottomR"
        );

        console.log(data);
        setWalletAddr("");
      },
      onError: (err) => {
        handleNewNotification(
          "error",
          "Tokens transfer failed",
          "Error",
          "error",
          "BottomR"
        );
      },
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!userTokens && !walletAddr) {
      setIsLoading(false);
      return alert("please provide complete data");
    }

    await trasferNow({
      onSuccess: () => {
        setUserTokens(0);
        handleNewNotification(
          "success",
          "Tokens transfered successfully",
          "Success",
          "success",
          "topR"
        );
        setWalletAddr("");
      },
      onError: (err) => {
        handleNewNotification(
          "error",
          "Tokens transfer failed",
          "Error",
          "error",
          "topR"
        );
      },
    });

    setIsLoading(false);
  };

  const handleAddRecord = async () => {
    setIsAddLoading(true);
    if (!semester || !batch || !amount || !feeType || !programType) {
      setIsAddLoading(false);
      return alert("please provide complete data");
    }

    await addSemesterDetails({
      onSuccess: () => {
        setSemester("");
        setBatch("");
        setAmount("");
        setFeeType(0);
        setProgramType(0);
        handleNewNotification(
          "success",
          "Semester details added successfully",
          "Success",
          "success",
          "topR"
        );
      },
      onError: (err) => {
        handleNewNotification(
          "error",
          "Semester details adding failed",
          "Error",
          "error",
          "topR"
        );
      },
    });

    setIsAddLoading(false);
  };

  if (!isWeb3Enabled) {
    return <ConnectWallet />;
  }

  return (
    <div className="bg-color">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12 my-auto mt-5">
            <h3 className="">Transfer Tokens</h3>
            <Input
              placeholder="Wallet Address, i.e: 0x6d836237D9A2916119df18b8BB7492bE5aCBB809"
              name="wallet_address"
              type="text"
              handleChange={(e) => {
                setWalletAddr(e.target.value);
              }}
            />
            <Input
              placeholder={`Amount ${tokenName}`}
              name="amount"
              type="number"
              value={userTokens}
              handleChange={(e) => {
                setUserTokens(e.target.value);
              }}
            />

            {userTokens ? (
              <small className="text-1xl">
                Sending {userTokens} {tokenName} to {walletAddr}
              </small>
            ) : null}

            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className=" w-full mt-2 border-2 p-2 border-[#3d4f7c] rounded-full cursor-pointer"
              >
                Send Now
              </button>
            )}
          </div>

          <div className="col-md-6 col-sm-12 mt-5">
            <h3 className="">Add New Record</h3>
            <Input
              placeholder="Semester"
              name="semester"
              type="number"
              value={semester}
              handleChange={(e) => {
                setSemester(e.target.value);
              }}
            />
            <Input
              placeholder="Batch"
              name="batch"
              type="number"
              value={batch}
              handleChange={(e) => {
                setBatch(e.target.value);
              }}
            />

            <Input
              placeholder="Amount"
              name="amount"
              type="number"
              value={amount}
              handleChange={(e) => {
                setAmount(e.target.value);
              }}
            />

            <select
              onChange={(e) => {
                setFeeType(e.target.value);
              }}
              id="default"
              className="form-select"
            >
              <option selected value={""}>
                Choose a Fee type
              </option>

              {Object.keys(feeTypes).map((key) => {
                return (
                  <option value={key} key={key}>
                    {key}
                  </option>
                );
              })}
            </select>
            <select
              onChange={(e) => {
                setProgramType(e.target.value);
              }}
              id="default"
              className="form-select"
            >
              <option selected value={""}>
                {" "}
                Choose a Fee type
              </option>

              {Object.keys(programTypes).map((key) => {
                return (
                  <option value={key} key={key}>
                    {key}
                  </option>
                );
              })}
            </select>

            <div className="h-[1px] w-full  my-1" />
            {isAddLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleAddRecord}
                className=" w-full mt-2 border-2 p-2 border-[#e95b62] rounded-full cursor-pointer"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <table className="table table-sm table-responsive-sm table-responsive-md ">
            <thead>
              <tr>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Tokens</th>
                <th>Transaction Id</th>
                <th>Wallet Address</th>
                <th>Has Received </th>
              </tr>
            </thead>

            <tbody>
              {studentTransactions.map((token) => {
                const {
                  _id,
                  paymentMethod,
                  pkrAmount,
                  tokens,
                  transactionId,
                  wallletAddress,
                } = token;
                return (
                  <tr key={_id}>
                    <td>{paymentMethod}</td>
                    <td>{pkrAmount}</td>
                    <td>{tokens}</td>
                    <td>{transactionId}</td>
                    <td>{wallletAddress}</td>
                    <td>
                      {token.hasReceived ? (
                        <button disabled style={{ background: "#bbb" }}>
                          Recievd
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleTransfer(wallletAddress, tokens, _id);
                          }}
                        >
                          Send NOw
                        </button>
                      )}{" "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;
