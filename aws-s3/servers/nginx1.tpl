#!/bin/bash
sudo apt update -y &&
sudo apt install -y nginx
echo "second" > /var/www/html/index.html