//During the test the .env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

/*
 * Test the 404 route
 */
describe('/GET 404', () => {
    it('it should return 404 message', (done) => {
        chai.request('http://localhost:8080/something')
            .get('/get')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('Object');
                res.text.should.match(/We're sorry, but something went wrong./)
                done();
            });
    });
});