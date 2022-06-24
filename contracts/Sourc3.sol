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

    struct GitRef {
        bytes20 commitHash_;
        string name_;
    }
    
    struct PackedObject {
        uint8 type_;
        bytes20 hash_;
        bytes data_;
    }
    
    mapping (uint64 => Organization) organizations_;
    mapping (uint64 => Project) projects_;
    mapping (uint64 => Repo) repos_;

    constructor() public {
    }

    function createOrganization(string memory name) public {
        //msg.sender
    }

    function modifyOrganization(uint64 organizationId, string memory name) public {
    }

    function removeOrganzation(uint64 organizationId) public {
    }

    function createProject(string memory name, uint64 organizationId) public {
    }

    function modifyProject(string memory name, uint64 organizationId, uint64 projectId) public {
    }

    function removeProject(uint64 projectId) public {
    }

    function createRepo(string memory name, uint64 projectId) public {
    }

    function modifyRepo(string memory name, uint64 repoId) public {
    }

    function removeRepo(uint64 repoId) public {
    }

    //

    function pushRefs(uint64 repoId, GitRef[] memory refs) public {
    }

    function pushObjects(uint64 repoId, PackedObject[] memory objects) public {}

    // Repo member

    function addRepoMember(uint64 repoId, address member, uint8 permissions) public {}

    function modifyRepoMember(uint64 repoId, address member, uint8 permissions) public {}

    function removeRepoMeber(uint64 repoId, address member) public {}

    // project member

    function addProjectMember(uint64 projectId, address member, uint8 permissions) public {}

    function modifyProjectMember(uint64 projectId, address member, uint8 permissions) public {}

    function removeProjectMember(uint64 projectId, address member) public {}

    // organization member
    function addOrganizationMember(uint64 organizationId, address member, uint8 permissions) public {}

    function modifyOrganizationMember(uint64 organizationId, address member, uint8 permissions) public {}

    function removeOrganizationMember(uint64 organizationId, address member) public {}
}
