# :city_sunrise: now-builder-terraform

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
      "TF_VAR_AWS_ACCESS_KEY_ID": "@your_secret",
      "TF_VAR_AWS_SECRET_ACCESS_KEY": "@your_secret",
      "TF_VAR_REGION": "us-east-1"
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
