using Microsoft.EntityFrameworkCore;

namespace aspnetserver.Data
{
    internal sealed class AppDBContext : DbContext
    {
        public DbSet<Post> Posts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder dbContextOptionsBuilder) => dbContextOptionsBuilder.UseSqlServer("Data Source=WINSERVER2019;User ID=StandardUser;Password=pa55word;Database=reactProject;");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Post[] postsToSeed = new Post[6];

            for (int i = 1; i <= 6; i++)
            {
                postsToSeed[i - 1] = new Post() {
                    PostId = i,
                    Title =$"Post {i}",
                    Content = $"This is post {i} and it has some fantastic content."
                };
            }

            modelBuilder.Entity<Post>().HasData(postsToSeed);
        }
    }
}
