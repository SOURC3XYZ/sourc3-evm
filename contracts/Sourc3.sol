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

    struct Repo {
        string name_;
        address creator_;
        uint64 projectId_;
        uint64 curObjsNumber_;
        uint64 curMetasNumber_;
        bytes32 nameHash_;
        string state_;

        mapping (address => uint8) memberInfo_;
    }

    uint64 organizationsNumber_ = 0;
    uint64 projectsNumber_ = 0;
    uint64 reposNumber_ = 0;
    
    mapping (uint64 => Organization) organizations_;
    mapping (uint64 => Project) projects_;
    mapping (uint64 => Repo) repos_;

    function createOrganization(string memory name) public {
        // TODO maybe check organization name
        uint64 id = lastOrganizationId_++;
        organizations_[id].name_ = name; 
        organizations_[id].creator_ = msg.sender;
        // TODO check this
        organizations_[id].memberInfo_[msg.sender] = 1; // all permissions

        organizationsNumber_++;
    }

    function modifyOrganization(uint64 organizationId, string memory name) public {
    }

    function removeOrganzation(uint64 organizationId) public {
    }

    function createProject(string memory name, uint64 organizationId) public {
        // TODO check to exist organization
        require(organizationId < lastOrganizationId_);
        uint64 id = lastProjectId_++;
        projects_[id].name_ = name;
        projects_[id].creator_ = msg.sender;
        projects_[id].organizationId_ = organizationId;
        // TODO check this
        projects_[id].memberInfo_[msg.sender] = 1; // all permissions

        projectsNumber_++;
    }

    function modifyProject(string memory name, uint64 organizationId, uint64 projectId) public {
    }

    function removeProject(uint64 projectId) public {
    }

    function createRepo(string memory name, uint64 projectId) public {
        // TODO check to exist project
        require(projectId < lastProjectId_);
        uint64 id = lastRepoId_++;
        repos_[id].name_ = name;
        repos_[id].creator_ = msg.sender;
        repos_[id].projectId_ = projectId;
        repos_[id].curObjsNumber_ = 0;
        // TODO check this
        repos_[id].memberInfo_[msg.sender] = 1; // all permissions

        reposNumber_++;
    }

    function modifyRepo(string memory name, uint64 repoId) public {
    }

    function removeRepo(uint64 repoId) public {
    }

    //

    function pushState(uint64 repoId, uint64 objsCount, uint64 metasCount, string memory expectedState, string memory state) public {
        require(repoId < lastRepoId_ && repos_[repoId].projectId_ > 1);
        // TODO check permissions
        require(isStringEqual(expectedState, repos_[repoId].state_));
        repos_[repoId].curObjsNumber_ += objsCount;
        repos_[repoId].curMetasNumber_ += metasCount;
        repos_[repoId].state_ = state;
    }

    function loadState(uint64 repoId) view public returns (string memory state, uint64 curObjects, uint64 curMetas) {
        require(repos_[repoId].projectId_ > 1);
        state = repos_[repoId].state_;
        curObjects = repos_[repoId].curObjsNumber_;
        curMetas = repos_[repoId].curMetasNumber_;
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
    function getMyRepos() public view returns (uint64[] memory ids, string[] memory names) {
        uint64 count = 0;
        for (uint64 i = 1; i < lastRepoId_; i++) {
            if (repos_[i].creator_ == msg.sender) {
                count++;
            }
        }

        ids = new uint64[](count);
        names = new string[](count);
        uint j = 0;
        for (uint64 i = 1; i < lastRepoId_; i++) {
            if (repos_[i].creator_ == msg.sender) {
                ids[j] = i;
                names[j] = repos_[i].name_;
                ++j;
            }
        }
    }

    function getReposList() public view returns (uint64[] memory ids, string[] memory names, uint64[] memory projectIds, uint64[] memory curObjcts, address[] memory creators) {
        ids = new uint64[](reposNumber_);
        names = new string[](reposNumber_);
        projectIds = new uint64[](reposNumber_);
        curObjcts = new uint64[](reposNumber_);
        creators = new address[](reposNumber_);

        for (uint64 i = 1; i < lastRepoId_; i++) {
            ids[i-1] = i;
            names[i-1] = repos_[i].name_;
            projectIds[i-1] = repos_[i].projectId_;
            curObjcts[i-1] = repos_[i].curObjsNumber_;
            creators[i-1] = repos_[i].creator_;
        }
    }

    function getRepoId(address owner, string memory name) public view returns (uint64) {
        for (uint64 id = 1; id < lastRepoId_; id++) {
            if (repos_[id].creator_ == owner && isStringEqual(repos_[id].name_, name)) {
                return id;
            }
        }
        return 0;
    }

    function getProjectId(address owner, string memory name) public view returns (uint64) {
        for (uint64 id = 1; id < lastProjectId_; id++) {
            if (projects_[id].creator_ == owner && isStringEqual(projects_[id].name_, name)) {
                return id;
            }
        }
        return 0;
    }

    function getOrganizationId(address owner, string memory name) public view returns (uint64) {
        for (uint64 id = 1; id < lastOrganizationId_; id++) {
            if (organizations_[id].creator_ == owner && isStringEqual(organizations_[id].name_, name)) {
                return id;
            }
        }
        return 0;
    }

    function getProjectsList() public view returns (uint64[] memory ids, uint64[] memory orgIds, string[] memory names, address[] memory creators) {
        ids = new uint64[](projectsNumber_);
        orgIds = new uint64[](projectsNumber_);
        names = new string[](projectsNumber_);
        creators = new address[](projectsNumber_);
        for (uint64 i = 1; i < lastProjectId_; i++) {
            ids[i - 1] = i;
            orgIds[i - 1] = projects_[i].organizationId_;
            names[i - 1] = projects_[i].name_;
            creators[i - 1] = projects_[i].creator_;
        }
    }

    function getReposListOfProject(uint64 projectId) public view {} // id, name, curObjects, creator or owner?

    function getMembersListOfProject(uint64 projectId) public view {} // address, permissions

    function getOrganizationsList() public view returns (uint64[] memory ids, string[] memory names, address[] memory creators) {
        ids = new uint64[](organizationsNumber_);
        names = new string[](organizationsNumber_);
        creators = new address[](organizationsNumber_);
        for (uint64 i = 1; i < lastOrganizationId_; i++) {
            ids[i - 1] = i;
            names[i - 1] = organizations_[i].name_;
            creators[i - 1] = organizations_[i].creator_;
        }
    }

    function getProjectsListOfOrganization(uint64 organizationId) public view {} // id, name, creator

    function getMembersListOfOrganization(uint64 organizationId) public view {} // address, permissions

    function isStringEqual(string memory first,string memory second) pure public returns (bool) {
        return (keccak256(bytes(first)) == keccak256(bytes(second)));
    }
}
