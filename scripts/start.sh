#!/bin/bash
set -e
PORT=3000 \
MONGODB_URL="mongodb+srv://admin:eYIcepkCm9w5bpSf@savan-ex.zcug2wh.mongodb.net/savan-ex" \
PUBLIC_KEY=$(cat resources/keys/public.key) \
PRIVATE_KEY=$(cat resources/keys/private.key) \
AWS_ACCESS_KEY=AKIAYT3NOVDEHGYE6AP3 \
AWS_SECRET_ACCESS_KEY=W2NWOqWFiSPdoqED2SM4yTuYLqslz \
AWS_REGION=ap-southeast-1 \
AWS_BUCKET_NAME=savan-ex-develop \
npm run start:dev
