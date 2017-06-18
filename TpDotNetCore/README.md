

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

Follow this article for User authentication with Angular and ASP.NET Core
(using JWT-Token authentication and ASP.NET Core Identity)
https://fullstackmark.com/post/10/user-authentication-with-angular-and-asp-net-core#create-new-users
https://goblincoding.com/2016/07/03/issuing-and-authenticating-jwt-tokens-in-asp-net-core-webapi-part-i/

# ASP.NET Core Security
https://docs.microsoft.com/en-us/aspnet/core/security/



# Configuration in ASP.NET Core

https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration#options-config-objects
http://developer.telerik.com/featured/new-configuration-model-asp-net-core/


















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

## Username/Passowrd base token JWT authentication

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


