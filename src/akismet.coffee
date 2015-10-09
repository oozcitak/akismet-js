request = require 'request'
url = require 'url'
domain = require 'domain'

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
  constructor: (options) ->
    @blog = options.blog or ''
    @apiKey = options.apiKey
    @host = options.host or 'rest.akismet.com'
    @endPoint = options.endPoint or @apiKey + '.' + @host
    @port = options.port or 80
    @userAgent = options.userAgent or 'Generic Node.js/1.0.0 | Akismet 2.4.0'
    @charset = options.charset or 'utf-8'


  # Verifies the key.
  #
  # callback: err, isValid (true or false)
  verifyKey: (callback) ->
    callback or= () ->
    @postRequest @host, '/1.1/verify-key', { key: @apiKey, blog: @blog }, (err, status, headers, body) ->
      callback err, (if status >= 200 and status < 300 and body is 'valid' then true else false)


  # Checks if a comment is spam
  #
  # options: key/value pair of options to send to the Akismet API
  # callback: err, isSpam (true or false)
  checkSpam: (options, callback) ->
    callback or= () ->
    options.blog = @blog
    options.user_agent = @userAgent
    @postRequest @endPoint, '/1.1/comment-check', options, (err, status, headers, body) ->
      callback err, (if status >= 200 and status < 300 and body is 'true' then true else false)

   
  # Marks a comment as spam
  #
  # options: key/value pair of options to send to the Akismet API
  # callback: err
  submitSpam: (options, callback) ->
    callback or= () ->
    options.blog = @blog
    options.user_agent = @userAgent
    @postRequest @endPoint, '/1.1/submit-spam', options, (err, status, headers, body) ->
      callback err


  # Marks a comment as NOT spam
  #
  # options: key/value pair of options to send to the Akismet API
  # callback: err
  submitHam: (options, callback) ->
    callback or= () ->
    options.blog = @blog
    options.user_agent = @userAgent
    @postRequest @endPoint, '/1.1/submit-ham', options, (err, status, headers, body) ->
      callback err


  # Posts a request to the Akismet API server.
  postRequest: (hostname, path, query, callback) ->

    requestUrl = url.format({
      protocol: if @port is 443 then 'https' else 'http',
      hostname: hostname,
      pathname: path,
      port: @port
      })
 
    options =
      'url': requestUrl
      'form': query
      'headers':
        'content-type': 'charset=' + @charset
        'user-agent': @userAgent

    dom = domain.create()
    dom.on 'error', (err) ->
      callback err
    dom.run () ->
      request.post options, (err, message, response) ->
        if err
          callback err
        else
          callback null, message.statusCode, message.headers, response

# Creates and returns a new Akismet client.
module.exports = {
  client: (options) -> new Akismet (options)
}

