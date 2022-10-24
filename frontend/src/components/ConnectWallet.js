import { ConnectButton } from "@web3uikit/web3";
import React from "react";

function ConnectWallet() {
  return (
    <div className="wallet-style bg-color">
      <span> MetaMask Wallet not Connected</span>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}

export default ConnectWallet;
