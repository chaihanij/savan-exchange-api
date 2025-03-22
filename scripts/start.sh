#!/bin/bash
set -e

PORT=3000 \
MONGODB_URL="mongodb+srv://savanfinfin-dev:OE4tAeHrzxCWgJzz@savan-fin-fin-developme.vsl50.mongodb.net/savan-finfin-development" \
PUBLIC_KEY=$(cat resources/keys/public.key) \
PRIVATE_KEY=$(cat resources/keys/private.key) \
npm run start:dev