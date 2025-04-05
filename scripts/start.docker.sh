#!/bin/bash
docker run -it --rm -p 3000:3000 \
 -e PORT=3000 \
 -e MONGODB_URL="mongodb+srv://savanfinfin-dev:OE4tAeHrzxCWgJzz@savan-fin-fin-developme.vsl50.mongodb.net/savan-finfin-development" \
 -e PUBLIC_KEY=$(cat resources/keys/public.key) \
 -e PRIVATE_KEY=$(cat resources/keys/private.key) \
 -e AWS_ACCESS_KEY=AKIA56SZP5WB7BALDV5G \
 -e AWS_SECRET_ACCESS_KEY=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 \
 -e AWS_REGION=ap-southeast-1 \
 -e AWS_BUCKET_NAME=savan-finfin-develop savan-exchange-api
