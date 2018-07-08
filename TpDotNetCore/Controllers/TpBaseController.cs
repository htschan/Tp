using TpDotNetCore.Helpers;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel;
using NSwag.Annotations;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace TpDotNetCore.Controllers
{
    public abstract class TpBaseController : Controller
    {
        protected IActionResult HandleInvalidModelState(Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary model)
        {
            var errors = "";
            foreach (var state in ModelState)
            {
                foreach (var error in state.Value.Errors)
                {
                    errors += error.ErrorMessage + "; ";
                }
            }
            var authResponse = new { Status = new { Success = false, Result = errors.TrimEnd(new[] { ';', ' ' }) } };
            return new ObjectResult(authResponse) { StatusCode = 404 };
        }

        protected IActionResult ProcessResponse<T>(SwaggerResponse<T> result)
        {
            foreach (var header in result.Headers)
                ControllerContext.HttpContext.Response.Headers.Add(header.Key, header.Value.ToArray());
            if (result.StatusCode == 200)
                return Ok(result.Result);
            else
                return new ObjectResult(result.Result) { StatusCode = result.StatusCode };
        }

        protected IActionResult ProcessResponse(SwaggerResponse result)
        {
            foreach (var header in result.Headers)
                ControllerContext.HttpContext.Response.Headers.Add(header.Key, header.Value.ToArray());
            if (result.StatusCode == 200)
                return Ok();
            else
                return new ObjectResult(result.StatusCode) { StatusCode = result.StatusCode };
        }
    }
}