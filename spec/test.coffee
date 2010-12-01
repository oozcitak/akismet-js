util = require 'util'

key = ''
blog = ''

if not key or not blog
  util.log 'Edit this file and enter your Akismet API key and blog URL.'
  process.exit 1

akismet = require('./akismet').client({ blog: blog, apiKey: key })

akismet.verifyKey (verified) ->
  util.log 'Verify Key: ' + if verified then 'PASS' else 'FAIL'
  
akismet.checkSpam { user_ip: '192.168.0.1', comment_author: 'viagra-test-123', comment_content: 'spam!' }, (spam) ->
  util.log 'Spam Check: ' + if spam then 'PASS' else 'FAIL'

akismet.checkSpam { user_ip: '192.168.0.1', comment_author: 'anon_coward', comment_content: 'thoughtful comment' }, (spam) ->
  util.log 'Ham Check: ' + if not spam then 'PASS' else 'FAIL'

