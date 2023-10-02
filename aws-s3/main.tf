terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "default"
}

locals {
  bucket_name = "s3-bucket-hw28-123456789"
  region      = "eu-west-1"
}

resource "aws_iam_role" "this" {
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_kms_key" "objects" {
  description             = "KMS key is used to encrypt bucket objects"
  deletion_window_in_days = 7
}

data "aws_caller_identity" "current" {}
data "aws_iam_policy_document" "bucket_policy" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_iam_role.this.arn]
    }

    actions = [
      "s3:ListBucket",
    ]

    resources = [
      "arn:aws:s3:::${local.bucket_name}",
    ]
  }
}

module "log_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket        = "logs-s3-bucket-hw28-123456789"
  force_destroy = true


  control_object_ownership          = true
  attach_access_log_delivery_policy = true

  access_log_delivery_policy_source_accounts = [data.aws_caller_identity.current.account_id]
  access_log_delivery_policy_source_buckets  = ["arn:aws:s3:::${local.bucket_name}"]
}

module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket                                   = local.bucket_name
  acceleration_status                      = "Suspended"
  request_payer                            = "BucketOwner"
  force_destroy                            = true
  acl                                      = "private"
  attach_policy                            = true
  policy                                   = data.aws_iam_policy_document.bucket_policy.json
  allowed_kms_key_arn                      = aws_kms_key.objects.arn
  attach_deny_insecure_transport_policy    = true
  attach_require_latest_tls_policy         = true
  attach_deny_incorrect_encryption_headers = true
  attach_deny_incorrect_kms_key_sse        = true
  attach_deny_unencrypted_object_uploads   = true
  control_object_ownership                 = true
  object_ownership                         = "BucketOwnerPreferred"
  expected_bucket_owner                    = data.aws_caller_identity.current.account_id
  logging = {
    target_bucket = module.log_bucket.s3_bucket_id
    target_prefix = "log/"
  }
}

module "ole_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket        = "ole-s3-bucket-hw28-123456789"
  force_destroy = true

  object_lock_enabled = true
  object_lock_configuration = {
    rule = {
      default_retention = {
        mode = "COMPLIANCE"
        days = 1
      }
    }
  }
}
