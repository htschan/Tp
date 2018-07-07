using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using TpDotNetCore.Helpers;
using AutoMapper;
using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Domain;
using Common.Communication;
using Microsoft.Extensions.Options;

namespace TpDotNetCore.Controllers
{
    public abstract class TpBaseControllerImpl
    {
        public TpBaseControllerImpl()
        {

            new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        protected Task<SwaggerResponse> HandleException(Exception exception, Dictionary<string, IEnumerable<string>> headers)
        {
            if (exception is RepositoryException)
                return Task.FromResult(new SwaggerResponse(((RepositoryException)exception).StatusCode, headers));
            return Task.FromResult(new SwaggerResponse(StatusCodes.Status400BadRequest, headers));
        }
        protected Task<SwaggerResponse<T>> HandleException<T>(Exception exception, Dictionary<string, IEnumerable<string>> headers, T response)
        {
            if (exception is RepositoryException)
                return Task.FromResult(new SwaggerResponse<T>(((RepositoryException)exception).StatusCode, headers, response, exception.Message));
            return Task.FromResult(new SwaggerResponse<T>(StatusCodes.Status400BadRequest, headers, response, exception.Message));
        }
        protected Task<SwaggerResponse<T>> HandleException<T>(Exception exception, Dictionary<string, IEnumerable<string>> headers)
        {
            if (exception is RepositoryException)
                return Task.FromResult(new SwaggerResponse<T>(((RepositoryException)exception).StatusCode, headers, default(T), exception.Message));
            return Task.FromResult(new SwaggerResponse<T>(StatusCodes.Status400BadRequest, headers, default(T), exception.Message));
        }
    }
}