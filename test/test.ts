import { akismet } from '../src/index';
import { equal, notEqual } from 'assert';

describe('Akismet', function () {
  const key = '';
  const blog = '';

  if (!key || !blog) {
    console.log('Edit this file and enter your Akismet API key and blog URL.');
    process.exit(1);
  }

  const client = akismet.client({ blog: blog, apiKey: key });
  const invalidKeyClient = akismet.client({ blog: blog, apiKey: 'invalid-key' });
  const invalidEndpointClient = akismet.client({ blog: blog, apiKey: key, host: '127.0.0.1' });

  const spamObject = {
    user_ip: '192.168.0.1',
    comment_author: 'viagra-test-123',
    comment_content: 'spam!',
    is_test: 1,
  };

  const hamObject = {
    user_ip: '192.168.0.1',
    comment_author: 'A. Thor',
    comment_content: 'Hello, this is normal text',
    user_role: 'Administrator',
    is_test: 1
  };

  describe('Verify key', function () {
    it('should return true if the key is valid', function (done) {
      client.verifyKey(function (err, verified) {
        equal(err, null);
        equal(verified, true);
        done();
      });
    });

    it('should return false if the key is invalid', function (done) {
      invalidKeyClient.verifyKey(function (err, verified) {
        equal(err, null);
        equal(verified, false);
        done();
      });
    });

    it('should generate an error if the host is not available', function (done) {
      invalidEndpointClient.verifyKey(function (err, verified) {
        notEqual(err, null);
        done();
      });
    });

  });

  describe('Check comment', function () {
    it('should return true if the text is spam', function (done) {
      client.checkComment(spamObject, function (err, spam) {
        equal(err, null);
        equal(spam, true);
        done();
      });
    });

    it('should return false if the text is not spam', function (done) {
      client.checkComment(hamObject, function (err, spam) {
        equal(err, null);
        equal(spam, false);
        done();
      });
    });

    it('should generate an error if the host is not available', function (done) {
      invalidEndpointClient.checkComment(spamObject, function (err, spam) {
        notEqual(err, null);
        done();
      });
    });

  });

});

