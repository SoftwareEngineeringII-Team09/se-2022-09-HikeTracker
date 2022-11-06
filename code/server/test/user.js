const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../dao/model/User');
const {clearAll} = require("./utils");
const UserManager = require('../controllers/UserManager');

chai.use(chaiHttp);
chai.should();

const app = require('../index');
let agent = chai.request.agent(app);

describe("Test", function () {

    /* Test Setup */
    this.beforeAll(clearAll);
    /* Test Teardown */
    this.afterAll(clearAll);
    
    describe('Example', () => {
        
    });

});