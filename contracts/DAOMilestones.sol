// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

error INVALID_AMOUNT_PASSED();
error INVALID_TIMESTAMP_PASSED();
error PROJECT_ALREADY_SET();
error MILESTONE_ALREADY_CLOSE();
error PROJECT_NOT_SET();
error MILESTONE_NOT_REACHED();
error MILESTONE_ALREADY_REVOKED();
error INVALID_ID();

struct Milestone {
    bool closed;
    bool approved;
    uint256 timestamp;
    uint256 amount;
}

struct Project {
    bool hasStarted;
    bool isRevoked;
    address payable beneficiary;
    bytes document;
    Milestone[] milestones;
    uint256 totalAmount;
    uint256 totalPayout;
}

contract DAOMilestones is Ownable {
    Project[] private _projects;

    event Initialized(uint256 indexed id, Project project);
    event Deposit(uint256 indexed id, uint256 amount);
    event Revoke(uint256 indexed id, address indexed to);
    event Resolve(uint256 indexed idP, uint256 indexed idM, bool approve);

    constructor(address daoAgent) Ownable() {
        transferOwnership(daoAgent);
    }

    modifier whenNotStarted(uint256 id) {
        _whenNotStarted(id);
        _;
    }

    modifier whenStarted(uint256 id) {
        _whenStarted(id);
        _;
    }

    modifier whenNotRevoked(uint256 id) {
        _whenNotRevoked(id);
        _;
    }

    function setProject(
        address payable beneficiary,
        Milestone[] memory milestones,
        bytes memory document
    ) external onlyOwner {
        uint256 length = milestones.length;
        // get earliest realease time
        uint256 time = milestones[0].timestamp;
        uint256 id = _projects.length;

        Project storage p = _projects[id];
        p.beneficiary = beneficiary;
        p.document = document;

        for (uint256 i = 0; i < length; i++) {
            Milestone memory m = milestones[i];
            if (m.timestamp < time) revert INVALID_TIMESTAMP_PASSED();
            time = m.timestamp;
            p.milestones.push(m);

            unchecked {
                p.totalAmount += m.amount;
            }
        }
        emit Initialized(id, p);
    }

    function deposit(uint256 id)
        external
        payable
        onlyOwner
        whenNotStarted(id)
        whenNotRevoked(id)
    {
        Project storage _p = _projects[id];
        Project memory p = _projects[id];
        uint256 total = p.totalAmount;
        uint256 value = msg.value;

        if (value != total) revert INVALID_AMOUNT_PASSED();
        _p.hasStarted = true;
        emit Deposit(id, value);
    }

    function resolveMilestone(
        uint256 idP,
        uint256 idM,
        bool approve,
        address payable to
    ) external onlyOwner whenStarted(idP) whenNotRevoked(idP) {
        Project storage _p = _projects[idP];
        Project memory p = _projects[idP];

        Milestone storage _m = _p.milestones[idM];
        Milestone memory m = p.milestones[idM];

        uint256 time = block.timestamp;

        if (!m.closed) revert MILESTONE_ALREADY_CLOSE();

        _m.closed = true;

        if (approve) {
            if (time < m.timestamp) revert MILESTONE_NOT_REACHED();
            _m.approved = true;
            _p.totalPayout += m.amount;
            (bool success, ) = p.beneficiary.call{value: m.amount}("");
            require(success, "FAILED_TO_TRANSFER_FUNDS");
        } else {
            (bool success, ) = to.call{value: m.amount}("");
            require(success, "FAILED_TO_TRANSFER_FUNDS");
        }
        emit Resolve(idP, idM, approve);
    }

    function revokeProject(uint256 id, address payable to)
        external
        onlyOwner
        whenStarted(id)
        whenNotRevoked(id)
    {
        Project memory p = _projects[id];
        Project storage _p = _projects[id];

        _p.isRevoked = true;

        if (p.hasStarted) {
            uint256 val = p.totalAmount - p.totalPayout;
            (bool success, ) = to.call{value: val}("");
            require(success);
        }
        emit Revoke(id, to);
    }

    function getProjects() external view returns (Project[] memory) {
        return _projects;
    }

    function getProject(uint256 id) external view returns (Project memory) {
        uint256 length = _projects.length;

        if (length < id) revert INVALID_ID();
        return _projects[id];
    }

    function _whenNotStarted(uint256 id) private view {
        bool isSet = _projects[id].hasStarted;
        if (isSet) revert PROJECT_ALREADY_SET();
    }

    function _whenStarted(uint256 id) private view {
        bool isSet = _projects[id].hasStarted;
        if (!isSet) revert PROJECT_NOT_SET();
    }

    function _whenNotRevoked(uint256 id) private view {
        bool isSet = _projects[id].isRevoked;
        if (!isSet) revert MILESTONE_ALREADY_REVOKED();
    }
}
