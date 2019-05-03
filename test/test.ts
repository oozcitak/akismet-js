import { client as akismetClient } from '../src/index';
import { equal, notEqual } from 'assert';

describe('Akismet', () => {
  const key = '';
  const blog = '';

  if (!key || !blog) {
    console.log('Edit this file and enter your Akismet API key and blog URL.');
    process.exit(1);
  }

  const client = akismetClient({ blog: blog, apiKey: key });
  const invalidKeyClient = akismetClient({ blog: blog, apiKey: 'invalid-key' });
  const invalidEndpointClient = akismetClient({ blog: blog, apiKey: key, host: '127.0.0.1' });

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

  describe('Verify key', () => {
    it('should return true if the key is valid', (done) => {
      client.verifyKey((err, verified) => {
        equal(err, null);
        equal(verified, true);
        done();
      });
    });

    it('should return false if the key is invalid', (done) => {
      invalidKeyClient.verifyKey((err, verified) => {
        equal(err, null);
        equal(verified, false);
        done();
      });
    });

    it('should generate an error if the host is not available', (done) => {
      invalidEndpointClient.verifyKey((err, verified) => {
        notEqual(err, null);
        done();
      });
    });

  });

  describe('Check comment', () => {
    it('should return true if the text is spam', (done) => {
      client.checkComment(spamObject, (err, spam) => {
        equal(err, null);
        equal(spam, true);
        done();
      });
    });

    it('should return false if the text is not spam', (done) => {
      client.checkComment(hamObject, (err, spam) => {
        equal(err, null);
        equal(spam, false);
        done();
      });
    });

    it('should generate an error if the host is not available', (done) => {
      invalidEndpointClient.checkComment(spamObject, (err, spam) => {
        notEqual(err, null);
        done();
      });
    });

  });

});

