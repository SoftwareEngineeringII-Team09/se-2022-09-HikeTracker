const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../dao/model/User');
const Utils = require("./integration-utils");
const UserManager = require('../controllers/UserManager');

chai.use(chaiHttp);
chai.should();
const app = require('../index');
let agent = chai.request.agent(app);

describe("Test", function () {

    /* Test Setup */
    this.beforeAll(async () => {
		await Utils.clearAll();
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});
    
    describe('Example', () => {
        
    });

});