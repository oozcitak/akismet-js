# To run tests: mocha --compilers coffee:coffee-script/register

assert = require 'assert'
akismet = require '../src/akismet.coffee'

key = ''
blog = ''

if not key or not blog
    console.log 'Edit this file and enter your Akismet API key and blog URL.'
    process.exit 1

client = akismet.client({ blog: blog, apiKey: key })
invalidKeyClient = akismet.client( { blog: blog, apiKey: 'invalid-key'})
invalidEndpointClient = akismet.client( {blog: blog, apiKey: key, host: '127.0.0.1'})

spamObject = 
  user_ip: '192.168.0.1'
  comment_author: 'viagra-test-123'
  comment_content: 'spam!'
  is_test: 1

hamObject = 
  user_ip: '192.168.0.1'
  comment_author: 'A. Thor'
  comment_content: 'Hello, this is normal text'
  user_role: 'Administrator'
  is_test: 1

describe 'Akismet', () ->
  describe 'Verify key', () ->
    it 'should return true if the key valid', (done) ->
      client.verifyKey (err, verified) ->
        assert.equal err, null
        assert verified
        done()

    it 'should return false if the key is invalid', (done) -> 
      invalidKeyClient.verifyKey (err, verified) ->
        assert.equal err, null
        assert.equal verified, false
        done()

    it 'should generate an error if the host is not available', (done) ->
      invalidEndpointClient.verifyKey (err, verified) ->
        assert.notEqual err, null
        done()

  describe 'Check spam', () ->
    it 'should return true if the text is spam', (done) ->
      client.checkSpam spamObject, (err, spam) ->
        assert.equal err, null
        assert.equal spam, true
        done()

    it 'should return false if the text is not spam', (done) ->
      client.checkSpam hamObject, (err, spam) ->
        assert.equal err, null
        assert.equal spam, false
        done()

    it 'should generate an error if the host is not available', (done) ->
      invalidEndpointClient.checkSpam spamObject, (err, spam) ->
        assert.notEqual err, null
        done()

