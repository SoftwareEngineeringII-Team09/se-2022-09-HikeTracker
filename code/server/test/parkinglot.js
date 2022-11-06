const chai = require('chai');
const chaiHttp = require('chai-http');
const ParkingLot = require('../dao/model/ParkingLot');
const {clearAll} = require("./utils");
const ParkingLotManager = require('../controllers/ParkingLotManager');

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