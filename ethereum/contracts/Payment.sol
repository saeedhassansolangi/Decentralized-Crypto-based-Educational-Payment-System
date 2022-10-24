// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./MUET.sol";

contract Payment is MUET {

    uint private constant ETH_PRICE_FOR_PKR = 0.0015 ether;
    address private i_owner;
    StudentDetail[] public feesTransactions;

    mapping(uint => mapping(uint => SemesterDetail)) public semesterDetails;
    mapping(address => StudentDetail[]) public s_studentDetails;

    enum Campus { MUET_JAMSHORO, MUET_SZAB_KHAIRPUR }
    enum ProgramType { BE, ME }
    enum FeeType { EXAMINATION_FEE, ADMINSSION_FEE, OTHERS }

    event PaymentPay(address std_addr, uint amount, FeeType feeType);
    event SemesterDetailsUpdated(uint semester, uint batch, uint amount);

     struct SemesterDetail {
        uint semester; uint batch;
        uint amount;  uint stardDate;
        uint lastDate; FeeType feeType;
        ProgramType programType;
    }


    struct StudentDetail {
        address walletAddress; uint amount;
        uint semester; uint batch;
        string stdId;  uint dueDate;
        FeeType feeType; ProgramType programType;
        Campus campus;
    }

    constructor(uint256 initialSupply) MUET(msg.sender, initialSupply) {
        i_owner = msg.sender;
    }

    function pay(
        uint amount,
        uint semester,
        FeeType _feeType,
        uint batch,
        string calldata stdId,
        ProgramType _proramType,
        Campus _campus
    )
        public
        checkDetails(_feeType, _proramType, amount)
        isSemesterAlreadyAdded(semester, batch)
    {
        require(
            balanceOf(msg.sender) >= amount * 1e18,
            "You don't have enough balance"
        );

        transfer(address(this), amount * 1e18);

        StudentDetail memory newStudentDetail = StudentDetail(
            msg.sender,
            amount,
            semester,
            batch,
            stdId,
            block.timestamp,
            _feeType,
            _proramType,
            _campus
        );

        s_studentDetails[msg.sender].push(newStudentDetail);
        feesTransactions.push(newStudentDetail);
        emit PaymentPay(msg.sender, amount, _feeType);
    }

    function addSemesterDetails(
        uint _semester,
        uint _batch,
        uint _amount,
        FeeType _feeType,
        ProgramType _programType
    )
        public
        checkDetails(_feeType, _programType, _amount)
        isSemesterNotAlreadyAdded(_semester, _batch)
        onlyOnwer
    {
        semesterDetails[_semester][_batch] = SemesterDetail(
            _semester,
            _batch,
            _amount * 1e18,
            block.timestamp,
            block.timestamp + 7 days,
            _feeType,
            _programType
        );
    }

    function updateSemesterDetails(
        uint _semester,
        uint _batch,
        uint _amount,
        FeeType _feeType,
        ProgramType _programType
    )
        public
        checkDetails(_feeType, _programType, _amount)
        isSemesterAlreadyAdded(_semester, _batch)
        onlyOnwer
    {
        semesterDetails[_semester][_batch].amount = _amount * 1e18;
        semesterDetails[_semester][_batch].semester = _semester;
        semesterDetails[_semester][_batch].batch = _batch;
        semesterDetails[_semester][_batch].feeType = _feeType;
        semesterDetails[_semester][_batch].programType = _programType;
        emit SemesterDetailsUpdated(_semester, _batch, _amount);
    }

    function getStudentDetails(address _address)
        public
        view
        returns (StudentDetail[] memory)
    {
        return s_studentDetails[_address];
    }

    function getTotalTransactions() public view returns (uint) {
        return feesTransactions.length;
    }

    function getAllTransactions() public view returns (StudentDetail[] memory) {
        return feesTransactions;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function buyTokens(address _to, uint amount) public payable {
        require(_to != address(0), "ERC20: mint to the zero address");
        require(msg.value >= amount * ETH_PRICE_FOR_PKR , "Not enough ETH");
        _mint(_to, amount * 1e18);
    }

    modifier checkDetails(
        FeeType _feeType,
        ProgramType _programType,
        uint amount
    ) {
        require(
            _feeType == FeeType.EXAMINATION_FEE ||
                _feeType == FeeType.ADMINSSION_FEE ||
                _feeType == FeeType.OTHERS,
            "Invalid fee type"
        );

        require(
            _programType == ProgramType.BE || _programType == ProgramType.ME,
            "Invalid program type"
        );

        require(amount > 0, "amount can't be zero");
        _;
    }

    modifier onlyOnwer() {
        require(msg.sender == i_owner, "Only owner can perform this action");
        _;
    }

    modifier isSemesterAlreadyAdded(uint _semester, uint _batch) {
        require(
            semesterDetails[_semester][_batch].semester == _semester &&
                semesterDetails[_semester][_batch].batch == _batch,
            "Semester and batch not already added"
        );
        _;
    }

    modifier isSemesterNotAlreadyAdded(uint _semester, uint _batch) {
        require(
            semesterDetails[_semester][_batch].semester != _semester &&
                semesterDetails[_semester][_batch].batch != _batch,
            "Semester and batch already added"
        );
        _;
    }
}
