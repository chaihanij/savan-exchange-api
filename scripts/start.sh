#!/bin/bash
set -e
PORT=3000 \
MONGODB_URL="mongodb+srv://admin:eYIcepkCm9w5bpSf@savan-ex.zcug2wh.mongodb.net/savan-ex" \
PUBLIC_KEY=$(cat resources/keys/public.key) \
PRIVATE_KEY=$(cat resources/keys/private.key) \
AWS_ACCESS_KEY=AKIA56SZP5WB7BALDV5G \
AWS_SECRET_ACCESS_KEY=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 \
AWS_REGION=ap-southeast-1 \
AWS_BUCKET_NAME=savan-exchange-develop \
npm run start:dev