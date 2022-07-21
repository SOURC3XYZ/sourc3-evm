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

    describe("test normal case", () => {
        const creator = accounts[0];
        const organizationName = "organization";
        const projectName = "project";
        const repoName = "repo";

        beforeEach(async () => {
            contract = await Sourc3.new();

            await contract.createOrganization("organization", {from: creator});
            let organizationId = await contract.getOrganizationId(creator, organizationName);

            await contract.createProject(projectName, organizationId, {from: creator});
            let projectId = await contract.getProjectId(creator, projectName);
            
            await contract.createRepo(repoName, projectId, {from: creator});
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
            let organizationId = await contract.getOrganizationId(creator, organizationName);
    
            await contract.modifyOrganization(organizationId, newOrganizationName, {from: creator});
            let newOrganizationId = await contract.getOrganizationId(creator, newOrganizationName);
    
            assert.equal(organizationId.toNumber(), newOrganizationId.toNumber());
    
            // modify project
            let projectId = await contract.getProjectId(creator, projectName);
    
            await contract.modifyProject(projectId, newProjectName, {from: creator});
            let newProjectId = await contract.getProjectId(creator, newProjectName);
    
            assert.equal(projectId.toNumber(), newProjectId.toNumber());
    
            // modify repository
            let repoId = await contract.getRepoId(creator, repoName);
    
            await contract.modifyRepo(repoId, newRepoName, {from: creator});
            let newRepoId = await contract.getRepoId(creator, newRepoName);
    
            assert.equal(repoId.toNumber(), newRepoId.toNumber());
        });

        it("push state", async () => {
            const state = "test state";
            const objsCount = 1;
            const metasCount = 1;
            let repoId = await contract.getRepoId(creator, repoName);
            let result = await contract.loadState(repoId);

            assert.equal("", result.state);
            assert.equal(0, result.curObjects.toNumber());
            assert.equal(0, result.curMetas.toNumber());

            await contract.pushState(repoId, objsCount, metasCount, "", state, {from: creator});
            result = await contract.loadState(repoId);

            assert.equal(state, result.state);
            assert.equal(objsCount, result.curObjects.toNumber());
            assert.equal(metasCount, result.curMetas.toNumber());
        });
    });
});
