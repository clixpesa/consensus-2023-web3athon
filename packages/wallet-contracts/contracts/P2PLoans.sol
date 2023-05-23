// SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct LoanDetails {
    string loanId;
    IERC20 token;
    address payable initiator;
    string initiatorName;
    uint256 principal;
    uint256 interest;
    uint256 minDuration;
    uint256 maxDuration;
    bool isPrivate;
}

contract P2PLoan {
    using SafeMath for uint256;

    enum LoanState {
        isActive,
        isPending,
        isClosed,
        isDefaulted
    }

    //P2PLoan structs
    struct LoanParticipants {
        string borrowerName;
        address payable borrower;
        string lenderName;
        address payable lender;
    }

    struct P2PLoanDetails {
        LoanDetails LD;
        LoanParticipants LP;
        LoanState LS;
        uint256 currentBalance;
        uint256 deadline;
    }

    //List of all P2PLoans
    P2PLoanDetails[] allP2PLoans;
    mapping(string => uint256) p2pLoanIndex;
    mapping(address => P2PLoanDetails[]) myP2PLoans;
    mapping(address => mapping(string => uint256)) myP2PLoanIdx;

    //List of all Offers
    LoanDetails[] allOffers;
    mapping(string => uint256) offerIndex;
    mapping(address => LoanDetails[]) myOffers;
    mapping(address => mapping(string => uint256)) myOfferIdx;
    //List of all Requests
    LoanDetails[] allRequests;
    mapping(string => uint256) requestIndex;
    mapping(address => LoanDetails[]) myRequests;
    mapping(address => mapping(string => uint256)) myRequestIdx;

    //P2PLoan events
    event CreatedLoanRequest(address borrower, LoanDetails LD);
    event CreatedLoanOffer(address lender, LoanDetails LD);
    event FundedP2PLoan(address funder, string loanId, uint256 amount);
    event RepaidP2PLoan(address repayer, string loanId, uint256 amount);
    event CreatedP2PLoan(address initiator, LoanDetails LD);

    constructor() {}
}
