using aspnetserver.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSPolicy",
        builder =>
        {
            builder
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithOrigins("http://localhost:3000", "https://kind-water-07b064810.1.azurestaticapps.net");
        });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(swaggerGenOptions => 
{
    swaggerGenOptions.SwaggerDoc("v1", new OpenApiInfo { Title = "ASP.NET React Tutorial", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI(swaggerUIOptions => 
    {
        swaggerUIOptions.DocumentTitle = "ASP.NET React Tutorial";
        swaggerUIOptions.SwaggerEndpoint("/swagger/v1/swagger.json", "Web API serving a very simple Post model.");
        swaggerUIOptions.RoutePrefix = String.Empty;
    });
//}

app.UseHttpsRedirection();

app.MapGet("/get-all-posts", async () => await PostsRepository.GetPostsAsync()).WithTags("Posts Endpoints");

app.MapGet("/get-post-by-id/{postId}", async (int postId) => 
{
    Post postToReturn = await PostsRepository.GetPostByIdAsync(postId);
    if (postToReturn != null)
    {
        return Results.Ok(postToReturn);
    }
    else
    {
        return Results.BadRequest();
    }
}).WithTags("Posts Endpoints");

app.MapPost("/create-post", async (Post post) =>
{
    bool isCreated = await PostsRepository.CreatePostAsync(post);

    return isCreated ? Results.Ok("Created Successfully") : Results.BadRequest();
    
}).WithTags("Posts Endpoints");

app.MapPut("/update-post", async (Post post) =>
{
    bool isUpdated = await PostsRepository.UpdatePostAsync(post);

    return isUpdated ? Results.Ok("Updated Successfully") : Results.BadRequest();

}).WithTags("Posts Endpoints");

app.MapDelete("/delete-post", async (int postId) =>
{
    bool isDeleted = await PostsRepository.DeletePostAsync(postId);

    return isDeleted ? Results.Ok("Deleted Successfully") : Results.BadRequest();

}).WithTags("Posts Endpoints");

app.Run();

