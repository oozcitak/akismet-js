[Akismet](http://www.akismet.com/) for [node.js](http://nodejs.org/). 
Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

### Installation:

    npm install akismet

### Usage:

You need to [sign up](https://akismet.com/signup/) for an Akismet API key to use the API. Once you sign up, 
it would be a good idea to verify your key. (See: http://www.akismet.com/development/api/#verify-key)

    var util = require('util'),
        akismet = require('akismet').client({ blog: 'http://my.blog.com', apiKey: 'myakismetapikey123' });

    akismet.verifyKey(function(verified, status, headers) {
      if (verified) 
        util.log('API key successfully verified.');
      else 
        util.log('Unable to verify API key.');
    });
      
You can now use Akismet to moderate the comments. (See: http://www.akismet.com/development/api/#comment-check)

    akismet.checkSpam({ 
        user_ip: userip, 
        permalink: 'http://www.my.blog.com/my-pos',
        commnent_author: 'spammer',
        comment_content: 'spamming your comments'
      }, function(spam, status, headers) {
        if(spam)
          util.log('Spam caught.');
        else
          util.log('Not spam');
    });

You can also send feedback to Akismet with `submitSpam` and `submitHam`. Their usage is the same as `checkSpam`.
(See: http://www.akismet.com/development/api/#submit-spam, and http://www.akismet.com/development/api/#submit-ham)



