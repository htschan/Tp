
using TpDotNetCore.Helpers;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel;
using NSwag.Annotations;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace TpDotNetCore.Controllers
{
#pragma warning disable // Disable all warnings

    public interface ITpProfileController
    {
        /// <summary>Abfrage aller Profile</summary>
        /// <returns>Die Operation war erfolgreich.</returns>
        Task<SwaggerResponse<ProfileResponseDto>> GetProfilesAsync();

        /// <summary>Abfrage des eigenen Profils</summary>
        /// <returns>Die Operation war erfolgreich.</returns>
        Task<SwaggerResponse<ProfileResponseDto>> GetMyProfileAsync();

        /// <summary>Abfrage eines Benutzerprofiles</summary>
        /// <param name="userid">User Id</param>
        /// <returns>Die Operation war erfolgreich.</returns>
        Task<SwaggerResponse<ProfileResponseDto>> GetProfileAsync(string userid);
    }

    [Route("api/v1/profile")]
    [Authorize]
    public partial class TpProfileController : TpBaseController
    {
        private ITpProfileController _implementation;

        public TpProfileController(ITpProfileController implementation)
        {
            _implementation = implementation;
        }

        /// <summary>Abfrage aller Profile</summary>
        /// <returns>Die Operation war erfolgreich.</returns>
        [HttpGet, Route("getProfiles")]
        [SwaggerResponse("200", typeof(ProfileResponseDto))]
        // [SwaggerOperation("getProfiles")]
        public async Task<IActionResult> GetProfiles()
        {
            var result = await _implementation.GetProfilesAsync().ConfigureAwait(false);
            return ProcessResponse<ProfileResponseDto>(result);
        }

        /// <summary>Abfrage des eigenen Profils</summary>
        /// <returns>Die Operation war erfolgreich.</returns>
        [HttpGet, Route("getMyProfile")]
        [SwaggerResponse("200", typeof(ProfileResponseDto))]
        public async Task<IActionResult> GetMyProfile()
        {
            var result = await _implementation.GetMyProfileAsync().ConfigureAwait(false);
            return ProcessResponse<ProfileResponseDto>(result);
        }

        /// <summary>Abfrage eines Benutzerprofiles</summary>
        /// <param name="userid">User Id</param>
        /// <returns>Die Operation war erfolgreich.</returns>
        [HttpGet, Route("getUserProfile/{userid}")]
        [SwaggerResponse("200", typeof(ProfileResponseDto))]
        public async Task<IActionResult> GetProfile(string userid)
        {
            var result = await _implementation.GetProfileAsync(userid).ConfigureAwait(false);
            return ProcessResponse<ProfileResponseDto>(result);
        }
    }
}