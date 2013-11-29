An [Akismet](http://www.akismet.com/) API client for [node.js](http://nodejs.org/). 

[![NPM version](https://badge.fury.io/js/akismet.png)](http://badge.fury.io/js/akismet)

### Installation:

``` bash
npm install akismet
```

### Usage:

You need to [sign up](https://akismet.com/signup/) for an Akismet API key to use the API. Once you sign up, 
it would be a good idea to verify your key.
See [http://www.akismet.com/development/api/#verify-key](http://www.akismet.com/development/api/#verify-key)

``` js
var akismet = require('akismet').client({ blog: 'http://my.blog.com', apiKey: 'myakismetapikey123' });

akismet.verifyKey(function(err, verified) {
  if (verified) 
    console.log('API key successfully verified.');
  else 
    console.log('Unable to verify API key.');
});
```
      
You can now use Akismet to moderate the comments. 
See [http://www.akismet.com/development/api/#comment-check](http://www.akismet.com/development/api/#comment-check)

``` js
akismet.checkSpam({ 
    user_ip: '1.1.1.1', 
    permalink: 'http://www.my.blog.com/my-post',
    comment_author: 'spammer',
    comment_content: 'spamming your comments'
  }, function(err, spam) {
    if(spam)
      console.log('Spam caught.');
    else
      console.log('Not spam');
});
```

You can also send feedback to Akismet with `submitSpam` and `submitHam`. Their usage is the same as `checkSpam`.
See [http://www.akismet.com/development/api/#submit-spam](http://www.akismet.com/development/api/#submit-spam)
and [http://www.akismet.com/development/api/#submit-ham](http://www.akismet.com/development/api/#submit-ham)

``` js
akismet.submitSpam({ 
    user_ip: '1.1.1.1', 
    permalink: 'http://www.my.blog.com/my-post',
    comment_author: 'spammer',
    comment_content: 'that was spam but you failed to catch me'
  }, function(err) {
    console.log('Spam reported to Akismet.');
});
```

### License:

Akismet-js is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
