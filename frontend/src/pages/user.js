import React, { useEffect } from "react";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { abi, paymentAddr } from "../artifacts";
import { UserContext } from "../contexts/User";
import { useContext } from "react";
import { ethers } from "ethers";
import { ALCHEMY_API_KEY, WALLET_PRIVATE_KEY } from "../configs/secret";
import {
  revereCampus,
  reverseFeeTypes,
  reverseProgramTypes,
} from "../utils/types";
import moment from "moment";
import { shortenAddress } from "../utils/shortenURL";
import Circle from "../components/Circle";
import axios from "axios";

const tableHeaders = [
  "From",
  "Amount",
  "Semester",
  "Batch",
  "Student Id",
  "Due Date",
  "Fee Type",
  "Program Type",
  "Campus",
];

function User() {
  const { account } = useMoralis();
  const [userTokens, setUserTokens] = useState([]);
  const { user } = useContext(UserContext);
  const [studentTransactions, setStudentTransactions] = useState([]);

  useEffect(() => {
    const getUserTransactions = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        5
      );
      const signer = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
      const Payment = new ethers.Contract(paymentAddr, abi, signer);

      const sdetails = await Payment.getStudentDetails(account);
      console.log({ sdetails });

      setStudentTransactions(sdetails);
    };

    const fetchUserTokens = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/users/tokens/${user.email}`
      );
      setUserTokens(data);
    };

    getUserTransactions();
    fetchUserTokens();
  }, [account, user.email]);

  return (
    <div className="bg-color">
      <div className="container">
        <div className="flex flex-col justify-center items-center">
          <p className="pt-5">
            Welcome <span className="user">{user && user.username}</span>
          </p>

          <Circle text={"Your Submitted fees "} />
          <table className="table table-sm table-responsive-sm table-responsive-md ">
            <thead>
              <tr>
                {tableHeaders.map((header) => {
                  return <th key={header}>{header}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {studentTransactions.length > 0
                ? studentTransactions.map((tranaction) => {
                    return (
                      <tr key={tranaction.dueDate}>
                        <td className="border border-slate-700">
                          {shortenAddress(tranaction.walletAddress)}
                        </td>
                        <td className="border border-slate-700">
                          {tranaction.amount.toString()}
                        </td>
                        <td className="border border-slate-700">
                          {tranaction.semester.toString()}
                        </td>
                        <td className="border border-slate-700">
                          {tranaction.batch.toString()}
                        </td>
                        <td className="border border-slate-700">
                          {tranaction.stdId}
                        </td>
                        <td className="border border-slate-700">
                          {moment(
                            new Date(tranaction.dueDate * 1000)
                          ).fromNow()}
                        </td>
                        <td className="border border-slate-700">
                          {reverseFeeTypes[tranaction.feeType]}
                        </td>
                        <td className="border border-slate-700">
                          {reverseProgramTypes[tranaction.programType]}
                        </td>
                        <td className="border border-slate-700">
                          {revereCampus[tranaction.campus]}
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>

          <div className="mt-5">
            <Circle text={"Coin History"} />

            <table className="table table-sm table-responsive-sm table-responsive-md ">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Tokens</th>
                  <th>Transaction Id</th>
                  <th>Wallet Address</th>
                  <th>is Received</th>
                </tr>
              </thead>

              <tbody>
                {userTokens.map((token) => {
                  return (
                    <tr key={token._id}>
                      <td>{token.paymentMethod}</td>
                      <td>{token.pkrAmount}</td>
                      <td>{token.tokens}</td>
                      <td>{token.transactionId}</td>
                      <td>{token.wallletAddress}</td>
                      <td>{token.hasRecived ? "Received" : "Pending"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
