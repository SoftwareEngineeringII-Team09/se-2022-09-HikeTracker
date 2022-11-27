const PersistentManager = require("../../dao/PersistentManager");
const User = require("../../dao/model/User");
const Utils = require("../unit-utils");


/* Some useful data to use for tests */
const testUser1 = new User(1, "test1@email.it", "testSalt1", "testPassword1", null, "testFirstname1", "testLastname1", "390123456789", "testRole1", 1);
const testUser2 = new User(2, "test2@email.it", "testSalt2", "testPassword2", null, "testFirstname2", "testLastname2", "399876543210", "testRole2", 1);
const testUsers = [testUser1, testUser2];
const testVerificationCode = "verificationCode1";
const testWrongVerificationCode = "wrongVerificationCode";
const notExistingUser = testUser1.userId + testUser2.userId;


/*****************************************************************************************************
 *              storeUser()
 *****************************************************************************************************/
describe("Test storeUser", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser1);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

	Utils.testStoreUser("store the user", testUser2);
	Utils.testStoreUser("return 409 because of already existing user with that email", testUser1, 409)
});


/*****************************************************************************************************
 *              updateUser()
 *****************************************************************************************************/
 describe("Test updateUser", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser1);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

	Utils.testUpdateUser("update the hike", testUser2, "userId", testUser1.userId);
	Utils.testUpdateUser("reject because of not existing user with attributeName = value", testUser2, "userId", notExistingUser, 404);
});


/*****************************************************************************************************
 *              loadAllUser()
 *****************************************************************************************************/
 describe("Test loadAllUser", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
		await Promise.all([
			PersistentManager.store(User.tableName, testUser1),
			PersistentManager.store(User.tableName, testUser2)
		])
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testLoadAllUser("load all users", testUsers.length);
});


/*****************************************************************************************************
 *              existsUser()
 *****************************************************************************************************/
describe("Test existsUser", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await Promise.all([
			PersistentManager.store(User.tableName, testUser1),
			PersistentManager.store(User.tableName, testUser2)
		])
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testExistsUser("return true", "userId", testUser1.userId, true);
  Utils.testExistsUser("return false", "userId", notExistingUser, false);
});


/*****************************************************************************************************
 *              loadOneByAttributeUser()
 *****************************************************************************************************/
describe("Test loadOneByAttributeUser", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await Promise.all([
			PersistentManager.store(User.tableName, testUser1),
			PersistentManager.store(User.tableName, testUser2)
		])
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testLoadOneByAttributeUser("load a user by attribute", "userId", testUser1.userId);
  Utils.testLoadOneByAttributeUser("return 404 for non existing user", "userId", notExistingUser, 404);
});


/*****************************************************************************************************
 *              defineUser()
 *****************************************************************************************************/
 describe("Test defineUser", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

	Utils.testDefineUser("store the user successfully", testUser1.role, testUser1.firstname, testUser1.lastname, testUser1.mobile, testUser1.email, testUser1.password, testUser1.verificationCode);
});


/*****************************************************************************************************
 *              updateVerificationCode()
 *****************************************************************************************************/
 describe("Test updateVerificationCode", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser1);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

	Utils.testUpdateVerificationCode("update the verification code", testUser1.userId, testUser2.verificationCode);
});


/*****************************************************************************************************
 *              verifyEmail()
 *****************************************************************************************************/
 describe("Test verifyEmail", () => {
  /* Test Setup */
  beforeEach(async () => {
    await Utils.clearAll();
		await PersistentManager.store(User.tableName, { ...testUser1, verificationCode: testVerificationCode, active: 0 });
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

	Utils.testVerifyEmail("verify the user", testUser1.userId, testVerificationCode);
	Utils.testVerifyEmail("reject because of wrong verification code", testUser1.userId, testWrongVerificationCode, 406);
});



describe("Test", () => {
  /* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

  test("Example", async () => {
    expect(true).toEqual(true);
  });

});
