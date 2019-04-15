# :city_sunrise: now-terraform

[![Status](https://travis-ci.com/pckilgore/now-builder-terraform.svg?branch=master)](https://travis-ci.com/pckilgore/now-builder-terraform)[![npm version](http://img.shields.io/npm/v/@pckilgore/now-terraform.svg?style=flat)](https://npmjs.org/package/@pckilgore/now-terraform "View this project on npm")

Deploy your infrastructure using now.sh builders.

Uses terraform@0.11.13

## Example

> [This code is based on this fixture](test/fixtures/01-build-success)

### /now.json

```json
{
  "version": 2,
  "build": {
    "env": {
      "TF_VAR_AWS_ACCESS_KEY_ID": "@your_secret_1",
      "TF_VAR_AWS_SECRET_ACCESS_KEY": "@your_secret_2",
      "TF_VAR_REGION": "us-east-1",
      /**
       * The keys below may seem duplicative, but are read by `terraform init`
       * when setting up a remote backend (which you should be using).
       * They are hard coded by terraform by provider (the example below is AWS)
       */

      "AWS_ACCESS_KEY_ID": "@your_secret_1",
      "AWS_SECRET_ACCESS_KEY": "@your_secret_2"
    }
  },
  "builds": [{ "src": "index.tf", "use": "@pckilgore/now-builder-terraform" }]
}
```

### /infrastructure.tf

```terraform
variable "AWS_ACCESS_KEY_ID" {}
variable "AWS_SECRET_ACCESS_KEY" {}

variable "region" {
  default = "us-east-1"
}

provider "aws" {
  version    = "~> 2.6"
  access_key = "${var.AWS_ACCESS_KEY_ID}"
  secret_key = "${var.AWS_SECRET_ACCESS_KEY}"
  region     = "${var.region}"
}
```
