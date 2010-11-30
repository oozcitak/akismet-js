key = ''

util = require 'util'
akismet = require('./akismet').client({ blog: 'http://www.can.ozcitak.com', apiKey: key })

if not key
  util.log 'Edit this file and enter your Akismet API key.'

else

  akismet.verifyKey (verified) ->
    util.log 'Verify Key: ' + if verified then 'PASS' else 'FAIL'
  
  akismet.checkSpam { user_ip: '192.168.0.1', comment_author: 'viagra-test-123', comment_content: 'spam!' }, (spam) ->
    util.log 'Spam Check: ' + if spam then 'PASS' else 'FAIL'

  akismet.checkSpam { user_ip: '192.168.0.1', comment_author: 'anon_coward', comment_content: 'thoughtful comment' }, (spam) ->
    util.log 'Ham Check: ' + if not spam then 'PASS' else 'FAIL'

