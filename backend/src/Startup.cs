using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WhenIWork.Domain;
using WhenIWork.Services;

namespace WhenIWork
{
  public class Startup
  {
    public Startup(IConfiguration configuration) {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services
    // to the container.
    public void ConfigureServices(IServiceCollection services) {
      // Register the service so it can be accessed via dependency injection
      services.AddTransient<IShiftService, ShiftService>();
      services.AddControllers();
    }

    // This method gets called by the runtime. Use this method to configure the
    // HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
        app.UseCors(builder => {
          builder.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
      }

      app.UseRouting();
      app.UseEndpoints(endpoints => {
        endpoints.MapControllers();
      });
    }
  }
}
