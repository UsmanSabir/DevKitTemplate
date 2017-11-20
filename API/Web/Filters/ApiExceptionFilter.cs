using System;
using Api.Web.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace Api.Web.Filters
{
    public class ApiExceptionFilter : ExceptionFilterAttribute
    {
        private readonly ILogger<ApiExceptionFilter> _logger;

        public ApiExceptionFilter(ILogger<ApiExceptionFilter> logger)
        {
            _logger = logger;
        }


        public override void OnException(ExceptionContext context)
        {
            ApiError apiError = null;
            if (context.Exception is ApiException)
            {
                // handle explicit 'known' API errors
                var ex = context.Exception as ApiException;
                context.Exception = null;
                apiError = new ApiError(ex.Message);
                apiError.Errors = ex.Errors;

                context.HttpContext.Response.StatusCode = ex.StatusCode;

                _logger.LogError($"Application thrown error: {ex.Message}", ex);
            }
            else if (context.Exception is UnauthorizedAccessException)
            {
                apiError = new ApiError("Unauthorized Access");
                context.HttpContext.Response.StatusCode = 401;
                _logger.LogError("Unauthorized Access in Controller Filter.");
            }
            else
            {
                // Unhandled errors
                var msg = "";
                var stack = "";
                if (Startup.HostingEnv.IsDevelopment())
                {
                    msg = context.Exception.GetBaseException().Message;
                    stack = context.Exception.StackTrace;
                }
                else
                {
                    msg = "An unhandled error occurred.";
                    stack = null;
                }

                apiError = new ApiError(msg);
                apiError.Detail = stack;

                context.HttpContext.Response.StatusCode = 500;

                // handle logging here
                _logger.LogError(new EventId(0), context.Exception, msg);
            }

            // always return a JSON result
            context.Result = new JsonResult(apiError);

            base.OnException(context);
        }
    }
}