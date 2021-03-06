﻿using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.ResponseCompression;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Api.Web.Helpers
{
    public static class Utils
    {
        public static string JsonSerialize(object obj)
        {
            return JsonConvert.SerializeObject(obj,
                new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    StringEscapeHandling = StringEscapeHandling.EscapeHtml,
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });
        }
        public static void SetupSerilog()
        {
            //// Configure Serilog
            //Log.Logger = new LoggerConfiguration()
            //    .MinimumLevel
            //    .Information()
            //    .WriteTo.RollingFile("logs/log-{Date}.txt", LogEventLevel.Information) // Uncomment if logging required on text file
            //    .WriteTo.Seq("http://localhost:5341/")
            //    .CreateLogger();
        }

        public static IEnumerable<string> DefaultMimeTypes => ResponseCompressionDefaults.MimeTypes.Concat(new[]
        {
            "image/svg+xml",
            "application/font-woff2"
        });
    }
}
