using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Rewrite;
using TpDotNetCore.Data;
using TpDotNetCore.Helpers;
using TpDotNetCore.Auth;
using TpDotNetCore.Controllers;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain.Punches;
using System.Security.Claims;
using TpDotNetCore.Domain;
using Common.Communication;
using NSwag.AspNetCore;
using NSwag.SwaggerGeneration.Processors.Security;
using NSwag;
using NJsonSchema;

namespace TpDotNetCore
{
    public partial class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddJsonFile($"tp.appsettings.server.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsDevPolicy", builder =>
                {
                    builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });

            services.AddOptions();
            // Register the IConfiguration instance which TpConfigOptions binds against.
            services.Configure<MailConfigOptions>(Configuration.GetSection("MailConfigOptions"));

            // Add framework services.
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddEntityFrameworkSqlite().AddDbContext<TpContext>();
            services.AddTransient<DbInitializer>();

            services.AddTransient<IJwtFactory, JwtFactory>();

            services.AddTransient<ITpUserController, TpUserControllerImpl>();
            services.AddTransient<ITpProfileController, TpProfileControllerImpl>();
            services.AddTransient<ITpAdminController, TpAdminControllerImpl>();
            services.AddTransient<ITpPunchController, TpPunchControllerImpl>();
            services.AddTransient<ITpPuController, TpPuControllerImpl>();
            services.AddTransient<ITpOtherController, TpOtherControllerImpl>();
            services.AddSingleton<IHolidayService, HolidayService>();
            services.AddSingleton<ITimeService, TimeService>();
            services.AddTransient<AppUser>();
            services.AddTransient<IdentityRole>();
            services.AddTransient<AppUserManager>();
            services.AddTransient<ISlackClient, SlackClient>();
            services.AddTransient<ISendMail, SendMail>();
            services.AddTransient<IPunchService, PunchService>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();

            // api user claim policy
            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireApiUserRole", policy => policy.RequireClaim(ClaimTypes.Role, Constants.Strings.JwtClaims.ApiAccess));
                options.AddPolicy("RequireApiAdminRole", policy => policy.RequireClaim(ClaimTypes.Role, Constants.Strings.JwtClaims.ApiAccessAdmin));
                options.AddPolicy("RequireApiPowerRole", policy => policy.RequireClaim(ClaimTypes.Role, Constants.Strings.JwtClaims.ApiAccessPower));
            });

            services.AddIdentity<AppUser, IdentityRole>
                (o =>
                {
                    // configure identity options
                    o.Password.RequireDigit = false;
                    o.Password.RequireLowercase = false;
                    o.Password.RequireUppercase = false;
                    o.Password.RequireNonAlphanumeric = false;
                    o.Password.RequiredLength = 6;
                    o.SignIn.RequireConfirmedEmail = true;
                })
                .AddEntityFrameworkStores<TpContext>()
                .AddDefaultTokenProviders();

            services.AddMvc().AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());

            services.AddAutoMapper();

            ConfigureJwtAuthService(services);

            // Add framework services.
            services.AddMvc();

            services.AddSwagger(); // only needed for the UseSwaggger*WithApiExplorer() methods (below)
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, DbInitializer dbInitializer)
        {
            app.UseCors("CorsDevPolicy");

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            loggerFactory.AddFile("Logs/TpDotNet-{Date}.log");

            app.UseRewriter(new RewriteOptions().Add(new Rewriter
            {
                ExcludeLocalhost = true
            }));

            dbInitializer.Initialize();

            app.UseAuthentication();

            app.UseMvc();

            // API Explorer based (new)

            // Swagger v2.0

            app.UseSwaggerUiWithApiExplorer(s =>
            {
                s.SwaggerRoute = "/swagger_new_ui/v1/swagger.json";
                s.SwaggerUiRoute = "/swagger_new_ui";

                s.GeneratorSettings.DocumentProcessors.Add(new SecurityDefinitionAppender("TEST_HEADER", new SwaggerSecurityScheme
                {
                    Type = SwaggerSecuritySchemeType.ApiKey,
                    Name = "TEST_HEADER",
                    In = SwaggerSecurityApiKeyLocation.Header,
                    Description = "TEST_HEADER"
                }));
            });

            app.UseSwaggerUi3WithApiExplorer(s =>
            {
                s.SwaggerRoute = "/swagger_new_ui3/v1/swagger.json";
                s.SwaggerUiRoute = "/swagger_new_ui3";

                s.GeneratorSettings.DocumentProcessors.Add(new SecurityDefinitionAppender("TEST_HEADER", new SwaggerSecurityScheme
                {
                    Type = SwaggerSecuritySchemeType.ApiKey,
                    Name = "TEST_HEADER",
                    In = SwaggerSecurityApiKeyLocation.Header,
                    Description = "TEST_HEADER"
                }));
            });

            app.UseSwaggerReDocWithApiExplorer(s =>
            {
                s.SwaggerRoute = "/swagger_new_redoc/v1/swagger.json";
                s.SwaggerUiRoute = "/swagger_new_redoc";
            });

            // Swagger 3.0

            app.UseSwaggerWithApiExplorer(s =>
            {
                s.GeneratorSettings.SchemaType = SchemaType.OpenApi3;
                s.SwaggerRoute = "/swagger_new_v3/v1/swagger.json";
            });
        }
    }
}
