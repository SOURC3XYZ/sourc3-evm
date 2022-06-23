// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Sourc3 {
    uint64 lastRepoId_ = 1;
    uint64 lastOrganizationId_ = 1;
    uint64 lastProjectId_ = 1;

    struct Organization {
        string name_;
        address creator_;
    }

    struct Project {
        string name_;
        address creator_;
        uint64 organizationId_;
    }

    struct Repo {
        string name_;
        address creator_;
        uint64 projectId_;
        uint64 curObjsNumber_;
        bytes32 nameHash_;
    }

    mapping (uint64 => Organization) organizations_;
    mapping (uint64 => Project) projects_;
    mapping (uint64 => Repo) repos_;

    constructor() public {
    }

    function createOrganization(string memory name) public {
        //msg.sender
    }

    function modifyOrganization() public {
    }

    function removeOrganzation() public {
    }

    function createProject(string memory name, uint64 organizationId) public {
    }

    function modifyProject() public {
    }

    function removeProject() public {
    }

    function createRepo(string memory name, uint64 projectId) public {
    }

    function modifyRepo() public {
    }

    function removeRepo() public {
    }
}
