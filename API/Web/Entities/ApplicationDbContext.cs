﻿using DALImpl.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DALImpl.EfDbContext
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
    {
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        
        public DbSet<ApplicationRole> ApplicationRoles { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);
        //    // Customize the ASP.NET Identity model and override the defaults if needed.
        //    // For example, you can rename the ASP.NET Identity table names and more.
        //    // Add your customizations after calling base.OnModelCreating(builder);
        //}

    }
}