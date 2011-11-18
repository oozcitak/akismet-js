assert = require 'assert'
akismet = require '../src/akismet.coffee'

key = ''
blog = ''

if not key or not blog
  console.log 'Edit this file and enter your Akismet API key and blog URL.'
  process.exit 1

client = akismet.client({ blog: blog, apiKey: key })

client.verifyKey (err, verified) ->
  if err then throw err
  assert.strictEqual verified, true
  
client.checkSpam { user_ip: '192.168.0.1', comment_author: 'viagra-test-123', comment_content: 'spam!' }, (err, spam) ->
  if err then throw err
  assert.strictEqual spam, true

client.checkSpam { user_ip: '192.168.0.1', comment_author: 'anon_coward', comment_content: 'thoughtful comment' }, (err, spam) ->
  if err then throw err
  assert.strictEqual spam, false

