terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

locals {
  region = "us-east-1"
}

provider "aws" {
  region  = local.region
  profile = "default"
}

data "aws_iam_policy_document" "lambda_images_bucket_write" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject"
    ]
    resources = [
      "${module.s3_bucket.s3_bucket_arn}/*"
    ]
  }
}

resource "aws_iam_policy" "lambda_images_bucket_write" {
  name        = "lambda_images_bucket_write"
  description = "Allows to get and put objects into the images bucket"
  path        = "/"
  policy      = data.aws_iam_policy_document.lambda_images_bucket_write.json
}


module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket_prefix = "hw30-"
  force_destroy = true
}

module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "hw30-lambda"
  description   = "My awesome lambda function"
  handler       = "index.handler"
  runtime       = "nodejs18.x"

  source_path = "./lambda"

  environment_variables = {
    REGION = local.region
    BUCKET_NAME = module.s3_bucket.s3_bucket_id
  }

  attach_policies    = true
  number_of_policies = 1
  policies = [
    aws_iam_policy.lambda_images_bucket_write.arn
  ]


  tags = {
    Name = "hw28-lambda"
  }
}


module "s3_bucket_notification" {
  source = "terraform-aws-modules/s3-bucket/aws//modules/notification"

  bucket = module.s3_bucket.s3_bucket_id

  lambda_notifications = {
    lambda2 = {
      function_arn  = module.lambda_function.lambda_function_arn
      function_name = module.lambda_function.lambda_function_name
      events        = ["s3:ObjectCreated:*"]
    }
  }
}
