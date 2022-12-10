const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();
const app = require("../index");
const agent = chai.request.agent(app);
const User = require("../dao/model/User");

describe("GET /coverage", function () {

	it(`Should get coverage`, function (done) {
		agent.get('/api/tests/coverage')
			.then(function (res) {
				res.should.have.status(200);
				done();
			}).catch(e => console.log(e));
	});
});