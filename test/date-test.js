//During the test the .env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

/*
 * Test the date route
 */
describe('/GET date', () => {
    it('it should return all date records from db', (done) => {
        chai.request('http://localhost:8080/date')
            .get('/get')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                done();
            });
    });
});