http = require 'http'
qs = require 'querystring'


class Akismet
 
    
  # Initialize the Akismet object.
  constructor: (options) ->
    @blog = options.blog or ''
    @apiKey = options.apiKey
    @host = options.host or 'rest.akismet.com'
    @endPoint = options.endPoint or @apiKey + '.' + @host
    @port = options.port or 80
    @userAgent = options.userAgent or 'Generic Node.js/1.0.0 | Akismet 2.4.0'
    @charset = options.charset or 'utf-8'


  # Verifies the key.
  verifyKey: (callback) ->
    @postRequest @host, '/1.1/verify-key', { key: @apiKey, blog: @blog }, (status, headers, body) ->
      callback (if status >= 200 and status < 300 and body is 'valid' then true else false), status, headers


  # Checks if a comment is spam
  checkSpam: (options, callback) ->
    options.blog = @blog
    options.user_agent = @userAgent
    @postRequest @endPoint, '/1.1/comment-check', options, (status, headers, body) ->
      callback (if status >= 200 and status < 300 and body is 'true' then true else false), status, headers

   
  # Marks a comment as spam
  submitSpam: (options, callback) ->
    options.blog = @blog
    options.user_agent = @userAgent
    @postRequest @endPoint, '/1.1/submit-spam', options, (status, headers, body) ->
      callback status, headers


  # Marks a comment as NOT spam
  submitHam: (options, callback) ->
    options.blog = @blog
    options.user_agent = @userAgent
    @postRequest @endPoint, '/1.1/submit-ham', options, (status, headers, body) ->
      callback status, headers


  # Posts a request to the Akismet API server.
  postRequest: (host, path, query, callback) ->
    query = qs.stringgify query

    client = http.createClient @port, host
    req = client.request 'POST', path, {
        'host': host
        'content-type': 'application/x-www-form-urlencoded; charset=' + @charset
        'content-length': query.length
        'user-agent': @userAgent
      }
    req.write query
    req.end()

    req.on 'response', (res) ->
      res.setEncoding 'utf-8'
      res.on 'data', (body) ->
        callback res.statusCode, res.headers, body


# Creates and returns a new Akismet client.
module.exports =
  client: (options) -> new Akismet (options)

