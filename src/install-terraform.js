/* eslint-disable no-console */
const unzipper = require("unzipper");
const fetch = require("node-fetch");
const fs = require("fs");

const tfUrl =
  process.env.TERRAFORM_VERSION_URL ||
  "https://releases.hashicorp.com/terraform/0.11.13/terraform_0.11.13_linux_amd64.zip";

async function installTerraform() {
  console.log("downloading terraform...");
  const res = await fetch(tfUrl);

  if (!res.ok) {
    const err = `Failed to download: ${tfUrl}`;
    throw new Error(err);
  }
  const { HOME } = process.env;
  return new Promise((resolve, reject) => {
    res.body
      .on("error", reject)
      .pipe(unzipper.Extract({ path: HOME }))
      .on("close", () => {
        fs.chmodSync(`${HOME}/terraform`, 766);
        console.log("terraform successfully downloaded and extracted");
        resolve();
      });
  });
}

module.exports = installTerraform;

async function main() {
  await installTerraform();
}
main();
