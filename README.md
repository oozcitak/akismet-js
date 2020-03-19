An [Akismet](http://www.akismet.com/) API client for [node.js](http://nodejs.org/). 

[![NPM version](http://img.shields.io/npm/v/akismet.svg?style=flat-square)](https://npmjs.org/package/akismet)
[![License](http://img.shields.io/npm/l/akismet.svg?style=flat-square)](http://opensource.org/licenses/MIT)

[![Travis Build Status](https://img.shields.io/travis/oozcitak/akismet-js?logo=travis&style=flat-square)](http://travis-ci.org/oozcitak/akismet-js)
[![AppVeyor Build status](https://img.shields.io/appveyor/ci/oozcitak/akismet-js?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/oozcitak/akismet-js)
[![Dev Dependency Status](http://img.shields.io/david/dev/oozcitak/akismet-js.svg?style=flat-square)](https://david-dm.org/oozcitak/akismet-js)
[![Code Coverage](https://img.shields.io/codecov/c/github/oozcitak/akismet-js?logo=codecov&style=flat-square)](https://codecov.io/gh/oozcitak/akismet-js)

### Installation:

``` bash
npm install --save akismet
```

### Usage:

You need to [sign up](https://akismet.com/signup/) for an Akismet API key to use the API. Once you sign up, 
it would be a good idea to verify your key.

``` js
var akismet = require('akismet').client({ blog: 'http://my.blog.com', apiKey: 'myakismetapikey123' });

akismet.verifyKey(function(err, verified) {
  if (verified) 
    console.log('API key successfully verified.');
  else 
    console.log('Unable to verify API key.');
});
```
      
You can now use Akismet to moderate your comments. 

``` js
akismet.checkComment({ 
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

You can also send feedback to Akismet with `submitSpam` and `submitHam`. Their usage is the same as `checkComment`.

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
See the [wiki](https://github.com/oozcitak/akismet-js/wiki) and [Akismet API documentation](http://www.akismet.com/development/api) for more information.

