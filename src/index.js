/* eslint-disable no-console */
const execa = require("execa");
const path = require("path");
const glob = require("@now/build-utils/fs/glob");
const download = require("@now/build-utils/fs/download");
const installTerraform = require("./install-terraform.js");

exports.analyze = ({ entrypoint, files }) => files[entrypoint].digest;

exports.build = async ({ config, entrypoint, files, workPath }) => {
  const downloadedFiles = await download(files, workPath);

  await installTerraform();
  const { PATH, HOME } = process.env;

  // Make sure your providers' config vars are secrets passed in as ENV vars.
  // See https://zeit.co/docs/v2/deployments/environment-variables-and-secrets
  const terraformEnv = {
    ...process.env,
    PATH: `${path.join(HOME)}:${PATH}`
  };

  const entrypointDirname = path.dirname(downloadedFiles[entrypoint].fsPath);

  const tfArgs = {
    env: terraformEnv,
    cwd: entrypointDirname,
    stdio: "inherit"
  };

  // You should be using a remote backend or else terraform will be unaware of
  // your current application state!
  console.log("Initalizing terraform...");
  try {
    await execa("terraform", ["init", "-no-color"], tfArgs);
  } catch (err) {
    console.error("Terraform init failed!");
    throw err;
  }
  console.log("Validating terraform files...");
  try {
    await execa("terraform", ["validate", "-no-color"], tfArgs);
  } catch (err) {
    console.error("Terraform validate failed!");
    throw err;
  }
  console.log("Generating execution plan");
  try {
    await execa("terraform", ["plan", "-no-color"], tfArgs);
  } catch (err) {
    console.error("Terraform plan failed!");
    throw err;
  }
  console.log("Applying...");
  try {
    await execa("terraform", ["apply", "-auto-approve", "-no-color"], tfArgs);
  } catch (err) {
    console.error("Terraform apply failed!");
    throw err;
  }
};

exports.prepareCache = async ({ cachePath, entrypoint, workPath }) => {
  console.log("preparing cache...");
  return {
    ...(await glob(".terraform/**", workPath))
  };
};
