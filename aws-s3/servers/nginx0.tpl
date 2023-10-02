#!/bin/bash
sudo apt update -y &&
sudo apt install -y nginx
echo "first" > /var/www/html/index.html