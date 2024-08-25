#!/bin/bash
ssh -t ubuntu@192.168.3.192 '
export PATH="$PATH:$HOME/.local/bin"
cd /data/www/vietnam-location

echo \"======== PULLING CODE ========\"
git pull --no-edit origin main


echo \"======== BUILDING CODE ========\"
yarn
bash scripts/generate_proto.sh
yarn build
#pm2 start yarn --name vietnam-location -- start
pm2 restart vietnam-location --update-env
'