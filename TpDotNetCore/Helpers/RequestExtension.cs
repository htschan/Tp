

using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Http;

public static class RequestExtension
{
    public static HttpResponseMessage CreateResponse<T>(this HttpRequest request, HttpStatusCode statusCode, T OpResult)
    {
        return new HttpResponseMessage(statusCode);
    }
}