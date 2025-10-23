provider "aws" {
  region = var.aws_region
}

# 1. VPC
resource "aws_vpc" "backend_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "backend-vpc" }
}

# 2. Public Subnets
# Subnet A
resource "aws_subnet" "public_subnet_a" {
  vpc_id                  = aws_vpc.backend_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
  tags = { Name = "public-subnet-a" }
}

# Subnet B
resource "aws_subnet" "public_subnet_b" {
  vpc_id                  = aws_vpc.backend_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true
  tags = { Name = "public-subnet-b" }
}

# 3. Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.backend_vpc.id
  tags = { Name = "igw" }
}

# 4. Route Table
resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.backend_vpc.id
  tags = { Name = "route-table" }
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_route_table.route_table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "rta_a" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.route_table.id
}

resource "aws_route_table_association" "rta_b" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.route_table.id
}

# 5. Security Group
resource "aws_security_group" "backend_sg" {
  name        = "backend-sg"
  description = "Allow HTTP and SSH"
  vpc_id      = aws_vpc.backend_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

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

# 7a. Elastic IP for Backend EC2
# resource "aws_eip" "backend_eip" {
#   domain = "vpc"
#   tags         = { Name = "backend-eip" }
#   lifecycle {
#     prevent_destroy = true
#   }
# }

# Reference existing Elastic IP
data "aws_eip" "backend_eip" {
  public_ip = "3.223.170.7"
}


# 7b. Associate the Elastic IP with the EC2
resource "aws_eip_association" "backend_eip_assoc" {
  instance_id   = aws_instance.backend_ec2.id
  # allocation_id = aws_eip.backend_eip.id
  allocation_id = data.aws_eip.backend_eip.id
}

# 7c. EC2 Instance
resource "aws_instance" "backend_ec2" {
  ami           = "ami-0360c520857e3138f"
  instance_type = "t2.micro"
  key_name      = var.ec2_key_name
  subnet_id     = aws_subnet.public_subnet_a.id
  vpc_security_group_ids = [aws_security_group.backend_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              set -euo pipefail
              set -x
              exec > >(tee /var/log/user-data.log) 2>&1
              echo "Updating apt repositories..."
              apt update -y
              apt install -y docker.io docker-compose git

              systemctl enable docker
              systemctl start docker

              sudo rm -rf /home/ubuntu/backend
              sudo mkdir -p /home/ubuntu/backend
              sudo chown -R ubuntu:ubuntu /home/ubuntu/backend
              sudo chmod 755 /home/ubuntu/backend
              ls -la /home/ubuntu

              sudo -u ubuntu git clone ${var.repo_url} /home/ubuntu/backend
              echo "Setting up .env.production..."
              echo "Docker version:"
              docker --version
              echo "Docker-compose version:"
              docker-compose --version
              cd /home/ubuntu/backend
              sudo rm -rf /home/ubuntu/backend/.env.production
              if [ -e .env.production ]; then
                rm -rf .env.production
              fi

              echo "Repo contents:"
              ls -R /home/ubuntu/backend
              cat <<EOF2 > .env.production
              APP_ENV=production
              APP_KEY=${var.app_key}
              APP_DEBUG=false
              APP_URL=http://${data.aws_eip.backend_eip.public_ip}
              APP_LOCALE=en
              APP_FALLBACK_LOCALE=en
              APP_FAKER_LOCALE=en_US
              APP_MAINTENANCE_DRIVER=file
              PHP_CLI_SERVER_WORKERS=4
              BCRYPT_ROUNDS=12
              LOG_CHANNEL=errorlog
              LOG_LEVEL=error
              DB_CONNECTION=mysql
              DB_HOST=mysql_prod
              DB_PORT=3306
              DB_DATABASE=${var.db_username}_db
              DB_USERNAME=${var.db_username}
              DB_PASSWORD=${var.db_password}
              DB_SSL=false
              CACHE_STORE=array
              SESSION_DRIVER=file
              EOF2

              sudo chown ubuntu:ubuntu .env.production
              sudo chmod 644 .env.production

              cat <<EOC > docker-compose.prod.yml
              services:
                backend:
                  build:
                    context: ./backend
                    dockerfile: Dockerfile
                  container_name: backend_prod
                  restart: unless-stopped
                  ports:
                    - "80:80"
                  volumes:
                    - .:/var/www
                    - ./storage:/var/www/storage
                  env_file:
                    - ./.env.production
                  depends_on:
                    - mysql_prod
                  networks:
                    - prod_network

                mysql_prod:
                  image: mysql:8.0
                  container_name: mysql_prod
                  restart: unless-stopped
                  environment:
                    MYSQL_ROOT_PASSWORD: ${var.db_password}
                    MYSQL_DATABASE: ${var.db_username}_db
                    MYSQL_USER: ${var.db_username}
                    MYSQL_PASSWORD: ${var.db_password}
                  command: --default-authentication-plugin=mysql_native_password --ssl-mode=DISABLED --skip-ssl
                  ports:
                    - "3306:3306"
                  volumes:
                    - mysql_prod_data:/var/lib/mysql
                  networks:
                    - prod_network

              networks:
                prod_network:
                  driver: bridge

              volumes:
                mysql_prod_data:
              EOC

              docker-compose -f docker-compose.prod.yml down -v
              docker-compose -f docker-compose.prod.yml up -d --build
              EOF

  tags = { Name = "BackendProduction" }
}
