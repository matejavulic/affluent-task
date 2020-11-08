//During the test the .env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let should = chai.should();


/*
 * Test the /GET route
 */
describe('/GET user', () => {
    it('it should GET all the users from db', (done) => {
        chai.request('http://localhost:8080/user')
            .get('/get')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                done();
            });
    });
});