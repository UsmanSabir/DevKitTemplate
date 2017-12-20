using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Primitives;
using DALImpl.EfDbContext;
using DALImpl.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Core;
using OpenIddict.Models;

namespace Api.Web.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomDbContext(this IServiceCollection services)
        {
            // Add framework services.
            services.AddDbContextPool<ApplicationDbContext>(options =>
            {
                string useSqLite = Startup.Configuration["ConnectionStrings:useSqLite"];
                string useInMemory = Startup.Configuration["ConnectionStrings:useInMemory"];
                //if (useInMemory.ToLower() == "true")
                //{
                //    options.UseInMemoryDatabase("AspNetCoreSpa"); // Takes database name
                //}
                //else if (useSqLite.ToLower() == "true")
                {
                    options.UseSqlite(Startup.Configuration["ConnectionStrings:Default"]);
                }
                //else
                //{
                //    options.UseSqlServer(Startup.Configuration["ConnectionStrings:Default"]);
                //}

                // Register the entity sets needed by OpenIddict.
                // Note: use the generic overload if you need
                // to replace the default OpenIddict entities.
                options.UseOpenIddict();
            });
            return services;
        }

        public static IServiceCollection RegisterCustomIdentity(this IServiceCollection services)
        {
            // Register the Identity services.
            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
                {
                    options.Password.RequiredLength = 4;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    //options.Password.
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            

            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            //.AddJwtBearer(x =>
            //{
            //    x.RequireHttpsMetadata = false;
            //    x.SaveToken = true;
            //    x.TokenValidationParameters = new TokenValidationParameters
            //    {
            //        ValidateIssuerSigningKey = true,
            //        IssuerSigningKey = new SymmetricSecurityKey(key),
            //        ValidateIssuer = false,
            //        ValidateAudience = false
            //    };
            //});
            
            services.RegisterOpenIddictService();

            return services;
        }

        public static IServiceCollection RegisterOpenIddictService(this IServiceCollection services)
        {
            // Register the OpenIddict services.
            // Note: use the generic overload if you need
            // to replace the default OpenIddict entities.
            services.AddOpenIddict(options =>
            {
                // Register the Entity Framework stores.
                options.AddEntityFrameworkCoreStores<ApplicationDbContext>();

                // Register the ASP.NET Core MVC binder used by OpenIddict.
                // Note: if you don't call this method, you won't be able to
                // bind OpenIdConnectRequest or OpenIdConnectResponse parameters.
                options.AddMvcBinders();

                // Enable the token endpoint (required to use the password flow).
                options.EnableAuthorizationEndpoint("/connect/authorize") // Enable the authorization endpoint.// Form implicit flow (used in social login redirects)
                .EnableTokenEndpoint("/connect/token");

                // Allow client applications to use the grant_type=password flow.
                options.AllowPasswordFlow()
                .AllowRefreshTokenFlow()
                .AllowAuthorizationCodeFlow()
                .AllowClientCredentialsFlow()
                .AllowImplicitFlow();

                options.SetAccessTokenLifetime(TimeSpan.FromMinutes(30)); 
                options.SetIdentityTokenLifetime(TimeSpan.FromMinutes(30));
                options.SetRefreshTokenLifetime(TimeSpan.FromMinutes(60));

                
                // Note: to use JWT access tokens instead of the default
                // encrypted format, the following lines are required:
                //
                options.UseJsonWebTokens();
                //if (Startup.HostingEnv.IsDevelopment()) // Recomended for production
                    options.AddEphemeralSigningKey();
                //else // Recomended for production
                //    options.AddSigningCertificate(new FileStream(Directory.GetCurrentDirectory() + "/Resources/cert.pfx", FileMode.Open), "password");

                // During development, you can disable the HTTPS requirement.
                //if (Startup.HostingEnv.IsDevelopment()) // Recomended for production
                options.DisableHttpsRequirement();


            });

            // If you prefer using JWT, don't forget to disable the automatic
            // JWT -> WS-Federation claims mapping used by the JWT middleware:
            //
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

            //services.AddAuthentication()
            //    .AddJwtBearer(options =>
            //    {
            //        options.Authority = "http://localhost:57310/";
            //        options.Audience = "resource_server";
            //        options.RequireHttpsMetadata = false;
            //        options.TokenValidationParameters = new TokenValidationParameters
            //        {
            //            NameClaimType = OpenIdConnectConstants.Claims.Subject,
            //            RoleClaimType = OpenIdConnectConstants.Claims.Role
            //        };
            //    });


            services.AddAuthentication(x =>
                {
                    // This will override default cookies authentication scheme
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                //.AddOAuthValidation() // to use oAtuh authentication instead of jwt
                .AddJwtBearer(x =>
                {
                    x.Authority = Startup.Configuration["Auth:Authority"];
                    x.Audience = "resource_server";
                    x.RequireHttpsMetadata = false;
                    //x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = false,

                        //IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        NameClaimType = OpenIdConnectConstants.Claims.Subject,
                        RoleClaimType = OpenIdConnectConstants.Claims.Role,
                        RequireExpirationTime = true
                    };

                });
                //.AddGoogle(options =>
                //{
                //    options.ClientId = "TestClientId"; // Startup.Configuration["Authentication:Google:ClientId"];
                //    options.ClientSecret = "SomeSecret".Sha256(); // Startup.Configuration["Authentication:Google:ClientSecret"];
                //});

            return services;
        }

        public static async Task RegisterOpenIddictClientApp(this IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {

                // Create a new service scope to ensure the database context is correctly disposed when this methods returns.
                using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    if (!context.AllMigrationsApplied())
                    {
                        //await context.Database.EnsureCreatedAsync();
                        await context.Database.MigrateAsync();
                    }

                    // Note: when using a custom entity or a custom key type, replace OpenIddictApplication by the appropriate type.
                    var manager = scope.ServiceProvider.GetRequiredService<OpenIddictApplicationManager<OpenIddictApplication>>();
                    CancellationToken cancellationToken = CancellationToken.None;

                    string clientIdentifier = Startup.Configuration["Auth:ClientId"];
                    if (await manager.FindByClientIdAsync(clientIdentifier, cancellationToken) == null)
                    {
                        string clientSecret = Startup.Configuration["Auth:ClientSecret"]; // "[client secret]";
                        string redirectUri = Startup.Configuration["Auth:RedirectUrl"]; // "[redirect uri]";
                        var descriptor = new OpenIddictApplicationDescriptor
                        {
                            ClientId = clientIdentifier,
                            //ClientSecret = clientSecret.Sha256(),
                            RedirectUris = { new Uri(redirectUri) }
                        };

                        await manager.CreateAsync(descriptor, cancellationToken);
                    }

                    var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
                    if (!userManager.Users.Any())
                    {

                        var user = new ApplicationUser() { UserName = "Test" };
                        var result = await userManager.CreateAsync(user, "12345");

                        if (result.Succeeded)
                        {
                            //user created
                        }
                        else
                        {
                            //failed
                        }
                    }

                }
            }


        }

        private static string Sha256(this string str)
        {
            using (var sha256 = SHA256.Create())
            {
                // Send a sample text to hash.  
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(str));
                // Get the hashed string.  
                var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                return hash;
            }
        }
    }
}