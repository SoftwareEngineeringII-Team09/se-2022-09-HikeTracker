const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");
const Utils = require("./integration-utils");

chai.use(chaiHttp);
chai.should();
const app = require("../index");
const agent = chai.request.agent(app);


/* Some useful data to use for tests */
const testUserToSignup = new User(1, "test1@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, "testFristName1", "testLastName1", "390123456789", "Local Guide", 0);
const testUserToVerify = new User(2, "test2@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", "test-token", "testFristName2", "testLastName2", "390223456789", "Local Guide", 0);
const testUserRegistered = new User(3, "test3@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", "test-token", "testFristName3", "testLastName3", "390323456789", "Local Guide", 1);
const credentialsToSignup = { username: testUserToSignup.email, password: "Password1234." };
const credentialsRegistered = { username: testUserRegistered.email, password: "Password1234." };
const notAuthenticatedCredentials = { username: "notAuthorizedEmail@email.com", password: "wrongPassword" };


/*****************************************************************************************************
*              POST /auth/signup
*****************************************************************************************************/
describe("POST /auth/signup", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.postSignup(agent, "signup a new user", 201, testUserToSignup.role, testUserToSignup.firstname, testUserToSignup.lastname, testUserToSignup.mobile, testUserToSignup.email, credentialsToSignup.password);
	Utils.postSignup(agent, "return 422 because of wrong role format", 422, 1, testUserToSignup.firstname, testUserToSignup.lastname, testUserToSignup.mobile, testUserToSignup.email, credentialsToSignup.password);
	Utils.postSignup(agent, "return 422 because of wrong firstname format", 422, testUserToSignup.role, 1, testUserToSignup.lastname, testUserToSignup.mobile, testUserToSignup.email, credentialsToSignup.password);
	Utils.postSignup(agent, "return 422 because of wrong lastname format", 422, testUserToSignup.role, testUserToSignup.firstname, 1, testUserToSignup.mobile, testUserToSignup.email, credentialsToSignup.password);
	Utils.postSignup(agent, "return 422 because of wrong mobile format", 422, testUserToSignup.role, testUserToSignup.firstname, testUserToSignup.lastname, 1, testUserToSignup.email, credentialsToSignup.password);
	Utils.postSignup(agent, "return 422 because of wrong email format", 422, testUserToSignup.role, testUserToSignup.firstname, testUserToSignup.lastname, testUserToSignup.mobile, 1, credentialsToSignup.password);
	Utils.postSignup(agent, "return 422 because of wrong password format", 422, testUserToSignup.role, testUserToSignup.firstname, testUserToSignup.lastname, testUserToSignup.mobile, testUserToSignup.email, 1);
});


/*****************************************************************************************************
*              PUT /auth/sendVerificationCode
*****************************************************************************************************/
describe("PUT /auth/sendVerificationCode", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUserToVerify);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.putVerificationCode(agent, "send verification code", 201, testUserToVerify.userId);
	Utils.putVerificationCode(agent, "return 422 because of wrong :userId format", 422, "wrongUserIdFormat");
});


/*****************************************************************************************************
*              PUT /auth/verifyEmail
*****************************************************************************************************/
describe("PUT /auth/verifyEmail", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUserToVerify);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.putVerifyEmail(agent, "verify the email", 201, testUserToVerify.userId, testUserToVerify.verificationCode);
	Utils.putVerifyEmail(agent, "return 422 because of wrong :userId format", 422, "wrongUserIdFormat");
	Utils.putVerifyEmail(agent, "return 422 because of wrong token format", 422, 1);
});


/*****************************************************************************************************
*              POST /auth/login/password
*****************************************************************************************************/
describe("POST /auth/login/password", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUserRegistered);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.postLogin(agent, "login the user", 200, credentialsRegistered.username, credentialsRegistered.password);
	Utils.postLogin(agent, "return 422 because of wrong username format", 422, 1, credentialsRegistered.password);
	Utils.postLogin(agent, "return 422 because of wrong password format", 422, credentialsRegistered.username, 1);
});


/*****************************************************************************************************
*              DELETE /auth/logout
*****************************************************************************************************/
describe("DELETE /auth/logout", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUserRegistered);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.deleteLogout(agent, "logout the user", 200, credentialsRegistered);
});


/*****************************************************************************************************
*              GET /auth/current
*****************************************************************************************************/
describe("GET /auth/current", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUserRegistered);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getCurrent(agent, "get current user", 200, credentialsRegistered);
	Utils.getCurrent(agent, "return 401 because of not authenticated user", 401, notAuthenticatedCredentials);
});