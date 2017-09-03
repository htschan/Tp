
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain.Punches;

namespace TpDotNetCore.Data
{
    public class TpContext : IdentityDbContext<AppUser>
    {
        public TpContext() { }

        public TpContext(DbContextOptions options) : base(options) { }

        // public DbSet<User> Users { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
        
        public DbSet<AppUser> AppUsers { get; set; }

        public DbSet<Punch> Punches { get; set; }

        public DbSet<DayPunch> DayPunches { get; set; }

        public DbSet<WeekPunch> WeekPunches { get; set; }

        public DbSet<MonthPunch> MonthPunches { get; set; }

        public DbSet<YearPunch> YearPunches { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=tp.sqlite");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<DayPunch>().HasIndex(d => d.Day);
            builder.Entity<WeekPunch>().HasIndex(d => d.Week);
            builder.Entity<MonthPunch>().HasIndex(d => d.Month);
            builder.Entity<YearPunch>().HasIndex(d => d.Year);
        }
    }
}