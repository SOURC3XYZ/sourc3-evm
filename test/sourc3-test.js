const Sourc3 = artifacts.require("Sourc3");
const truffleAssert = require('truffle-assertions');

contract("Sourc3", (accounts) => {
    let contract;

    beforeEach(async () => {
        contract = await Sourc3.new();;
    });

    it("create organization, project, repository", async () => {
        const creator = accounts[0];
        const organizationName = "organization";
        const projectName = "project";
        const repoName = "repo";

        await contract.createOrganization("organization", {from: creator});
        let organizationId = await contract.getOrganizationId(creator, organizationName);

        await contract.createProject(projectName, organizationId, {from: creator});
        let projectId = await contract.getProjectId(creator, projectName);

        let repos = await contract.getReposList();

        assert.isTrue(repos.ids.length == 0);

        await contract.createRepo(repoName, projectId, {from: creator});

        repos = await contract.getReposList();

        assert.isTrue(repos.ids.length == 1);
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
});
