const PersistentManager = require("../../dao/PersistentManager");
const UserManager = require("../../controllers/UserManager");
<<<<<<< Updated upstream
const { clearAll } = require("../utils");

describe("Test", () => {
=======
const Utils = require("../unit-utils");
const User = require("../../dao/model/User");

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
const expectedGetAllUsersProperties = ["userId", "email", "password", "salt", "firstname", "lastname", "mobile", "role", "active"];
const expectedGetUserByIdProperties = ["userId", "email", "password", "salt", "firstname", "lastname", "mobile", "role", "active"];
const expectedGetUserByEmailProperties = ["userId", "email", "password", "salt", "firstname", "lastname", "mobile", "role", "active"];

/*****************************************************************************************************
*              createUser()
*****************************************************************************************************/
describe("Test createUser", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(User.tableName, testUserRegister1),
			PersistentManager.store(User.tableName, testUserLogin1)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testCreateUser("store new user", testUser1);
	Utils.testCreateUser("reject because of not existing email foreign key", { ...testUser1, email: notExistingEmail }, 404);
	Utils.testCreateUser("reject because of not existing password foreign key", { ...testUser1, password: notExistingPassword }, 404);
	Utils.testCreateUser("reject because of not existing userId foreign key", { ...testUser1, userId: notExistingUser }, 404)
})


/*****************************************************************************************************
*              updateUser()
*****************************************************************************************************/
describe("Test updateUser", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testUpdateUser("update the user", { ...testUser1, email: "updatedEmail" }, "userId", testUser1.userId);
	Utils.testUpdateUser("reject because of not existing userId foreign key", { ...testUser1, userId: notExistingUser }, "userId", testUser1.userId, 404);
	Utils.testUpdateUser("reject because of not existing email foreign key", { ...testUser1, email: notExistingEmail }, "userId", testUser1.userId, 404);
	Utils.testUpdateUser("reject because of not existing password foreign key", { ...testUser1, password: notExistingPassword }, "userId", testUser1.userId, 404);
	Utils.testUpdateUser("reject because of not existing role foreign key", { ...testUser1, role: notExistingRole }, "userId", testUser1.userId, 404);
})


/*****************************************************************************************************
*              deleteUser()
*****************************************************************************************************/
describe("Test deleteUser", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testDeleteUser("delete the users with attributeName = value", "userId", testUser1.userId);
})


/*****************************************************************************************************
*              deleteAllUser()
*****************************************************************************************************/
describe("Test deleteAllUser", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testDeleteAllUser("delete all users");
})


/*****************************************************************************************************
*              loadAllUser()
*****************************************************************************************************/
describe("Test loadAllUser", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testLoadAllUser("load all users", testUsers.length);
})


/*****************************************************************************************************
*              existsUser()
*****************************************************************************************************/
describe("Test existsUser", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testExistsUser("return true", "userId", testUser1.userId, true);
	Utils.testExistsUser("return false", "userId", notExistingUser, false);
})


/*****************************************************************************************************
*              loadOneByAttributeUser()
*****************************************************************************************************/
describe("Test loadOneByAttributeUser", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testLoadOneByAttributeUser("load a user by attribute", "userId", testUser1.userId);
	Utils.testLoadOneByAttributeUser("return 404 for non existing user", "userId", notExistingUser, 404);
})


/*****************************************************************************************************
*              loadAllByAttributeUser()
*****************************************************************************************************/
describe("Test loadAllByAttributeUser", () => {
	/* Test Setup */
	beforeAll(async () => {
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
>>>>>>> Stashed changes

  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

	Utils.testLoadAllByAttributeUser("load all users by attribute", "userId", testUser.userId);
})


/*****************************************************************************************************
*              getAllUsers()
*****************************************************************************************************/
describe("Test getAllUsers", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testGetAllUsers("get all users", testUsers.length, expectedGetAllUsersProperties);
})


/*****************************************************************************************************
*              getUserById()
*****************************************************************************************************/
describe("Test getUserById", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testGetUserByUserId("get a user by userId", testUser1.userId, expectedGetUserByIdProperties, undefined);
	Utils.testGetUserByUserId("return 404 because of not existing user with userId = userId", notExistingUser, undefined, 404);
})


/*****************************************************************************************************
*              getUserByEmail()
*****************************************************************************************************/
describe("Test getUserByEmail", () => {
	/* Test Setup */
	beforeAll(async () => {
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
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testGetUserByEmail("get a user by email", testUser1.userId, expectedGetUserByEmailProperties, undefined);
	Utils.testGetUserByEmail("return 404 because of not existing user with email = email", notExistingUser, undefined, 404);
})
