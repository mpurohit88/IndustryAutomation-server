const expect = require('chai').expect;
const nock = require('nock');

const getBooks = require('../index').getBooks;
const getBookDetails = require('../index').getBookDetails;

const response = {"title": "The React", "ratings_count": "322"}

describe('Get Books tests', () => {
  beforeEach(() => {
    nock('https://www.goodreads.com/')
      .get('/search/index.xml?key=4dUTWjXYKXTenf0RBJwMcA&q=react')
      .reply(200, response);
  });

  it('Get books by title', () => {
    return getBooks('react')
      .then(response => {
        expect(typeof response).to.equal('object');

        expect(response.title).to.equal('The React');
        expect(response.ratings_count).to.equal('322');
      });
  });

  it('Get book detail by ISBN id', () => {
    return getBookDetails('12321')
      .then(response => {
        expect(typeof response).to.equal('object');

        expect(response.title).to.equal('The React');
        expect(response.ratings_count).to.equal('322');
      });
  });
}); 