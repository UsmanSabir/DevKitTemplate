using System;
using System.Threading.Tasks;
using Api.Web.Extensions;
using Api.Web.Filters;
using Api.Web.Helpers;
using Api.Web.Middlewares;
using Api.Web.Services;
using AutoMapper;
using DALImpl.EfDbContext;
using DALImpl.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Api.Web
{
    public class Startup
    {
        public static IHostingEnvironment HostingEnv;

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            HostingEnv = env;

        }

        public static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddAutoMapper();
            //services.AddAutoMapper(typeof(Startup));

            //var appSettingsSection = Configuration.GetSection("AppSettings");
            //services.Configure<AppSettings>(appSettingsSection);
 
            //// configure jwt authentication
            //var appSettings = appSettingsSection.Get<AppSettings>();
            //var key = System.Text.Encoding.ASCII.GetBytes(appSettings.Secret);
            

            services.AddResponseCompression(options =>
            {
                options.MimeTypes = Utils.DefaultMimeTypes;
            });

            services.AddSingleton<IAuthService,AuthService>();
            services.AddScoped<ApiExceptionFilter>();

            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(ModelValidationFilter));
            });

            services.AddCustomDbContext();

            //// Register the Identity services.
            services.RegisterCustomIdentity();
            //services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            //    {
            //        options.Password.RequiredLength = 4;
            //        options.Password.RequireNonAlphanumeric = false;
            //    })
            //    .AddEntityFrameworkStores<ApplicationDbContext>()
            //    .AddDefaultTokenProviders();
            //;
            ////
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                //using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
                //{
                //    // For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
                //    serviceScope.ServiceProvider.GetService<ApplicationDbContext>().Database.Migrate(); //this will generate the db if it does not exist
                //}

                app.RegisterOpenIddictClientApp(env).Wait();

                app.UseCors(options =>
                {
                    options.AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowAnyOrigin()
                        .AllowCredentials();
                });

                app.UseAuthentication();

                app.UseSimulatedLatency(TimeSpan.FromMilliseconds(200), TimeSpan.FromMilliseconds(400));
            }

            

            // global cors policy
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());


 
            app.UseAuthentication();
 
            app.UseMvc();
        }
    }
}
