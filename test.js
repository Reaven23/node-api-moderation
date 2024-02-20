const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app.js');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Server and Request with the Logora API', () => {
  it('should return a valid status for a good request', async () => {
    const response = await chai
      .request(app)
      .post('/api/moderation/predict')
      .query({
        text: 'Aucun bon débat ne se débat pas, n\'est-ce pas?',
        language: 'fr-FR',
      });

    expect(response).to.have.status(200);
  });

  it('should return an invalid status for a request with missing parameters', async () => {
    const response = await chai
      .request(app)
      .post('/api/moderation/predict')
      .query({
        text: 'Aucun bon débat ne se débat pas',
        language: '',
      });

    expect(response).to.have.status(400);
  });

  it('should return a valid status for a good request and return a score between 0 and 10', async () => {
    const response = await chai
      .request(app)
      .post('/api/moderation/score')
      .query({
        text: 'Aucun bon débat ne se débat pas',
        language: 'fr-FR',
      });

      expect(response).to.have.status(200);

      const scoreString = response.body.score;
      const match = scoreString.match(/[\d.]+/);
      const score = parseFloat(match[0]);
      expect(score).to.be.a('number').within(0, 10);

  });
});
