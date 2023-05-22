// SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.7;
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";


struct SpaceDetails {
    IERC20Upgradeable token;
    address payable owner;
    string spaceName;
    string imgLink;
    string spaceId;
    uint256 goalAmount;
    uint256 deadline;
}

contract Personal {
    using SafeMathUpgradeable for uint256;

    struct PersonalDetails {
        SpaceDetails SD;
        uint256 currentBalance;
    }

    //List of all Personal Spaces
    PersonalDetails[] allPersonalSpaces;
    mapping(string => uint256) personalSpaceIndex;
    mapping(address => PersonalDetails[]) myPersonalSpaces;
    mapping(address => mapping(string => uint256)) myPersonalSpaceIdx;

    //Personal Space events
    event CreatedPersonalSpace(address owner, SpaceDetails SD);
    event FundedPersonalSpace(address funder, string spaceId, uint256 amount);
    event WithdrawnPersonalSpace(
        address withdrawer,
        string spaceId,
        uint256 amount
    );
    event UpdatedPersonalSpace(PersonalDetails PD);

    enum PersonalState {
        isActive,
        isEnded,
        isInActive,
        isFullyFunded
    }

   

    function createPersonalSpace(SpaceDetails memory _SD) external {
        require(msg.sender == _SD.owner, "Must be owner");
        require(personalSpaceIndex[_SD.spaceId] == 0, "SpaceId already exists");
        require(
            myPersonalSpaceIdx[msg.sender][_SD.spaceId] == 0,
            "SpaceId already exists"
        );
        require(_SD.owner != address(0), "Owner cannot be 0 address");
        require(_SD.token != IERC20Upgradeable(address(0)), "Token cannot be 0 address");
        require(bytes(_SD.spaceName).length > 0, "Name cannot be empty");
        require(_SD.deadline > block.timestamp, "Deadline must be in future");
        require(_SD.goalAmount > 0, "Goal must be greater than 0");

        PersonalDetails memory _PD = PersonalDetails(_SD, 0);

        allPersonalSpaces.push(_PD);
        personalSpaceIndex[_SD.spaceId] = allPersonalSpaces.length;
        myPersonalSpaces[msg.sender].push(_PD);
        myPersonalSpaceIdx[msg.sender][_SD.spaceId] = myPersonalSpaces[
            msg.sender
        ].length;
        emit CreatedPersonalSpace(msg.sender, _SD);
    }

    function getAllPersonalSpaces()
        external
        view
        returns (PersonalDetails[] memory)
    {
        return allPersonalSpaces;
    }

    function getPersonalSpaceById(
        string memory _spaceId
    ) external view returns (PersonalDetails memory) {
        return allPersonalSpaces[personalSpaceIndex[_spaceId].sub(1)];
    }

    function getPersonalSpacesByOwner(
        address _owner
    ) external view returns (PersonalDetails[] memory) {
        return myPersonalSpaces[_owner];
    }

    function getMyPersonalSpaces()
        external
        view
        returns (PersonalDetails[] memory)
    {
        return myPersonalSpaces[msg.sender];
    }

    function doesPersonalSpaceExist(
        address owner,
        string memory _spaceId
    ) external view returns (bool isExistent) {
        if (personalSpaceIndex[_spaceId] == 0) {
            return false;
        }
        if (myPersonalSpaceIdx[owner][_spaceId] == 0) {
            return false;
        }
    }

    function updatePersonalSpace(SpaceDetails memory _SD) external {
        require(msg.sender == _SD.owner, "Must be owner");
        require(personalSpaceIndex[_SD.spaceId] != 0, "SpaceId does not exist");
        require(
            myPersonalSpaceIdx[msg.sender][_SD.spaceId] != 0,
            "SpaceId does not exist"
        );
        require(_SD.owner != address(0), "Owner cannot be 0 address");
        require(_SD.token != IERC20Upgradeable(address(0)), "Token cannot be 0 address");
        require(bytes(_SD.spaceName).length > 0, "Name cannot be empty");
        require(_SD.deadline > block.timestamp, "Deadline must be in future");
        require(_SD.goalAmount > 0, "Goal must be greater than 0");

        uint256 balance = allPersonalSpaces[
            personalSpaceIndex[_SD.spaceId].sub(1)
        ].currentBalance;

        PersonalDetails memory _PD = PersonalDetails(_SD, balance);
        allPersonalSpaces[personalSpaceIndex[_SD.spaceId].sub(1)] = _PD;
        myPersonalSpaces[msg.sender][
            myPersonalSpaceIdx[msg.sender][_SD.spaceId].sub(1)
        ] = _PD;

        emit UpdatedPersonalSpace(
            allPersonalSpaces[personalSpaceIndex[_SD.spaceId].sub(1)]
        );
    }

    function fundPersonalSpace(
        string memory _spaceId,
        uint256 _amount
    ) external {
        require(personalSpaceIndex[_spaceId] != 0, "SpaceId does not exist");
        require(
            myPersonalSpaceIdx[msg.sender][_spaceId] != 0,
            "SpaceId does not exist"
        );
        PersonalDetails memory _PD = allPersonalSpaces[
            personalSpaceIndex[_spaceId].sub(1)
        ];
        require(
            _PD.SD.deadline > block.timestamp,
            "Deadline must be in future"
        );
        require(_PD.SD.goalAmount > 0, "Goal must be greater than 0");
        require(_amount > 0, "Amount must be greater than 0");
        require(
            _PD.SD.token.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        //_PD.token.transferFrom(msg.sender, address(this), _amount);
        allPersonalSpaces[personalSpaceIndex[_spaceId].sub(1)]
            .currentBalance = _PD.currentBalance.add(_amount);
        myPersonalSpaces[msg.sender][
            myPersonalSpaceIdx[msg.sender][_spaceId].sub(1)
        ].currentBalance = _PD.currentBalance.add(_amount);

        emit FundedPersonalSpace(msg.sender, _spaceId, _amount);
    }

    function withdrawFromPersonalSpace(
        string memory _spaceId,
        uint256 _amount
    ) external {
        require(personalSpaceIndex[_spaceId] != 0, "SpaceId does not exist");
        require(
            myPersonalSpaceIdx[msg.sender][_spaceId] != 0,
            "SpaceId does not exist"
        );
        PersonalDetails memory _PD = allPersonalSpaces[
            personalSpaceIndex[_spaceId].sub(1)
        ];
        require(_PD.SD.owner == msg.sender, "Must be owner");
        require(_PD.SD.goalAmount > 0, "Goal must be greater than 0");
        require(_amount > 0, "Amount must be greater than 0");
        require(
            _PD.currentBalance >= _amount,
            "Amount must be less than current balance"
        );
        require(_PD.SD.token.transfer(msg.sender, _amount), "Transfer failed");
        allPersonalSpaces[personalSpaceIndex[_spaceId].sub(1)]
            .currentBalance = _PD.currentBalance.sub(_amount);
        myPersonalSpaces[msg.sender][
            myPersonalSpaceIdx[msg.sender][_spaceId].sub(1)
        ].currentBalance = _PD.currentBalance.sub(_amount);

        
        emit WithdrawnPersonalSpace(msg.sender, _spaceId, _amount);
    }

   function deletePersonalSpace(string memory _spaceId) external {
    require(personalSpaceIndex[_spaceId] != 0, "SpaceId does not exist");
    require(myPersonalSpaceIdx[msg.sender][_spaceId] != 0, "SpaceId does not exist");

    PersonalDetails memory _PD = allPersonalSpaces[personalSpaceIndex[_spaceId].sub(1)];
    require(_PD.SD.owner == msg.sender, "Must be owner");
    require(_PD.currentBalance >= _PD.SD.goalAmount, "Goal not reached");

    // Transfer the remaining balance to the owner
    if (_PD.currentBalance > 0) {
        require(_PD.SD.token.transfer(msg.sender, _PD.currentBalance), "Transfer failed");
    }

    // Delete the personal space
    uint256 index = personalSpaceIndex[_spaceId].sub(1);
    delete allPersonalSpaces[index];
    delete personalSpaceIndex[_spaceId];

    // Delete from owner's personal spaces
    uint256 ownerIndex = myPersonalSpaceIdx[msg.sender][_spaceId].sub(1);
    delete myPersonalSpaces[msg.sender][ownerIndex];
    delete myPersonalSpaceIdx[msg.sender][_spaceId];
}

        
}
