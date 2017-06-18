
namespace TpDotNetCore.Helpers
{
    [System.CodeDom.Compiler.GeneratedCode("NSwag", "11.0.0.0")]
    public class SwaggerResponse
    {
        public int StatusCode { get; private set; }

        public System.Collections.Generic.Dictionary<string, System.Collections.Generic.IEnumerable<string>> Headers { get; private set; }

        public SwaggerResponse(int statusCode, System.Collections.Generic.Dictionary<string, System.Collections.Generic.IEnumerable<string>> headers)
        {
            StatusCode = statusCode;
            Headers = headers;
        }
    }

    [System.CodeDom.Compiler.GeneratedCode("NSwag", "11.0.0.0")]
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