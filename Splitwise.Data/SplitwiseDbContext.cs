using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Splitwise.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Splitwise.Data
{
    public class SplitwiseDbContext :  DbContext
    {
        public SplitwiseDbContext(DbContextOptions<SplitwiseDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<SplitType> SplitTypes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Balance> Balances { get; set; }
        public DbSet<Repayment> Repayments { get; set; }
        public DbSet<GroupUser> GroupUsers { get; set; }
        public DbSet<Activity> Activities { get; set; }
    }

    public class SplitwiseDbContextFactory : IDesignTimeDbContextFactory<SplitwiseDbContext>
    {
        SplitwiseDbContext IDesignTimeDbContextFactory<SplitwiseDbContext>.CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SplitwiseDbContext>();
            optionsBuilder.UseSqlServer<SplitwiseDbContext>("Server = (localdb)\\mssqllocaldb; Database = SplitwiseDb; Trusted_Connection = False; MultipleActiveResultSets = true");

            return new SplitwiseDbContext(optionsBuilder.Options);
        }
    }
}
