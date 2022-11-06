const chai = require('chai');
const chaiHttp = require('chai-http');
const Hike = require('../dao/model/Hike');
const {clearAll} = require("./utils");
const HikeManager = require('../controllers/HikeManager');

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