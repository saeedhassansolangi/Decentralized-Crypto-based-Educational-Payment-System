// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MUET is ERC20 {
    address public muetTokenAddr;

    constructor(address owner, uint256 initialSupply)
        ERC20("MUET", "MUETCOIN")
    {
        _mint(owner, initialSupply);
        muetTokenAddr = address(this);
    }
}

