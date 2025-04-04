#!/bin/bash
set -e
PORT=3000 \
MONGODB_URL="mongodb+srv://savanfinfin-dev:OE4tAeHrzxCWgJzz@savan-fin-fin-developme.vsl50.mongodb.net/savan-finfin-development" \
PUBLIC_KEY=$(cat resources/keys/public.key) \
PRIVATE_KEY=$(cat resources/keys/private.key) \
AWS_ACCESS_KEY=AKIA56SZP5WB7BALDV5G \
AWS_SECRET_ACCESS_KEY=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 \
AWS_REGION=ap-southeast-1 \
AWS_BUCKET_NAME=savan-finfin-develop \
npm run start:dev