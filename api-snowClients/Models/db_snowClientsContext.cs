using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace api_snowClients.Models
{
    public partial class db_snowClientsContext : DbContext
    {
        public db_snowClientsContext()
        {
        }

        public db_snowClientsContext(DbContextOptions<db_snowClientsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Address> Addresses { get; set; } = null!;
        public virtual DbSet<Client> Clients { get; set; } = null!;
        public virtual DbSet<Country> Countries { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=MSI\\SQLEXPRESS;Database=db_snowClients;Trusted_Connection=true;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>(entity =>
            {
                entity.ToTable("Address");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AddressLine1)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("address_line_1");

                entity.Property(e => e.AddressLine2)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("address_line_2");

                entity.Property(e => e.City)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("city");

                entity.Property(e => e.CountryId).HasColumnName("country_ID");

                entity.Property(e => e.PostalCode)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("postal_code");

                entity.Property(e => e.Region)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("region");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK__Address__country__6477ECF3");
            });

            modelBuilder.Entity<Client>(entity =>
            {
                entity.ToTable("Client");

                entity.HasIndex(e => e.Email, "UQ__Client__AB6E6164CF72848B")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Email)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("first_name");

                entity.Property(e => e.LastName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("last_name");

                entity.Property(e => e.Phone)
                    .HasColumnType("numeric(10, 0)")
                    .HasColumnName("phone");

                entity.HasMany(d => d.Addresses)
                    .WithMany(p => p.Clients)
                    .UsingEntity<Dictionary<string, object>>(
                        "ClientAddress",
                        l => l.HasOne<Address>().WithMany().HasForeignKey("AddressId").HasConstraintName("FK__client_ad__addre__68487DD7"),
                        r => r.HasOne<Client>().WithMany().HasForeignKey("ClientId").HasConstraintName("FK__client_ad__clien__6754599E"),
                        j =>
                        {
                            j.HasKey("ClientId", "AddressId").HasName("PK__client_a__A3FF1F33AD123244");

                            j.ToTable("client_address");

                            j.IndexerProperty<int>("ClientId").HasColumnName("client_ID");

                            j.IndexerProperty<int>("AddressId").HasColumnName("address_ID");
                        });
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.ToTable("Country");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("name");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
