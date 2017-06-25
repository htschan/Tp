See Tutorial:
# Developing a RESTful API With Node and TypeScript

<http://mherman.org/blog/2016/11/05/developing-a-restful-api-with-node-and-typescript/#.WHD5TfnhC70>

# Authenticate a NodeJS API with JSON Web Tokens

https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

# Token based Authentication with AngularJS and NodeJS

https://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543

# Swagger

`npm install -g swagger`

Put the Swagger specification `swagger.yaml` into this folder: `./api/swagger`

To edit the specification:
`swagger project edit`

## Variant #1
`npm install -g swagger-tools`
index.ts
var swaggerDoc = require('./swagger.json');
var swaggerTools = require('swagger-tools');

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
  App.use(middleware.swaggerUi());
});


# ES6 Promises

http://2ality.com/2014/10/es6-promises-api.html

## Debugging:

Configure VS Code: <https://code.visualstudio.com/docs/editor/node-debugging#_source-maps>

Make sure build task generates embedded sourcemaps:
```javascript
gulp.task('transpile', () => {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});
```
launch.json is something like this:
```javascript
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Programm starten",
            "program": "${workspaceRoot}\\src\\index.ts",
            "cwd": "${workspaceRoot}",
            "outFiles": ["${workspaceRoot}/dist/**/*.js"],
            "sourceMaps": true
        },
```



# Configure Synology DS215 with Armada Processor

## Install optware-ng

<https://gist.github.com/ffeldhaus/226f2c5743a7f631806d>

## Install gcc
Become root with `# sudo -i` 


## Install node-gyp

Become root with `# sudo -i` 

Now we can install packages with ipkg

`# ipkg install gcc`

Refer to this site for node-gyp prerequisites:
<https://github.com/nodejs/node-gyp>

On Unix, this must be installed:
- python 2.7
- make
- gcc

`# npm install -g node-gyp`



# Installation auth0

auth0 as an alternative to passport

<https://auth0.com/docs/quickstart/backend/nodejs>

`npm install --save jsonwebtoken`
`npm install --save-dev @types/jsonwebtoken`


# Installation TypeORM

TypeORM is an Object Relational Mapper for Typescript.

https://typeorm.github.io/index.html

# Installation typedi

Dependency Injection Tool for TypeScript.

https://github.com/pleerock/typedi

# Installatio Nodemailer community version

`npm install --save nodemailer@2.7.2`

`npm install --save @types/nodemailer`


# Synology

## Install Production Process Manager for Node.js

Refer to    
`https://github.com/Unitech/pm2`

``npm install pm2 -g``

``pm2 start dist/index.js``

`pm2 startup                   # Detect init system, generate and configure pm2 boot on startup`

Startup script in ``/etc/init/pm2.conf``


## Nginx
Nginx is installed per default.
http://localhost:5000 points to the management site.

To use nginx as a proxy server for node applications, add entries in this folder:

`/usr/local/etc/nginx/sites-enabled`


```javascript
server{
    listen 80;
    listen [::]:80 ipv6only=on;

    server_name timepuncher.myds.me;

    access_log /var/log/nginx/tp.access.log;
    error_log /var/log/nginx/tp.error.log;  

    location /tp {
        rewrite /tp(.*) $1 break;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```


To restart nginx:
`sudo synoservicectl --restart nginx`

Reload nginx configuration:
`nginx -s reload`

nginx-Logfile:
`/var/log/upstart/nginx.log`


Other comands
http://www.synology-wiki.de/index.php/Grundlegende_Befehle_auf_der_Kommandozeile


# Installation on CentOS

## Setup Users and SSH

Use PuTTYgen to generate SSG-Keypairs.
Paste the public key into the file 'authorized_keys'. The key must start with "ssh-rsa AAAA ...."

```
$ su - <the User>
$ mkdir .ssh
$ chmod 700 .ssh

$ vi .ssh/authorized_keys
$ chmod 600 .ssh/authorized_keys
$ exit
```
Once SSH login is setup, disable Username/Password login:

sudo vim /etc/ssh/sshd_config

```
[...]
PasswordAuthentication no
[...]
UsePAM no
[...]
```
`systemctl reload sshd`


https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-7

## Set Timezone and setup NTP

`sudo timedatectl set-timezone region/timezone`

```
sudo yum install ntp
sudo systemctl start ntpd
sudo systemctl enable ntpd
```

## Install Midnight Commander

`sudo yum -y install mc`

## Install mariadb
https://support.rackspace.com/how-to/installing-mysql-server-on-centos/


`sudo yum install mariadb-server mariadb`

## Install git

https://www.digitalocean.com/community/tutorials/how-to-install-git-on-centos-7

## Install NodeJS

https://nodejs.org/en/download/package-manager/

## Setup Firewall

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-using-firewalld-on-centos-7

## Install Nginx

https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7

Default Homepage
`/usr/share/nginx/html`

SE-Linux Status
`sestatus`

Persist httpd-SELinux Flag
`setsebool httpd_can_network_connect on -P`

List available SELinux booleans
`getsebool -a | grep httpd` 


## Setup SSL and Certificate with Nginx

https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-centos-7


Create crontab job to renew the certificate

`30 2 * * 1 /usr/bin/certbot renew >> /var/log/le-renew.log`
`35 2 * * 1 /usr/bin/systemctl reload nginx`

Renew manually
sudo certbot renew certonly -a webroot --webroot-path=/usr/share/nginx/html -d timepuncher.ch

Refer to nginx.conf sample.

### Test your SSL server

https://www.ssllabs.com/ssltest/analyze.html?d=timepuncher.ch

### How to setup an NodeJS application

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-centos-7

