

Install NodeJS 6.x (LTS)

Install Visual Studio 2017 
or
Latest ASPNET Core SDK here: https://www.microsoft.com/net/download/core

Then on command line install the SPA-Templates:


> dotnet new --install Microsoft.AspNetCore.SpaTemplates::*

To view the templates:

> dotnet new

Blog about SPA-Templates:
https://blogs.msdn.microsoft.com/webdev/2017/02/14/building-single-page-applications-on-asp-net-core-with-javascriptservices/

Scaffolding the project:

> mkdir test1
> cd test1
> dotnet new angular

Restore dependencies:
> dotnet restore
> npm install

Run the application

> dotnet run

Open browser and point it to http://localhost:5000


-----------------------------------
Install Swashbuckle Swagger API documentation

https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger
https://github.com/domaindrivendev/Swashbuckle



-----------------------------------
Hot Module Replacement


npm install --save webpack-hot-middleware

# SQlite

Follow this article to setup Sqlite:
https://docs.microsoft.com/en-us/ef/core/get-started/netcore/new-db-sqlite

Create the database

`# dotnet ef migrations add InitialCreate`
`# dotnet ef database update`

After making furhter changes
`# dotnet ef migrations add`

Follow this article for User authentication with Angular and ASP.NET Core with Refresh Token
(using JWT-Token authentication and ASP.NET Core Identity)
http://www.c-sharpcorner.com/article/handle-refresh-token-using-asp-net-core-2-0-and-json-web-token/

/* obsolete
https://fullstackmark.com/post/10/user-authentication-with-angular-and-asp-net-core#create-new-users
https://goblincoding.com/2016/07/03/issuing-and-authenticating-jwt-tokens-in-asp-net-core-webapi-part-i/
/*

# ASP.NET Core Security
https://docs.microsoft.com/en-us/aspnet/core/security/



# Configuration in ASP.NET Core

https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration#options-config-objects
http://developer.telerik.com/featured/new-configuration-model-asp-net-core/



# Configure IIS as reverse proxy for Kestrel web server

Install .NET Core Server Hosting Bundle: https://go.microsoft.com/fwlink/?linkid=848766

Install NodeJS (v6.11.1 doesn't work, v6.9.5 is ok)

https://docs.microsoft.com/en-us/aspnet/core/publishing/iis
https://docs.microsoft.com/en-us/iis/publish/troubleshooting-web-deploy/troubleshooting-common-problems-with-web-deploy

## Let's Encrypt on Windows IIS

Install the IIS URL Rewrite module and configure redirect to HTTPS except for Let's encrypt challenges (refer to web.config)

https://weblog.west-wind.com/posts/2016/feb/22/using-lets-encrypt-with-iis-on-windows



# SSH on Windows 2012 R2

https://github.com/PowerShell/Win32-OpenSSH/wiki/Install-Win32-OpenSSH

In sshd_config change this line
`PidFile .\logs\sshd.pid`

Make folder `logs` readable for this user `NT Service\sshd`

Don't delete the private keys in the OpenSSH folder

Put the public key of the client user into this file

`c:\Users\<user>\.ssh\authorized_keys`

In the file `authorized_key` delete header and footer, put everythin on one line and prepend the key with `ssh-rsa`.
Sample: `ssh-rsa AAAAB3NzaC.....rPLaYw==`

Run powershell as another user:

`start powershell -credential ""`


Deployment with Git
http://www.bk2k.info/zeige/website-deployment-mit-git.html






-----------------------------------
# Identity Server

Getting started with IdentityServer4
https://www.scottbrady91.com/Identity-Server/Getting-Started-with-IdentityServer-4

The problem with OAuth for Authentication
http://www.thread-safe.com/2012/01/problem-with-oauth-for-authentication.html?view=classic

## Basic Setup

Add these NuGet packages to the project:
- IdentityServer4
- IdentityServer4.AccessTokenValidation 

## Username/Password based token JWT authentication

Refer to http://docs.identityserver.io/en/release/quickstarts/0_overview.html

The discovery endpoint will be here:
http://localhost:5000/.well-known/openid-configuration

To manually request an access_token, issue a raw HTML-Post to the token_endpoint
http://localhost:5000/connect/token

with these parameters
Header: 
- Content-Type=application/x-www-form-urlencoded
Body
- grant_type=client_credentials
- scope=yourScope
- client_id=yourClientId
- client_secret=yourClientSecret

In the response you will get an access_token which you can supply to http://jwt.io to verify and decode.


