const Sourc3 = artifacts.require("Sourc3");
const truffleAssert = require('truffle-assertions');

contract("Sourc3", (accounts) => {
    let contract;

    describe("test unknown items", () => {
        beforeEach(async () => {
            contract = await Sourc3.new();
        });

        it("try to create project with fake organization", async () => {
            const creator = accounts[0];
            const organizationId = 1;
            const projectName = "project";
    
            await truffleAssert.reverts(contract.createProject(projectName, organizationId, {from: creator}), "Organization should be specified");
        });
    
        it("try to create repo with fake project", async () => {
            const creator = accounts[0];
            const projectId = 1;
            const repoName = "repo";
    
            await truffleAssert.reverts(contract.createRepo(repoName, projectId, {from: creator}), "Project should be specified");
        });
    
        it("try to remove unknown organization", async () => {
            const creator = accounts[0];
            const id = 1;
    
            await truffleAssert.reverts(contract.removeOrganization(id, {from: creator}), "Unknown organization");
        });
    
        it("try to remove unknown project", async () => {
            const creator = accounts[0];
            const id = 1;
    
            await truffleAssert.reverts(contract.removeProject(id, {from: creator}), "Unknown project");
        });
    
        it("try to remove unknown repository", async () => {
            const creator = accounts[0];
            const id = 1;
    
            await truffleAssert.reverts(contract.removeRepo(id, {from: creator}), "Unknown repository");
        });
    
        it("try to modify unknown organization", async () => {
            const creator = accounts[0];
            const id = 1;
    
            await truffleAssert.reverts(contract.modifyOrganization(id, "test", {from: creator}), "Unknown organization");
        });
    
        it("try to modify unknown project", async () => {
            const creator = accounts[0];
            const id = 1;
    
            await truffleAssert.reverts(contract.modifyProject(id, "test", {from: creator}), "Unknown project");
        });
    
        it("try to modify unknown repository", async () => {
            const creator = accounts[0];
            const id = 1;
    
            await truffleAssert.reverts(contract.modifyRepo(id, "test", {from: creator}), "Unknown repository");
        });
    
        it("try to push state to unknown repository", async () => {
            const creator = accounts[0];
            const id = 1;
    
            await truffleAssert.reverts(contract.pushState(id, 1, 1, "", "test", {from: creator}), "Unknown repository");
        });
    
        it("try to load state of unknown repository", async () => {
            const creator = accounts[0];
            const id = 1;
    
            await truffleAssert.reverts(contract.loadState(id, {from: creator}), "Unknown repository");
        });
    });

    describe("test repository", () => {
        const creator = accounts[0];
        const organizationName = "organization";
        const projectName = "project";
        const repoName = "repo";

        let organizationId;
        let projectId;
        let repoId;

        beforeEach(async () => {
            contract = await Sourc3.new();

            await contract.createOrganization(organizationName, {from: creator});
            organizationId = await contract.getOrganizationId(creator, organizationName);

            await contract.createProject(projectName, organizationId, {from: creator});
            projectId = await contract.getProjectId(creator, projectName);
            
            await contract.createRepo(repoName, projectId, {from: creator});
            repoId = await contract.getRepoId(creator, repoName);
        });

        it("create organization, project, repository", async () => {
            let repos = await contract.getReposList();
    
            assert.isTrue(repos.ids.length == 1);
        });

        it("modify organization, project, repository", async () => {
            const newOrganizationName = "organization2";
            const newProjectName = "project2";
            const newRepoName = "repo2";
    
            // modify organization
            await contract.modifyOrganization(organizationId, newOrganizationName, {from: creator});
            let newOrganizationId = await contract.getOrganizationId(creator, newOrganizationName);
    
            assert.equal(organizationId.toNumber(), newOrganizationId.toNumber());
    
            // modify project
            await contract.modifyProject(projectId, newProjectName, {from: creator});
            let newProjectId = await contract.getProjectId(creator, newProjectName);
    
            assert.equal(projectId.toNumber(), newProjectId.toNumber());
    
            // modify repository
            await contract.modifyRepo(repoId, newRepoName, {from: creator});
            let newRepoId = await contract.getRepoId(creator, newRepoName);
    
            assert.equal(repoId.toNumber(), newRepoId.toNumber());
        });

        it("push state", async () => {
            const state = "test state";
            const objsCount = 1;
            const metasCount = 1;
            let result = await contract.loadState(repoId);

            assert.equal("", result.state);
            assert.equal(0, result.curObjects.toNumber());
            assert.equal(0, result.curMetas.toNumber());

            await contract.pushState(repoId, objsCount, metasCount, "", state, {from: creator});
            result = await contract.loadState(repoId);

            assert.equal(state, result.state);
            assert.equal(objsCount, result.curObjects.toNumber());
            assert.equal(metasCount, result.curMetas.toNumber());

            const newState = "new state";

            await contract.pushState(repoId, objsCount, metasCount, state, newState, {from: creator});
            result = await contract.loadState(repoId);

            assert.equal(newState, result.state);
            assert.equal(objsCount + objsCount, result.curObjects.toNumber());
            assert.equal(metasCount + metasCount, result.curMetas.toNumber());
        });

        it("try to push failed state", async () => {
            const state = "test state";
            const newState = "new state";
            const objsCount = 1;
            const metasCount = 1;
            await contract.pushState(repoId, objsCount, metasCount, "", state, {from: creator});

            await truffleAssert.reverts(contract.pushState(repoId, objsCount, metasCount, "", newState, {from: creator}), "wrong expected state");
        });

        it("remove repository, project, organiztion", async () => {
            await contract.removeRepo(repoId);

            let repos = await contract.getReposList();
    
            assert.isTrue(repos.ids.length == 0);

            await contract.removeProject(projectId);

            await contract.removeOrganization(organizationId);

            let organizations = await contract.getOrganizationsList();

            assert.isTrue(organizations.ids.length == 0);
        });

        it("try to remove not empty project", async () => {
            await truffleAssert.reverts(contract.removeProject(projectId), "Project should be empty");
        });

        it("try to remove not empty organization", async () => {
            await truffleAssert.reverts(contract.removeOrganization(organizationId), "Organization should be empty");
        });

        it("try to create an organization with non-unique name", async () => {
            await truffleAssert.reverts(contract.createOrganization(organizationName, {from: creator}), "Organization name should be unique");
        });

        it("try to rename organization to non-unique name", async () => {
            const newOrganizationName = "organization 2";

            await contract.createOrganization(newOrganizationName, {from: creator})

            let newOrganizationId = await contract.getOrganizationId(creator, newOrganizationName);

            await truffleAssert.reverts(contract.modifyOrganization(newOrganizationId, organizationName, {from: creator}), "Organization name should be unique");
        });

        it("try to create, remove and create organization with same name", async () => {
            const newOrganizationName = "organization 2";

            await contract.createOrganization(newOrganizationName, {from: creator})

            let newOrganizationId = await contract.getOrganizationId(creator, newOrganizationName);

            await contract.removeOrganization(newOrganizationId, {from: creator});

            await contract.createOrganization(newOrganizationName, {from: creator})
        });

        it("try to create a project with non-unique name", async () => {
            await truffleAssert.reverts(contract.createProject(projectName, organizationId, {from: creator}), "Project name should be unique");
        });

        it("try to rename project to non-unique name", async () => {
            const newProjectName = "project 2";

            await contract.createProject(newProjectName, organizationId, {from: creator})

            let newProjectId = await contract.getProjectId(creator, newProjectName);

            await truffleAssert.reverts(contract.modifyProject(newProjectId, projectName, {from: creator}), "Project name should be unique");
        });

        it("try to create, remove and create project with same name", async () => {
            const newProjectName = "project 2";

            await contract.createProject(newProjectName, organizationId, {from: creator})

            let newProjectId = await contract.getProjectId(creator, newProjectName);

            await contract.removeProject(newProjectId, {from: creator});

            await contract.createProject(newProjectName, organizationId, {from: creator})
        });

        it("try to create a repository with non-unique name", async () => {
            await truffleAssert.reverts(contract.createRepo(repoName, projectId, {from: creator}), "Repository name should be unique");
        });

        it("try to rename repository to non-unique name", async () => {
            const newRepoName = "repo 2";

            await contract.createRepo(newRepoName, projectId, {from: creator})

            let newRepoId = await contract.getRepoId(creator, newRepoName);

            await truffleAssert.reverts(contract.modifyRepo(newRepoId, repoName, {from: creator}), "Repository name should be unique");
        });

        it("try to create, remove and create repository with same name", async () => {
            const newRepoName = "repo 2";

            await contract.createRepo(newRepoName, projectId, {from: creator})

            let newRepoId = await contract.getRepoId(creator, newRepoName);

            await contract.removeRepo(newRepoId, {from: creator});

            await contract.createRepo(newRepoName, projectId, {from: creator})
        });
    });
});
