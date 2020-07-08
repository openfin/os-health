# os-health

## deploy

aws s3 cp ./ s3://cdn.openfin.co/health2/ --recursive --exclude "*.json" --exclude "*.md" --exclude ".git/*"
aws s3 cp ./ s3://cdn.openfin.co/health2/ --recursive --exclude "*" --include "*.json" --content-type "application/json"
