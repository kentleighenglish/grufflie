ssh -i ~/.ssh/aws.pem ec2-user@aws 'cd /var/www/vhost/grufflie; hg pull; hg update -C; npm run build:aot;';