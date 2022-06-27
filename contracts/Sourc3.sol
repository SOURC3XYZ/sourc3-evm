// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Sourc3 {
    uint64 lastRepoId_ = 1;
    uint64 lastOrganizationId_ = 1;
    uint64 lastProjectId_ = 1;

    struct Organization {
        string name_;
        address creator_;

        mapping (address => uint8) memberInfo_;
    }

    struct Project {
        string name_;
        address creator_;
        uint64 organizationId_;

        mapping (address => uint8) memberInfo_;
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

    struct Meta {
        //uint64 id_;
        uint8 type_;
        bytes20 hash_;
        uint32 dataSize_;
    }

    struct Repo {
        string name_;
        address creator_;
        uint64 projectId_;
        uint64 curObjsNumber_;
        bytes32 nameHash_;

        mapping (address => uint8) memberInfo_;
        mapping (bytes32 => GitRef) refs_; // ????
        mapping (uint64 => Meta) metas_;
        mapping (bytes20 => bytes) data_;
    }
    
    mapping (uint64 => Organization) organizations_;
    mapping (uint64 => Project) projects_;
    mapping (uint64 => Repo) repos_;

    constructor() public {
    }

    function createOrganization(string memory name) public {
        uint64 id = lastOrganizationId_++;
        organizations_[id].name_ = name; 
        organizations_[id].creator_ = msg.sender;
        // TODO check this
        organizations_[id].memberInfo_[msg.sender] = 1; // all permissions
    }

    function modifyOrganization(uint64 organizationId, string memory name) public {
    }

    function removeOrganzation(uint64 organizationId) public {
    }

    function createProject(string memory name, uint64 organizationId) public {
        uint64 id = lastProjectId_++;
        projects_[id].name_ = name;
        projects_[id].creator_ = msg.sender;
        projects_[id].organizationId_ = organizationId;
        // TODO check this
        projects_[id].memberInfo_[msg.sender] = 1; // all permissions
    }

    function modifyProject(string memory name, uint64 organizationId, uint64 projectId) public {
    }

    function removeProject(uint64 projectId) public {
    }

    function createRepo(string memory name, uint64 projectId) public {
        uint64 id = lastRepoId_++;
        repos_[id].name_ = name;
        repos_[id].creator_ = msg.sender;
        repos_[id].projectId_ = projectId;
        repos_[id].curObjsNumber_ = 0;
        // TODO check this
        repos_[id].memberInfo_[msg.sender] = 1; // all permissions
    }

    function modifyRepo(string memory name, uint64 repoId) public {
    }

    function removeRepo(uint64 repoId) public {
    }

    //

    function pushRefs(uint64 repoId, GitRef[] memory refs) public {
        // TODO check permissions
        for (uint i = 0; i < refs.length; i++) {
            repos_[repoId].refs_[sha256(bytes(refs[i].name_))] = refs[i];
        }
    }

    function pushObjects(uint64 repoId, PackedObject[] memory objects) public {
        // TODO check permissions
        for (uint i = 0; i < objects.length; i++) {
            uint64 id = repos_[repoId].curObjsNumber_++;
            repos_[repoId].metas_[id].type_ = objects[i].type_;
            repos_[repoId].metas_[id].hash_ = objects[i].hash_;
            repos_[repoId].metas_[id].dataSize_ = uint32(objects[i].data_.length);

            repos_[repoId].data_[objects[i].hash_] = objects[i].data_;
        }
    }

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

    /////////////////////////////////////////////////////////////////
    function myRepos() public view {} //id, name of each repo

    function allRepos() public view {} //id, name, projectId, curObjects, repoOwner of each repo

    function refsList() public view {} //name, commitHash

    function repoId(address  owner, string memory name) public view {}

    function projectId(address  owner, string memory name) public view {}

    function organizationId(address  owner, string memory name) public view {}

    function getRepoData(uint64 repoId, uint64 objId) public view {}

    function getRepoMeta(uint64 repoId) public view {} // list of {hash, type, size}

    function getCommit(uint64 repoId, uint64 objId) public view {} // use mygit2. ????

    // function getCommitFromData() // ??????
    // function getTree() // ??????
    // function getTreeFromData() // ??????

    function getCommits(uint64 repoId) public view {} // hash, size, type

    function getTrees(uint64 repoId) public view {} // hash, size, type

    function projectsList() public view {} //id, organizationId, name, creator

    function projectReposList(uint64 projectId) public view {} // id, name, curObjects, creator or owner?

    function projectMembersList(uint64 projectId) public view {} // address, permissions

    function organizationsList() public view {} // id, name, creator

    function organizationProjectsList(uint64 organizationId) public view {} // id, name, creator

    function organizationMembersList(uint64 organizationId) public view {} // address, permissions
}
