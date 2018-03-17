ng build
tar -czvf dist.tar.gz -C dist .
scp dist.tar.gz root@147.135.210.1:/root/dist.tar.gz
ssh root@147.135.210.1 tar -zxvf dist.tar.gz -C /var/www/html/

