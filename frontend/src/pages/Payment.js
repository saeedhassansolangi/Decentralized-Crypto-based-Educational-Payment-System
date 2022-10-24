import React, { useState } from "react";
import { useNotification } from "@web3uikit/core";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, paymentAddr } from "../artifacts";
import { feeTypes, programTypes, campus } from "../utils/types";
import Input from "../components/Input";
import ConnectWallet from "../components/ConnectWallet";
import { useContext } from "react";
import { UserContext } from "../contexts/User";

function Payment() {
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [amount, setAmount] = useState("");
  const [feeType, setFeeType] = useState(0);
  const [studentId, setStudentId] = useState("");
  const [programType, setProgramType] = useState(0);
  const [selectCampus, setSelectCampus] = useState(0);
  const dispatch = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const { isWeb3Enabled } = useMoralis();
  const { initialState } = useContext(UserContext);
  const [transactionHash, setTransactionHash] = useState("");

  const { data, runContractFunction: payFees } = useWeb3Contract({
    abi: abi,
    contractAddress: paymentAddr,
    functionName: "pay",
    params: {
      amount: amount,
      semester: semester,
      _feeType: feeTypes[feeType],
      batch: batch,
      stdId: studentId,
      _proramType: programTypes[programType],
      _campus: campus[selectCampus],
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
      icon: icon || "info",
      position: position || "topR",
    });
  };

  const handleAddRecord = async () => {
    setIsLoading(true);
    if (
      !semester ||
      !batch ||
      !amount ||
      !feeType ||
      !programType ||
      !selectCampus ||
      !studentId
    ) {
      setIsLoading(false);
      return alert("please provide complete data");
    }

    if (amount.trim().length < 1) {
      return alert("amount can't be zero");
    }

    await payFees({
      onComplete: () => {
        console.log(data);
      },
      onSuccess: (data) => {
        setSemester("");
        setBatch("");
        setAmount("");
        setFeeType(0);
        setProgramType(0);
        setSelectCampus("");
        setStudentId("");
        handleNewNotification(
          "success",
          "Payment Successful",
          "Success",
          "success",
          "topR"
        );

        setTransactionHash(data.hash);
        initialState();
      },
      onError: (err) => {
        console.log(err.message);
        handleNewNotification(
          "error",
          "Semester details adding failed",
          "Error",
          "error",
          "topR"
        );
      },
    });

    setIsLoading(false);
  };

  if (!isWeb3Enabled) {
    return <ConnectWallet />;
  }

  return (
    <div className="bg-color vh p-1">
      {transactionHash ? (
        <div className="text-center">
          <a
            href={`https://goerli.etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>Your transaction has been added.</span>
            <span>Check Tranaction on Etherscan</span>
          </a>
        </div>
      ) : null}
      <div className="container user-form">
        <div className="text-header">Enter Details</div>
        <div className="">
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
              setAmount(e.target.value.toString());
            }}
          />
          <Input
            placeholder="Student Id"
            name="studentId"
            type="text"
            value={studentId}
            handleChange={(e) => {
              setStudentId(e.target.value);
            }}
          />
          <select
            defaultValue={""}
            onChange={(e) => {
              setFeeType(e.target.value);
            }}
            id="default"
            className="form-select"
          >
            <option value={""} className="default">
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
            defaultValue={""}
            className="form-select"
            onChange={(e) => {
              setProgramType(e.target.value);
            }}
            id="default"
          >
            <option value={""}> Choose a Program type</option>

            {Object.keys(programTypes).map((key) => {
              return (
                <option value={key} key={key}>
                  {key}
                </option>
              );
            })}
          </select>
          <select
            defaultValue={""}
            className="form-select"
            onChange={(e) => {
              setSelectCampus(e.target.value);
            }}
            id="default"
          >
            <option value={""}> Choose a Campus</option>

            {Object.keys(campus).map((key) => {
              return (
                <option value={key} key={key}>
                  {key}
                </option>
              );
            })}
          </select>
          <div className="h-[1px] w-full  my-1" />
          <button
            type="button"
            onClick={handleAddRecord}
            className=" w-full mt-2 border-2 p-2 border-[#e95b62] rounded-full cursor-pointer"
          >
            {isLoading ? "Please Wait..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
