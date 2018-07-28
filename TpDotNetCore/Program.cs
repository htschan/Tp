using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace TpDotNetCore
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();

        // public static void Main(string[] args)
        // {
        //     var host = new WebHostBuilder()
        //         .UseKestrel()
        //         .UseContentRoot(Directory.GetCurrentDirectory())
        //         .UseIISIntegration()
        //         .UseStartup<Startup>()
        //         .Build();

        //     host.Run();
        // }
    }
}
