
using System.Collections.Generic;

namespace TpDotNetCore.Helpers
{
    public class SwaggerResponse
    {
        public int StatusCode { get; private set; }

        public Dictionary<string, IEnumerable<string>> Headers { get; private set; }

        public SwaggerResponse(int statusCode, Dictionary<string, IEnumerable<string>> headers)
        {
            StatusCode = statusCode;
            Headers = headers;
        }
    }

    public class SwaggerResponse<TResult> : SwaggerResponse
    {
        public TResult Result { get; private set; }
        public string Message { get; private set; }

        public SwaggerResponse(int statusCode, System.Collections.Generic.Dictionary<string, System.Collections.Generic.IEnumerable<string>> headers, TResult result)
            : this(statusCode, headers, result, "")
        {
        }

        public SwaggerResponse(int statusCode, System.Collections.Generic.Dictionary<string, System.Collections.Generic.IEnumerable<string>> headers, TResult result, string message)
            : base(statusCode, headers)
        {
            Result = result;
            Message = message;
        }
    }
}