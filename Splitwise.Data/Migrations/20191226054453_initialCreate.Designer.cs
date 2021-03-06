﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Splitwise.Data;

namespace Splitwise.Data.Migrations
{
    [DbContext(typeof(SplitwiseDbContext))]
    [Migration("20191226054453_initialCreate")]
    partial class initialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.11-servicing-32099")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Splitwise.Core.Activity", b =>
                {
                    b.Property<int>("ActivityId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ActivityDetails");

                    b.Property<string>("CreatedAt");

                    b.Property<int>("GroupId");

                    b.Property<int>("UserId");

                    b.HasKey("ActivityId");

                    b.ToTable("Activities");
                });

            modelBuilder.Entity("Splitwise.Core.Balance", b =>
                {
                    b.Property<int>("BalanceId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<int>("ExpenseId");

                    b.Property<bool>("IsActive");

                    b.Property<string>("Modified");

                    b.Property<double>("NetBalance");

                    b.Property<double>("OwedShare");

                    b.Property<double>("PaidShare");

                    b.Property<int>("UserId");

                    b.HasKey("BalanceId");

                    b.ToTable("Balances");
                });

            modelBuilder.Entity("Splitwise.Core.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CategoryName");

                    b.Property<bool>("IsActive");

                    b.HasKey("CategoryId");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("Splitwise.Core.Currency", b =>
                {
                    b.Property<int>("CurrencyId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CurrencyName");

                    b.Property<bool>("IsActive");

                    b.HasKey("CurrencyId");

                    b.ToTable("Currencies");
                });

            modelBuilder.Entity("Splitwise.Core.Expense", b =>
                {
                    b.Property<int>("ExpenseId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("CreatedBy");

                    b.Property<string>("Currency");

                    b.Property<double>("ExpenseAmount");

                    b.Property<string>("ExpenseDate");

                    b.Property<string>("ExpenseName");

                    b.Property<int>("GroupId");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsSettlement");

                    b.Property<string>("Modified");

                    b.Property<string>("Notes");

                    b.Property<int>("PaidBy");

                    b.Property<string>("SplitType");

                    b.HasKey("ExpenseId");

                    b.ToTable("Expenses");
                });

            modelBuilder.Entity("Splitwise.Core.Friend", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<int>("FriendId");

                    b.Property<bool>("IsActive");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.ToTable("Friends");
                });

            modelBuilder.Entity("Splitwise.Core.Group", b =>
                {
                    b.Property<int>("GroupId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<int>("CreatedBy");

                    b.Property<string>("GroupCategory");

                    b.Property<string>("GroupLink");

                    b.Property<string>("GroupName");

                    b.Property<bool>("IsActive");

                    b.Property<string>("Modified");

                    b.Property<bool>("SimplifyDebts");

                    b.HasKey("GroupId");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("Splitwise.Core.GroupUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<int>("GroupId");

                    b.Property<bool>("IsActive");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.ToTable("GroupUsers");
                });

            modelBuilder.Entity("Splitwise.Core.Repayment", b =>
                {
                    b.Property<int>("RepaymentId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("Amount");

                    b.Property<string>("CreatedAt");

                    b.Property<int>("ExpenseId");

                    b.Property<int>("From");

                    b.Property<bool>("IsActive");

                    b.Property<int>("To");

                    b.HasKey("RepaymentId");

                    b.ToTable("Repayments");
                });

            modelBuilder.Entity("Splitwise.Core.SplitType", b =>
                {
                    b.Property<int>("TypeId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("IsActive");

                    b.Property<string>("Type_name");

                    b.HasKey("TypeId");

                    b.ToTable("SplitTypes");
                });

            modelBuilder.Entity("Splitwise.Core.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<bool>("IsActive");

                    b.Property<string>("Modified");

                    b.Property<string>("UserEmail");

                    b.Property<string>("UserName");

                    b.Property<string>("UserPassword");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
