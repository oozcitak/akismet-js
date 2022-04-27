import { client as akismetClient } from "../src/index";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();
const apiKey = process.env.AKISMET_APIKEY;
const blog = process.env.AKISMET_BLOGURL;

if (!apiKey || !blog) {
  throw new Error("Please enter your Akismet API key and blog URL.");
}

const client = akismetClient({ apiKey, blog });
const invalidKeyClient = akismetClient({ blog, apiKey: "invalid-key" });
const invalidHostClient = akismetClient({ apiKey, blog, host: "1.1.1.1" });

let spamObject = {
  comment_author: "viagra-test-123",
  comment_author_email: "akismet-guaranteed-spam@example.com",
  comment_content: "Spam!",
  is_test: 1,
  user_ip: "192.168.0.1",
};

let hamObject = {
  comment_author: "A. Thor",
  comment_content: "Hello, this is normal text",
  is_test: 1,
  user_ip: "192.168.0.1",
  user_role: "Administrator",
};

describe("Verify key", () => {
  it("should return true if the key is valid", (done) => {
    client.verifyKey((err, verified) => {
      expect(err).toBe(null);
      expect(verified).toBeTruthy();
      done();
    });
  });

  it("should return false if the key is invalid", (done) => {
    invalidKeyClient.verifyKey((err, verified) => {
      expect(err).toBe(null);
      expect(verified).toBeFalsy();
      done();
    });
  });

  it("should generate an error if the host is not available", (done) => {
    invalidHostClient.verifyKey((err, verified) => {
      expect(err).toBeDefined();
      done();
    });
  });
});

describe("Check comment", () => {
  it("should return true if the text is spam", (done) => {
    client.checkComment(spamObject, (err, spam) => {
      expect(err).toBe(null);
      expect(spam).toBeTruthy();
      done();
    });
  });

  it("should return false if the text is not spam", (done) => {
    client.checkComment(hamObject, (err, spam) => {
      expect(err).toBe(null);
      expect(spam).toBeFalsy();
      done();
    });
  });

  it("should generate an error if the host is not available", (done) => {
    invalidHostClient.checkComment(spamObject, (err, spam) => {
      expect(err).not.toBe(null);
      done();
    });
  });
});

describe("Submit comment", () => {
  it("should return false if no error on submit spam", (done) => {
    client.submitSpam(spamObject, (err) => {
      expect(err).toBeFalsy();
      done();
    });
  });

  it("should return false if no error on submit ham", (done) => {
    client.submitHam(hamObject, (err) => {
      expect(err).toBeFalsy();
      done();
    });
  });
});
