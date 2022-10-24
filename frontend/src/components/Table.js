import moment from "moment";
import React from "react";
import { shortenAddress } from "../utils/shortenURL";
import {
  revereCampus,
  reverseFeeTypes,
  reverseProgramTypes,
} from "../utils/types";

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

function Table({ transactions }) {
  return (
    <table className="table table-sm  t-border ">
      <thead>
        <tr>
          {tableHeaders.map((header) => {
            return <th key={header}> {header} </th>;
          })}
        </tr>
      </thead>
      <tbody className="text-center text-sm">
        {transactions.length > 0 ? (
          transactions.map((tranaction) => {
            return (
              <tr key={tranaction.dueDate.toString()}>
                <td>{shortenAddress(tranaction.wallet_address)}</td>
                <td>{tranaction.amount.toString()}</td>
                <td>{tranaction.semester.toString()}</td>
                <td>{tranaction.batch.toString()}</td>
                <td>{tranaction.stdId}</td>
                <td>{moment(new Date(tranaction.dueDate * 1000)).fromNow()}</td>
                <td>{reverseFeeTypes[tranaction.feeType]}</td>
                <td>{reverseProgramTypes[tranaction.programType]}</td>
                <td>{revereCampus[tranaction.campus]}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td>
              {transactions.length > 0 ? "fetching..." : "No Transaction yet"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Table;
