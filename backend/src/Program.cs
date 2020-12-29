using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace WhenIWork
{
  /**
   * This is just boilerplate ASP.NET Core stuff. I have never had an occasion
   * to modify this file except for formatting purposes.
   */
  public class Program
  {
    public static void Main(string[] args) {
      CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) {
      return Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder => {
            webBuilder.UseStartup<Startup>();
        });
    }
  }
}
