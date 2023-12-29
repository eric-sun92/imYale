variable "stage-prefix" {
    type = string
    default = "imyale-prod"

    description = "The prefix to use for all resources in this stage"

    validation {
        condition = length(var.stage-prefix) <= 20
        error_message = "The stage prefix must be 20 characters or less"
    }
}

provider "aws" {
    region = "us-east-2"
}

resource "aws_s3_bucket" "bucket" {
    bucket = "imyale-deployment-data"
}

resource "aws_s3_bucket_versioning" "versioning" {
    bucket = aws_s3_bucket.bucket.id
    versioning_configuration {
        status = "Enabled"
    }
}

resource "aws_iam_role" "role" {
    name = "imyale-deployment-role-for-ec2"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Principal = {
                    Service = "ec2.amazonaws.com"
                }
            },
        ]
    })
}

resource "aws_iam_role_policy" "policy" {
    name = "IMYALE-Deployment-S3ReadAccess"
    role = aws_iam_role.role.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = [
                    "s3:GetObject",
                    "s3:ListBucket"
                ]
                Effect   = "Allow"
                Resource = [
                    "${aws_s3_bucket.bucket.arn}",
                    "${aws_s3_bucket.bucket.arn}/*"
                ]
            },
        ]
    })
}

resource "aws_instance" "instance" {
    ami           = "ami-0e83be366243f524a"  # replace with your preferred AMI
    instance_type = "t3.micro"  # replace with your preferred instance type

    iam_instance_profile = aws_iam_instance_profile.profile.name

    tags = {
        Name = "imyale-prod"
    }
}

resource "aws_iam_instance_profile" "profile" {
    name = "imyale-deployment-profile-for-ec2"
    role = aws_iam_role.role.name
}

resource "aws_eip_association" "eip_assoc" {
    instance_id   = aws_instance.instance.id
    allocation_id = "eipalloc-081f042bc5af3777c"
}
