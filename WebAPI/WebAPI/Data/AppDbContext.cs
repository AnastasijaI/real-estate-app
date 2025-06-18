using WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace WebAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }
        public DbSet<Favourite> Favourites { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Property>()
               .HasOne(p => p.User)
               .WithMany(u => u.Properties)
               .HasForeignKey(p => p.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Favourite>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Favourite>()
                .HasOne(f => f.Property)
                .WithMany()
                .HasForeignKey(f => f.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<AppSurvey>()
                .HasOne(s => s.User)
                .WithMany() 
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

        }
        public DbSet<WebAPI.Models.AppSurvey> AppSurvey { get; set; } = default!;

    }
}
