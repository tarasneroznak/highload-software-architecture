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

# Network

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "hw27-vpc"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "hw27-igw"
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"
  tags = {
    Name = "hw27-nat"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_us_east_1a.id
  tags = {
    Name = "hw27-nat"
  }
  depends_on = [aws_internet_gateway.igw]
}

resource "aws_subnet" "private_us_east_1a" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.0.0/19"
  availability_zone = "us-east-1a"
  tags = {
    "Name" = "private-us-east-1a"
  }
}

resource "aws_subnet" "private_us_east_1b" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.32.0/19"
  availability_zone = "us-east-1b"
  tags = {
    "Name" = "private-us-east-1b"
  }
}

resource "aws_subnet" "public_us_east_1a" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.64.0/19"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
  tags = {
    "Name" = "public-us-east-1a"
  }
}

resource "aws_subnet" "public_us_east_1b" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.96.0/19"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true
  tags = {
    "Name" = "public-us-east-1b"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
  tags = {
    Name = "private"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "public"
  }
}

resource "aws_route_table_association" "private_us_east_1a" {
  subnet_id      = aws_subnet.private_us_east_1a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_us_east_1b" {
  subnet_id      = aws_subnet.private_us_east_1b.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "public_us_east_1a" {
  subnet_id      = aws_subnet.public_us_east_1a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_us_east_1b" {
  subnet_id      = aws_subnet.public_us_east_1b.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "http" {
  name        = "http"
  description = "Allow all http conncections"
  vpc_id      = aws_vpc.vpc.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ssh" {
  name        = "ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.vpc.id
  ingress {
    description = "ssh"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2

resource "aws_instance" "webserver" {
  count = 2

  ami           = "ami-053b0d53c279acc90" # Canonical, Ubuntu, 22.04 LTS, amd64 jammy image build on 2023-05-16
  instance_type = "t2.micro"
  user_data     = file("./servers/nginx${count.index}.tpl")

  subnet_id              = [aws_subnet.private_us_east_1a.id, aws_subnet.private_us_east_1b.id][count.index]
  vpc_security_group_ids = [aws_security_group.http.id, aws_security_group.ssh.id]

  tags = {
    name = "instance-${count.index}"
  }
}

# TG

resource "aws_lb_target_group" "target_group" {
  name                          = "tg"
  port                          = 80
  protocol                      = "HTTP"
  target_type                   = "instance"
  vpc_id                        = aws_vpc.vpc.id
  load_balancing_algorithm_type = "round_robin"
  health_check {
    enabled             = true
    interval            = 10
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group_attachment" "ec2_attach" {
  count            = length(aws_instance.webserver)
  target_group_arn = aws_lb_target_group.target_group.arn
  target_id        = aws_instance.webserver[count.index].id
  port             = 80
}

## ALB

resource "aws_lb" "alb" {
  name                       = "hw27-alb"
  internal                   = false
  load_balancer_type         = "application"
  subnets                    = [aws_subnet.public_us_east_1a.id, aws_subnet.public_us_east_1b.id]
  security_groups            = [aws_security_group.http.id]
  enable_deletion_protection = false
  tags = {
    name = "hw27-alb"
  }
}

resource "aws_lb_listener" "hw27_alb_listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

