using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAPI.Data;
using WebAPI.Models;


namespace WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });


            builder.Services.AddDbContext<AppDbContext>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionString")));

            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("AllowAll",
            //        policy =>
            //        {
            //            policy.AllowAnyOrigin()
            //                  .AllowAnyMethod()
            //                  .AllowAnyHeader();
            //        });
            //});
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:3000") 
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });


            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("this_is_a_very_secure_secret_key_1234567890!")),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

        builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

            builder.Services.AddRazorPages();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "properties")),
                RequestPath = "/images/properties"
            });

            app.UseRouting();

            app.UseCors("AllowReactApp");

            app.UseAuthentication();
            app.UseAuthorization();

            //app.MapRazorPages();

            app.MapControllers();

            app.Run();
        }
    }
}
