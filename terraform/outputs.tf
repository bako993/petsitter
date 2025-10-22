output "ec2_public_ip" {
  description = "Public IP of the EC2 backend server"
  value       = aws_eip.backend_eip.public_ip
}
