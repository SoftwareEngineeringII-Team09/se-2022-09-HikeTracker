const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../dao/model/User');
<<<<<<< Updated upstream
const {clearAll} = require("./utils");
=======
const Utils = require("./integration-utils");
const PersistentManager = require("../dao/PersistentManager");
>>>>>>> Stashed changes
const UserManager = require('../controllers/UserManager');

chai.use(chaiHttp);
chai.should();

const app = require('../index');
let agent = chai.request.agent(app);

/* Some useful data to use for tests */
const testUser = { userId: 1, email: "test@email.it", salt: "testSalt", password: "testPassword", firstname: "testFirstname", lastname: "testLastname", mobile: "390123456789", role: "testRole", active: 0 };
const testUserRegister1 = { userId: 1, email: "test1@email.it", salt: "test1Salt", password: "test1Password", firstname: "test1Firstname", lastname: "test1Lastname", mobile: "390123456789", role: "test1Role", active: 0 };
const testUserLogin1 = {email: "test1@email.it", password: "test1Password"};
const testUserRegister2 = { userId: 2, email: "test2@email.it", salt: "test2Salt", password: "test2Password", firstname: "test2Firstname", lastname: "test2Lastname", mobile: "493845920934", role: "test2Role", active: 1 };
const testUserLogin2 = {email: "test2@email.it", password: "test2Password"};
const testUserRegister3 = { userId: 3, email: "test3@email.it", salt: "test3Salt", password: "test3Password", firstname: "test3Firstname", lastname: "test3Lastname", mobile: "869489489538", role: "test3Role", active: null };
const testUserLogin3 = {email: "test3@email.it", password: "test3Password"};
const testUser1 = {email: "test1@email.it", password: "test1Password"};
const testUser2 = {email: "test2@email.it", password: "test2Password"};
const testUser3 = {email: "test3@email.it", password: "test3Password"};
const testUsers = [testUser1, testUser2, testUser3];
const notExistingUser = testUser.userId + 1;
const notExistingEmail = testUser.email;
const notExistingRole = testUser.role;
const notExistingPassword = testUser.password;

/*****************************************************************************************************
*              POST /api/users/:userId
*****************************************************************************************************/
describe("POST /api/users/:userId", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});


	Utils.postUser(agent, "post a user", 201, testUser1.userId, testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
	Utils.postUser(agent, "return 404 because of not existing user with userId = :userId", 404, notExistingUser, testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
	Utils.postUser(agent, "return 422 because of wrong :userId format", 422, "wrongUserIdFormat", testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
	/* TODO add these tests with wrong body data format after solving body validation issue */
	// Utils.postUser(agent, "should return 422 because of wrong email format", 422, testUser.userId, testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
	// Utils.postUser(agent, "should return 422 because of wrong password format", 422, testUser.userId, testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
	// Utils.postUser(agent, "should return 422 because of wrong firstname format", 422, testUser.userId, testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
	// Utils.postUser(agent, "should return 422 because of wrong lastname format", 422, testUser.userId, testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
	// Utils.postUser(agent, "should return 422 because of wrong mobile format", 422, testUser.userId, testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
	// Utils.postUser(agent, "should return 422 because of wrong role format", 422, testUser.userId, testUser1.email, testUser1.password, testUser1.salt, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.role, testUser1.active);
});

/*****************************************************************************************************
*              GET /api/users
*****************************************************************************************************/
describe("GET /api/users", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(User.tableName, testUserRegister1),
			PersistentManager.store(User.tableName, testUserLogin1),
			PersistentManager.store(User.tableName, testUserRegister2),
			PersistentManager.store(User.tableName, testUserLogin2),
			PersistentManager.store(User.tableName, testUserRegister3),
			PersistentManager.store(User.tableName, testUserLogin3)
		]);
		await Promise.all([
			PersistentManager.store(User.tableName, testUser1),
			PersistentManager.store(User.tableName, testUser2),
			PersistentManager.store(User.tableName, testUser3)
		]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getAllUsers(agent, "return the list of users", 200, testUsers.length);
});

/*****************************************************************************************************
*              GET /api/users/:userId
*****************************************************************************************************/
describe("GET /api/users/:userId", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(User.tableName, testUserRegister1),
			PersistentManager.store(User.tableName, testUserLogin1),
			PersistentManager.store(User.tableName, testUserRegister2),
			PersistentManager.store(User.tableName, testUserLogin2),
			PersistentManager.store(User.tableName, testUserRegister3),
			PersistentManager.store(User.tableName, testUserLogin3)
		]);
		await Promise.all([
			PersistentManager.store(User.tableName, testUser1),
			PersistentManager.store(User.tableName, testUser2),
			PersistentManager.store(User.tableName, testUser3)
		]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getUserById(agent, "return the user with userId = :userId", 200, testUser1.userId, testUser1);
	Utils.getUserById(agent, "return 404 because of not existing user with userId = :userId", 404, notExistingUser);
	Utils.getUserById(agent, "return 422 because of wrong :userId format", 422, "wrongUserIdFormat");
});

/*****************************************************************************************************
*              GET /api/users/:email
*****************************************************************************************************/
describe("GET /api/users/:email", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(User.tableName, testUserRegister1),
			PersistentManager.store(User.tableName, testUserLogin1),
			PersistentManager.store(User.tableName, testUserRegister2),
			PersistentManager.store(User.tableName, testUserLogin2),
			PersistentManager.store(User.tableName, testUserRegister3),
			PersistentManager.store(User.tableName, testUserLogin3)
		]);
		await Promise.all([
			PersistentManager.store(User.tableName, testUser1),
			PersistentManager.store(User.tableName, testUser2),
			PersistentManager.store(User.tableName, testUser3)
		]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getUserByEmail(agent, "return the user with email = :email", 200, testUser1.email, testUser1);
	Utils.getUserByEmail(agent, "return 404 because of not existing user with email = :email", 404, notExistingMail);
	Utils.getUserByEmail(agent, "return 422 because of wrong :email format", 422, "wrongEmailFormat");
});

describe("Other tests", function () {

    /* Test Setup */
<<<<<<< Updated upstream
    this.beforeAll(clearAll);
    /* Test Teardown */
    this.afterAll(clearAll);
    
    describe('Example', () => {
        
    });
=======
    this.beforeAll(async () => {
		await Utils.clearAll();
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});
>>>>>>> Stashed changes

});