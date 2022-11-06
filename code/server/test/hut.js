const chai = require('chai');
const chaiHttp = require('chai-http');
const Hut = require('../dao/model/Hut');
const {clearAll} = require("./utils");
const HutManager = require('../controllers/HutManager');

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