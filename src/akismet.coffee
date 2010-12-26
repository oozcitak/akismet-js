http = require 'http'
qs = require 'querystring'
util = require 'util'


class Akismet
 
    
  # Initialize the Akismet object.
  #
  # options: key/value pairs of settings
  #            blog: blog url
  #            apiKey: Akismet API key
  #            host: Akismet API URL, defaults to rest.akismet.com
  #            endPoint: Akismet API endpoint, defaults to apiKey.rest.akismet.com
  #            port: Akismet API server port, defaults to 80
  #            userAgent: The user agent string passed to Akismet API, defaults to 'Generic Node.js/1.0.0 | Akismet 2.4.0'
  #            charSet: The character set of comment texts, defaults to 'utf-8'
  #            debug: set to true to print debug information, defaults to false
  constructor: (options) ->
    @blog = options.blog or ''
    @apiKey = options.apiKey
    @host = options.host or 'rest.akismet.com'
    @endPoint = options.endPoint or @apiKey + '.' + @host
    @port = options.port or 80
    @userAgent = options.userAgent or 'Generic Node.js/1.0.0 | Akismet 2.4.0'
    @charset = options.charset or 'utf-8'
    @debug = options.debug or false

    @keyClient = null
    @client = null


  # Verifies the key.
  #
  # callback: err, isValid (true or false), statusCode, headers
  verifyKey: (callback) ->
    callback or= () ->
    @keyClient or= http.createClient @port, @host
    @postRequest @keyClient, '/1.1/verify-key', { key: @apiKey, blog: @blog }, (err, status, headers, body) ->
      callback err, (if status >= 200 and status < 300 and body is 'valid' then true else false), status, headers


  # Checks if a comment is spam
  #
  # options: key/value pair of options to send to the Akismet API
  # callback: err, isSpam (true or false), statusCode, headers
  checkSpam: (options, callback) ->
    callback or= () ->
    options.blog = @blog
    options.user_agent = @userAgent
    @client or= http.createClient @port, @endPoint
    @postRequest @client, '/1.1/comment-check', options, (err, status, headers, body) ->
      callback err, (if status >= 200 and status < 300 and body is 'true' then true else false), status, headers

   
  # Marks a comment as spam
  #
  # options: key/value pair of options to send to the Akismet API
  # callback: err, statusCode, headers
  submitSpam: (options, callback) ->
    callback or= () ->
    options.blog = @blog
    options.user_agent = @userAgent
    @client or= http.createClient @port, @endPoint
    @postRequest @client, '/1.1/submit-spam', options, (err, status, headers, body) ->
      callback err, status, headers


  # Marks a comment as NOT spam
  #
  # options: key/value pair of options to send to the Akismet API
  # callback: err, statusCode, headers
  submitHam: (options, callback) ->
    callback or= () ->
    options.blog = @blog
    options.user_agent = @userAgent
    @client or= http.createClient @port, @endPoint
    @postRequest @client, '/1.1/submit-ham', options, (err, status, headers, body) ->
      callback err, status, headers


  # Posts a request to the Akismet API server.
  postRequest: (client, path, query, callback) ->

    try
      query = qs.stringify query
 
      req = client.request 'POST', path, {
          'host': client.host
          'content-type': 'application/x-www-form-urlencoded; charset=' + @charset
          'content-length': query.length
          'user-agent': @userAgent
        }
      req.write query
      req.end()

      if @debug
        util.log 'Request: ' + util.inspect req

      req.on 'response', (res) ->
        if @debug
          util.log 'Response: ' + util.inspect res
        res.setEncoding 'utf-8'
        res.on 'data', (body) ->
          callback null, res.statusCode, res.headers, body

    catch err
      callback err, null, null, null


# Creates and returns a new Akismet client.
module.exports = {
  client: (options) -> new Akismet (options)
}

