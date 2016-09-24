'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Need = mongoose.model('Need'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  need;

/**
 * Need routes tests
 */
describe('Need CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Need
    user.save(function () {
      need = {
        name: 'Need name'
      };

      done();
    });
  });

  it('should be able to save a Need if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Need
        agent.post('/api/needs')
          .send(need)
          .expect(200)
          .end(function (needSaveErr, needSaveRes) {
            // Handle Need save error
            if (needSaveErr) {
              return done(needSaveErr);
            }

            // Get a list of Needs
            agent.get('/api/needs')
              .end(function (needsGetErr, needsGetRes) {
                // Handle Needs save error
                if (needsGetErr) {
                  return done(needsGetErr);
                }

                // Get Needs list
                var needs = needsGetRes.body;

                // Set assertions
                (needs[0].user._id).should.equal(userId);
                (needs[0].name).should.match('Need name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Need if not logged in', function (done) {
    agent.post('/api/needs')
      .send(need)
      .expect(403)
      .end(function (needSaveErr, needSaveRes) {
        // Call the assertion callback
        done(needSaveErr);
      });
  });

  it('should not be able to save an Need if no name is provided', function (done) {
    // Invalidate name field
    need.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Need
        agent.post('/api/needs')
          .send(need)
          .expect(400)
          .end(function (needSaveErr, needSaveRes) {
            // Set message assertion
            (needSaveRes.body.message).should.match('Please fill Need name');

            // Handle Need save error
            done(needSaveErr);
          });
      });
  });

  it('should be able to update an Need if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Need
        agent.post('/api/needs')
          .send(need)
          .expect(200)
          .end(function (needSaveErr, needSaveRes) {
            // Handle Need save error
            if (needSaveErr) {
              return done(needSaveErr);
            }

            // Update Need name
            need.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Need
            agent.put('/api/needs/' + needSaveRes.body._id)
              .send(need)
              .expect(200)
              .end(function (needUpdateErr, needUpdateRes) {
                // Handle Need update error
                if (needUpdateErr) {
                  return done(needUpdateErr);
                }

                // Set assertions
                (needUpdateRes.body._id).should.equal(needSaveRes.body._id);
                (needUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Needs if not signed in', function (done) {
    // Create new Need model instance
    var needObj = new Need(need);

    // Save the need
    needObj.save(function () {
      // Request Needs
      request(app).get('/api/needs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Need if not signed in', function (done) {
    // Create new Need model instance
    var needObj = new Need(need);

    // Save the Need
    needObj.save(function () {
      request(app).get('/api/needs/' + needObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', need.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Need with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/needs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Need is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Need which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Need
    request(app).get('/api/needs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Need with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Need if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Need
        agent.post('/api/needs')
          .send(need)
          .expect(200)
          .end(function (needSaveErr, needSaveRes) {
            // Handle Need save error
            if (needSaveErr) {
              return done(needSaveErr);
            }

            // Delete an existing Need
            agent.delete('/api/needs/' + needSaveRes.body._id)
              .send(need)
              .expect(200)
              .end(function (needDeleteErr, needDeleteRes) {
                // Handle need error error
                if (needDeleteErr) {
                  return done(needDeleteErr);
                }

                // Set assertions
                (needDeleteRes.body._id).should.equal(needSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Need if not signed in', function (done) {
    // Set Need user
    need.user = user;

    // Create new Need model instance
    var needObj = new Need(need);

    // Save the Need
    needObj.save(function () {
      // Try deleting Need
      request(app).delete('/api/needs/' + needObj._id)
        .expect(403)
        .end(function (needDeleteErr, needDeleteRes) {
          // Set message assertion
          (needDeleteRes.body.message).should.match('User is not authorized');

          // Handle Need error error
          done(needDeleteErr);
        });

    });
  });

  it('should be able to get a single Need that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Need
          agent.post('/api/needs')
            .send(need)
            .expect(200)
            .end(function (needSaveErr, needSaveRes) {
              // Handle Need save error
              if (needSaveErr) {
                return done(needSaveErr);
              }

              // Set assertions on new Need
              (needSaveRes.body.name).should.equal(need.name);
              should.exist(needSaveRes.body.user);
              should.equal(needSaveRes.body.user._id, orphanId);

              // force the Need to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Need
                    agent.get('/api/needs/' + needSaveRes.body._id)
                      .expect(200)
                      .end(function (needInfoErr, needInfoRes) {
                        // Handle Need error
                        if (needInfoErr) {
                          return done(needInfoErr);
                        }

                        // Set assertions
                        (needInfoRes.body._id).should.equal(needSaveRes.body._id);
                        (needInfoRes.body.name).should.equal(need.name);
                        should.equal(needInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Need.remove().exec(done);
    });
  });
});
