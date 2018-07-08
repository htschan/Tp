using TpDotNetCore.Helpers;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel;
using NSwag.Annotations;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace TpDotNetCore.Controllers
{
    public interface ITpAdminController
    {
        /// <summary>Get the list of users [Authorize(Policy = "RequireApiAdminRole")]</summary>
        /// <returns>Returns users</returns>
        Task<SwaggerResponse<UsersDto>> AdminGetUsersAsync();

        /// <summary>Get the list of sessions [Authorize(Policy = "RequireApiAdminRole")]</summary>
        /// <returns>Returns sessions</returns>
        Task<SwaggerResponse<SessionsDto>> AdminGetSessionsAsync();

        /// <summary>Retrieves all punches of current user</summary>
        /// <returns>An array of products</returns>
    }

    [Route("api/v1/admin")]
    [Authorize]
    public partial class TpAdminController : TpBaseController
    {
        private ITpAdminController _implementation;

        public TpAdminController(ITpAdminController implementation)
        {
            _implementation = implementation;
        }

        /// <summary>Get the list of users [Authorize(Policy = "RequireApiAdminRole")]</summary>
        /// <returns>Returns users</returns>
        [Authorize(Policy = "RequireApiAdminRole")]
        [HttpGet, Route("getUsers")]
        [SwaggerResponse("200", typeof(UsersDto))]
        public async Task<IActionResult> AdminGetUsers()
        {
            var result = await _implementation.AdminGetUsersAsync().ConfigureAwait(false);
            return ProcessResponse<UsersDto>(result);
        }

        /// <summary>Get the list of sessions [Authorize(Policy = "RequireApiAdminRole")]</summary>
        /// <returns>Returns sessions</returns>
        [Authorize(Policy = "RequireApiAdminRole")]
        [HttpGet, Route("getSessions")]
        [SwaggerResponse("200", typeof(SessionsDto))]
        public async Task<IActionResult> AdminGetSessions()
        {
            var result = await _implementation.AdminGetSessionsAsync().ConfigureAwait(false);
            return ProcessResponse<SessionsDto>(result);
        }
    }
}