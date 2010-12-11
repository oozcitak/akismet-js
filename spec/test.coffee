util = require 'util'

key = ''
blog = ''

if not key or not blog
  util.log 'Edit this file and enter your Akismet API key and blog URL.'
  process.exit 1

akismet = require('./akismet').client({ blog: blog, apiKey: key })

akismet.verifyKey (err, verified) ->
  if err then throw err
  util.log 'Verify Key: ' + if verified then 'PASS' else 'FAIL'
  
akismet.checkSpam { user_ip: '192.168.0.1', comment_author: 'viagra-test-123', comment_content: 'spam!' }, (err, spam) ->
  if err then throw err
  util.log 'Spam Check: ' + if spam is true then 'PASS' else 'FAIL'

akismet.checkSpam { user_ip: '192.168.0.1', comment_author: 'anon_coward', comment_content: 'thoughtful comment' }, (err, spam) ->
  if err then throw err
  util.log 'Ham Check: ' + if spam is false then 'PASS' else 'FAIL'

