import { format as formatURL } from "url";
import qs = require("qs");
import axios from "axios";

/**
 * Defines the settings for the Akismet client.
 */
interface AkismetOptions {
  /**
   * The front page or home URL of the instance making the request. For a blog
   * or wiki this would be the front page.
   *
   * _Note:_ Must be a full URI, including `http://`.
   */
  blog?: string;

  /**
   * Akismet API key
   */
  apiKey: string;

  /**
   * Akismet API URL, defaults to `rest.akismet.com`
   */
  host?: string;

  /**
   * Akismet API endpoint, defaults to `apiKey.rest.akismet.com`
   */
  endPoint?: string;

  /**
   * Akismet API server port, defaults to `443`
   */
  port?: number;

  /**
   * The user agent string passed to Akismet API, defaults to
   * `Generic Node.js/1.0.0 | Akismet/3.1.7`
   */
  userAgent?: string;

  /**
   * The character set of comment texts, defaults to `utf-8`
   */
  charSet?: string;
}

/**
 * Defines the set of parameters passed to the Akismet API.
 */
interface AkismetParameters {
  /**
   * The front page or home URL of the instance making the request. For a blog
   * or wiki this would be the front page.
   *
   * _Note:_ Must be a full URI, including `http://`.
   */
  blog?: string;

  /**
   * IP address of the comment submitter.
   */
  user_ip?: string;

  /**
   * User agent string of the web browser submitting the comment - typically the
   * `HTTP_USER_AGENT` cgi variable. Not to be confused with the user agent of
   * your Akismet library.
   */
  user_agent?: string;

  /**
   * The content of the `HTTP_REFERER` header should be sent here.
   * (note spelling of `referrer`).
   */
  referrer?: string;

  /**
   * The full permanent URL of the entry the comment was submitted to.
   */
  permalink?: string;

  /**
   * A string that describes the type of content being sent. Examples:
   * - `comment`: A blog comment.
   * - `forum-post`: A top-level forum post.
   * - `reply`: A reply to a top-level forum post.
   * - `blog-post`: A blog post.
   * - `contact-form`: A contact form or feedback form submission.
   * - `signup`: A new user account.
   * - `message`: A message sent between just a few users.
   *
   * You may send a value not listed above if none of them accurately describe
   * your content. This is further explained here:
   * http://blog.akismet.com/2012/06/19/pro-tip-tell-us-your-comment_type/
   */
  comment_type?: string;

  /**
   * Name submitted with the comment.
   */
  comment_author?: string;

  /**
   * Email address submitted with the comment.
   */
  comment_author_email?: string;

  /**
   * URL submitted with comment.
   */
  comment_author_url?: string;

  /**
   * The content that was submitted.
   */
  comment_content?: string;

  /**
   * The UTC timestamp of the creation of the comment, in ISO 8601 format.
   * May be omitted if the comment is sent to the API at the time it is created.
   */
  comment_date_gmt?: string;

  /**
   * The UTC timestamp of the publication time for the post, page or thread on
   * which the comment was posted.
   */
  comment_post_modified_gmt?: string;

  /**
   * Indicates the language(s) in use on the blog or site, in ISO 639-1 format,
   * comma-separated. A site with articles in English and French might use `en, fr_ca`.
   */
  blog_lang?: string;

  /**
   * The character encoding for the form values included in `comment_*` parameters,
   * such as `UTF-8` or `ISO-8859-1`.
   */
  blog_charset?: string;

  /**
   * The user role of the user who submitted the comment. This is an optional parameter.
   * If you set it to `administrator`, Akismet will always return `false`.
   */
  user_role?: string;

  /**
   * This is an optional parameter. You can pass `1` when submitting test queries to Akismet.
   */
  is_test?: number;

  /**
   * **Other server environmental variables:**
   * In PHP, there is an array of environmental variables called `$_SERVER` that
   * contains information about the Web server itself as well as a key/value for
   * every HTTP header sent with the request. This data is highly useful to Akismet.
   * How the submitted content interacts with the server can be very telling,
   * so please include as much of it as possible.
   */
  [key: string]: any;
}

/**
 * Defines the callback for the `verifyKey` function.
 *
 * @param err - error message returned from the server.
 * @param isValid - `true` if the API key is valid; otherwise `false`.
 */
type VerifyKeyCallback = (err: string | null, isValid: boolean) => void;

/**
 * Defines the callback for the `checkComment` function.
 *
 * @param err - error message returned from the server.
 * @param isSpam - `true` if the content is spam; otherwise `false`.
 */
type CheckCommentCallback = (err: string | null, isSpam: boolean) => void;

/**
 * Defines the callback for the `submitSpam` and `submitHam` functions.
 *
 * @param err - error message returned from the server.
 */
type SubmitCallback = (err: string | null) => void;

/**
 * Defines the callback for the `_postRequest` function.
 *
 * @param err - error message returned from the server.
 * @param status - HTTP status code.
 * @param body - response body.
 */
type PostRequestCallback = (
  err: string | null,
  status: number,
  body: string
) => void;

/**
 * Represents the Akismet API client.
 */
export class AkismetClient {
  private _blog: string;
  private _apiKey: string;
  private _host: string;
  private _endPoint: string;
  private _port: number;
  private _userAgent: string;
  private _charSet: string;

  /**
   * Initialize the Akismet client.
   *
   * @param options - client settings
   */
  constructor(options: AkismetOptions) {
    this._blog = options.blog || "";
    this._apiKey = options.apiKey;
    this._host = options.host || "rest.akismet.com";
    this._endPoint = options.endPoint || this._apiKey + "." + this._host;
    this._port = options.port || 443;
    this._userAgent =
      options.userAgent || "Generic Node.js/1.0.0 | Akismet/3.1.7";
    this._charSet = options.charSet || "utf-8";
  }

  /**
   * Verifies the API key.
   *
   * @param callback - callback function
   */
  public verifyKey(callback: VerifyKeyCallback): void {
    const options = { key: this._apiKey, blog: this._blog };
    this._postRequest(
      this._endPoint,
      "/1.1/verify-key",
      options,
      (err: string | null, status: number, body: string) => {
        callback(err, status >= 200 && status < 300 && body === "valid");
      }
    );
  }

  /**
   * Checks if a comment is spam.
   *
   * @param options - options to send to the Akismet API
   * @param callback - callback function
   */
  public checkComment(
    options: AkismetParameters,
    callback: CheckCommentCallback
  ): void {
    options.blog = options.blog || this._blog;
    options.user_agent = options.user_agent || this._userAgent;
    this._postRequest(
      this._endPoint,
      "/1.1/comment-check",
      options,
      (err: string | null, status: number, body: string) => {
        callback(
          err,
          status >= 200 && status < 300 && body.toString() === "true"
        );
      }
    );
  }

  /**
   * Marks a comment as spam and reports to the Akismet API.
   *
   * @param options - options to send to the Akismet API
   * @param callback - callback function
   */
  public submitSpam(
    options: AkismetParameters,
    callback: SubmitCallback
  ): void {
    options.blog = options.blog || this._blog;
    options.user_agent = options.user_agent || this._userAgent;
    this._postRequest(
      this._endPoint,
      "/1.1/submit-spam",
      options,
      (err: string | null) => {
        callback(err);
      }
    );
  }

  /**
   * Marks a comment as NOT spam and reports to the Akismet API.
   *
   * @param options - options to send to the Akismet API
   * @param callback - callback function
   */
  public submitHam(options: AkismetParameters, callback: SubmitCallback): void {
    options.blog = options.blog || this._blog;
    options.user_agent = options.user_agent || this._userAgent;
    this._postRequest(
      this._endPoint,
      "/1.1/submit-ham",
      options,
      (err: string | null) => {
        callback(err);
      }
    );
  }

  /**
   * Posts a request to the Akismet API server.
   */
  private _postRequest(
    hostname: string,
    path: string,
    query: { [key: string]: any },
    callback: PostRequestCallback
  ): void {
    const options = {
      data: qs.stringify(query),
      headers: {
        "content-type":
          "application/x-www-form-urlencoded;charset=" + this._charSet,
        "user-agent": this._userAgent,
      },
    };

    const requestUrl = formatURL({
      protocol: this._port === 443 ? "https" : "http",
      hostname: hostname,
      pathname: path,
      port: this._port,
    });

    const getConfig = (): object => {
      return Object.assign({ url: requestUrl, method: "post" }, options);
    };

    axios(getConfig())
      .then((response: any) => {
        callback(null, response.status, response.data);
      })
      .catch((error: any) => {
        callback(error, 0, "");
      });
  }
}

/**
 * Creates and returns a new Akismet client.
 *
 * @param options - client settings
 */
export function client(options: AkismetOptions): AkismetClient {
  return new AkismetClient(options);
}
