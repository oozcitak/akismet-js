import { equal, notEqual } from "assert";
import { client as akismetClient } from "../src/index";

describe("Akismet", () => {
  const apiKey = process.env.AKISMET_APIKEY;
  const blog = process.env.AKISMET_BLOGURL;

  if (!apiKey || !blog) {
    throw new Error("Please enter your Akismet API key and blog URL.");
  }

  const client = akismetClient({ apiKey, blog  });
  const invalidKeyClient = akismetClient({ blog, apiKey: "invalid-key" });
  const invalidHostClient = akismetClient({ apiKey, blog, host: "1.1.1.1" });

  const spamObject = {
    comment_author: "viagra-test-123",
    comment_content: "spam!",
    is_test: 1,
    user_ip: "192.168.0.1"
  };

  const hamObject = {
    comment_author: "A. Thor",
    comment_content: "Hello, this is normal text",
    is_test: 1,
    user_ip: "192.168.0.1",
    user_role: "Administrator"
  };

  describe("Verify key", () => {
    it("should return true if the key is valid", (done) => {
      client.verifyKey((err, verified) => {
        equal(err, null);
        equal(verified, true);
        done();
      });
    });

    it("should return false if the key is invalid", (done) => {
      invalidKeyClient.verifyKey((err, verified) => {
        equal(err, null);
        equal(verified, false);
        done();
      });
    });

    it("should generate an error if the host is not available", (done) => {
      invalidHostClient.verifyKey((err, verified) => {
        notEqual(err, null);
        done();
      });
    });

  });

  describe("Check comment", () => {
    it("should return true if the text is spam", (done) => {
      client.checkComment(spamObject, (err, spam) => {
        equal(err, null);
        equal(spam, true);
        done();
      });
    });

    it("should return false if the text is not spam", (done) => {
      client.checkComment(hamObject, (err, spam) => {
        equal(err, null);
        equal(spam, false);
        done();
      });
    });

    it("should generate an error if the host is not available", (done) => {
      invalidHostClient.checkComment(spamObject, (err, spam) => {
        notEqual(err, null);
        done();
      });
    });

  });

});

