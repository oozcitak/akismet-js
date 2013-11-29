vows = require 'vows'
assert = require 'assert'
akismet = require '../src/akismet.coffee'

key = ''
blog = ''

if not key or not blog
    console.log 'Edit this file and enter your Akismet API key and blog URL.'
    process.exit 1

client = akismet.client({ blog: blog, apiKey: key })

vows
    .describe('Akismet')
    .addBatch
        'Verify key':
            topic: () ->
                client.verifyKey @callback

            'returns true': (err, verified) ->
                assert.isNull err
                assert.isTrue verified

        'Check spam':
            topic: () ->
                client.checkSpam { user_ip: '192.168.0.1', comment_author: 'viagra-test-123', comment_content: 'spam!' }, @callback

            'returns true': (err, spam) ->
                assert.isNull err
                assert.isTrue spam

    .export(module)

