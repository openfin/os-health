# os-health

## deploy
deploys can be to the beta env (cdn.openfin.co/health/) or to the website via zip file

### deploy to beta environment
```
aws s3 cp ./index.html s3://cdn.openfin.co/health2/index.html
aws s3 cp ./pinger.js s3://cdn.openfin.co/health2/pinger.js
aws s3 cp ./urls.json s3://cdn.openfin.co/health2/urls.json --content-type "application/json"
```

### package for website update
```
tar -zcf health.tgz urls.json pinger.js index.html
```

### CDN health check file
this file only needs to be deployed once and will most likely never be updated but it does need CORS headers configured
```
aws s3 cp ./health.html s3://cdn.openfin.co/health.html
```
