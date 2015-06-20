import expect from 'expect.js';
import nock from 'nock';
import qs from 'query-string';

import * as omdb from '../';

describe('Api', () => {

  describe('Validations', () => {

    describe('Valid', () => {
      const testValid = (object, fnName, value) => {
        it(`should accept ${value} for the ${fnName} function`, () => {
          expect(object[fnName]).withArgs(value).to.not.throwError();
        });
      };
      describe('Valid Top Level', () => {
        ['imdbId', 'title', 'searchTitle']
          .forEach(name => testValid(omdb, name, 'valid string value'));
      });

      const builder = omdb.title('title');

      const validValues = {
        type: ['movie', 'series', 'episode'],
        year: [1234],
        format: ['xml', 'json'],
        plot: ['short', 'full'],
        tomatoes: [true, false]
      };

      Object.keys(validValues).forEach(key => {
        describe(`Valid ${key}`, () => {
            validValues[key].forEach(type => testValid(builder, key, type));
        });
      });
    });

    describe('Invalid', () => {
      const testInvalid = (object, fnName, value) => {
        it(`should fail on ${value} for the ${fnName} function`, () => {
          expect(object[fnName]).withArgs(value).to.throwError();
        });
      };

      describe('Invalid Top Level', () => {
        ['imdbId', 'title', 'searchTitle']
          .forEach(name => [null, undefined]
            .forEach(v => testInvalid(omdb, name, v)));
      });

      const builder = omdb.title('title');

      const invalidValues = {
        type: ['badString'],
        year: ['string'],
        format: ['badString'],
        plot: ['badString'],
        tomatoes: ['badString']
      };

      Object.keys(invalidValues).forEach(key => {
        describe(`Invalid ${key}`, () => {
          invalidValues[key].forEach(type => testInvalid(builder, key, type));
        });
      });

      ['plot', 'tomatoes'].forEach(key => {
        describe(`Invalid ${key} with imdbId`, () => {
          invalidValues[key].forEach(type => testInvalid(omdb.imdbId('whatever'), key, type));
        });
      });
    });

  });

  describe('Service', () => {
    beforeEach(() => {
      // Uses nock to convert the query-string to an object and send it as the request body
      nock('http://www.omdbapi.com').filteringPath(() => '/').get('/').reply(200, (uri) => qs.parse(uri.slice(1)));
    });

    it('should send title param as t', (done) => {
      omdb.title('Wedding Crashers').request().then(({body}) => {
        expect(body.t).to.be('Wedding Crashers');
        done();
      }).catch(done);
    });

    it('should send id param as i', (done) => {
      omdb.imdbId('id').request().then(({body}) => {
        expect(body.i).to.be('id');
        done();
      }).catch(done);
    });

    it('should send search param as s', (done) => {
      omdb.searchTitle('search').request().then(({body}) => {
        expect(body.s).to.be('search');
        done();
      }).catch(done);
    });

    it('should send type param as type', (done) => {
      omdb
        .title('Wedding Crashers')
        .type('series')
        .request().then(({body}) => {
          expect(body.t).to.be('Wedding Crashers');
          expect(body.type).to.be('series');
          done();
        }
      ).catch(done);
    });

    it('should send format param as r', (done) => {
      omdb
        .title('Wedding Crashers')
        .format('json')
        .request().then(({body}) => {
          expect(body.t).to.be('Wedding Crashers');
          expect(body.r).to.be('json');
          done();
        }
      ).catch(done);
    });

    it('should send plot param as plot', (done) => {
      omdb
        .title('Wedding Crashers')
        .plot('short')
        .request().then(({body}) => {
          expect(body.t).to.be('Wedding Crashers');
          expect(body.plot).to.be('short');
          done();
        }
      ).catch(done);
    });

    it('should send tomatoes param as tomatoes', (done) => {
      omdb
        .title('Wedding Crashers')
        .tomatoes(true)
        .request().then(({body}) => {
          expect(body.t).to.be('Wedding Crashers');
          expect(body.tomatoes).to.be('true');
          done();
        }
      ).catch(done);
    });

    it('should send year param as y', (done) => {
      omdb
        .title('Wedding Crashers')
        .year(123)
        .request().then(({body}) => {
          expect(body.t).to.be('Wedding Crashers');
          expect(body.y).to.be('123');
          done();
        }
      ).catch(done);
    });
  });

});
