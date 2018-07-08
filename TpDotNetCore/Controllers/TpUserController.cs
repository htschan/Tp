
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

    public interface ITpUserController
    {
        /// <summary>Sendet eine Authentifizierungsanfrage an den Server [AllowAnonymous]</summary>
        /// <param name="credentials">Credentials mit E-Mail und Passwort.</param>
        /// <returns>Returns nothing</returns>
        Task<SwaggerResponse<AuthResponse>> AuthenticateAsync(CredentialDto credentials);

        /// <summary>Sendet eine RefreshToken Abfrage an den Server [AllowAnonymous]</summary>
        /// <param name="refreshtokenparameter">Eine ASCII-Zeichenfolge mit mindestens einem Zeichen.</param>
        /// <returns>AuthResponse</returns>
        Task<SwaggerResponse<AuthResponse>> RefreshtokenAsync(RefreshTokenDto refreshtokenparameter);

        /// <summary>Einen Benutzer registrieren [AllowAnonymous]</summary>
        /// <param name="registerDto">Registrierungsinformationen</param>
        /// <returns>Die Operation war erfolgreich. Der Benutzer erhält eine E-Mail mit einem Bestätigungslink.</returns>
        Task<SwaggerResponse<RegisterResponse>> RegisterUserAsync(RegisterDto registerDto);

        /// <summary>Eine Benutzerregistrierung bestätigen [AllowAnonymous]</summary>
        /// <param name="id">Userid</param>
        /// <param name="cnf">Confirmationtoken</param>
        /// <returns>Die Operation war erfolgreich.</returns>
        Task<SwaggerResponse<ConfirmResponse>> ConfirmRegisterAsync(string id, string cnf);

        /// <summary>Passwort wiederherstellen [AllowAnonymous]</summary>
        /// <param name="recoverPasswordParams">Wiederherstellungsparameter</param>
        /// <returns>Die Operation war erfolgreich. Der Benutzer erhält eine E-Mail mit einem Passwortresetcode.</returns>
        Task<SwaggerResponse<RecoverPasswordResponse>> RecoverPasswordAsync(RecoverPasswordParams recoverPasswordParams);

        /// <summary>Abfrage des Usernamens [AllowAnonymous]</summary>
        /// <param name="recoverUsernameParams">Wiederherstellungsparameter</param>
        /// <returns>Die Operation war erfolgreich. Der Benutzer erhält eine E-Mail mit seinem Benutzernamen.</returns>
        Task<SwaggerResponse<RecoverUsernameResponse>> RecoverUsernameAsync(RecoverUsernameParams recoverUsernameParams);

        /// <summary>Ein Benutzer setzt ein neues Passwort [AllowAnonymous]</summary>
        /// <param name="setPasswordParams">Wiederherstellungsparameter</param>
        /// <returns>Die Operation war erfolgreich.</returns>
        Task<SwaggerResponse<SetPasswordResponse>> SetPasswordAsync(SetPasswordParams setPasswordParams);
    }

    [Route("api/v1/user")]
    [Authorize]
    public partial class TpUserController : TpBaseController
    {
        private ITpUserController _implementation;

        public TpUserController(ITpUserController implementation)
        {
            _implementation = implementation;
        }

        /// <summary>Sendet eine Authentifizierungsanfrage an den Server [AllowAnonymous]</summary>
        /// <param name="credentials">Credentials mit E-Mail und Passwort.</param>
        /// <returns>Returns nothing</returns>
        [AllowAnonymous]
        [HttpPost, Route("authenticate")]
        [Description("Sendet eine Authentifizierungsanfrage an den Server\n* @credentials Credentials mit E-Mail und Passwort.\n* @return Returns AuthResponse")]
        [SwaggerResponse("200", typeof(AuthResponse))]
        public async Task<IActionResult> Authenticate([FromBody] CredentialDto credentials)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.AuthenticateAsync(credentials).ConfigureAwait(false);
            return ProcessResponse<AuthResponse>(result);
        }

        /// <summary>Sendet eine RefreshToken Abfrage an den Server [AllowAnonymous]</summary>
        /// <param name="refreshtokenparameter">Eine ASCII-Zeichenfolge mit mindestens einem Zeichen.</param>
        /// <returns>AuthResponse</returns>
        [AllowAnonymous]
        [HttpPost, Route("refreshtoken")]
        [Description("Sendet eine RefreshToken Abfrage an den Server [AllowAnonymous]\n* @refreshtokenparameter Eine ASCII-Zeichenfolge mit mindestens einem Zeichen.\n* @return AuthResponse")]
        [SwaggerResponse("200", typeof(AuthResponse))]
        public async Task<IActionResult> Refreshtoken([FromBody] RefreshTokenDto refreshtokenparameter)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.RefreshtokenAsync(refreshtokenparameter).ConfigureAwait(false);
            return ProcessResponse<AuthResponse>(result);
        }

        /// <summary>Einen Benutzer registrieren [AllowAnonymous]</summary>
        /// <param name="registerDto">Registrierungsinformationen</param>
        /// <returns>Die Operation war erfolgreich. Der Benutzer erhält eine E-Mail mit einem Bestätigungslink.</returns>
        [AllowAnonymous]
        [HttpPost, Route("register")]
        [SwaggerResponse("200", typeof(RegisterResponse))]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.RegisterUserAsync(registerDto).ConfigureAwait(false);
            return ProcessResponse<RegisterResponse>(result);
        }

        /// <summary>Eine Benutzerregistrierung bestätigen [AllowAnonymous]</summary>
        /// <param name="id">Userid</param>
        /// <param name="cnf">Confirmationtoken</param>
        /// <returns>Die Operation war erfolgreich.</returns>
        [AllowAnonymous]
        [HttpGet, Route("confirm")]
        [SwaggerResponse("200", typeof(ConfirmResponse))]
        public async Task<IActionResult> ConfirmRegister(string id, string cnf)
        {
            var result = await _implementation.ConfirmRegisterAsync(id, cnf).ConfigureAwait(false);
            return ProcessResponse<ConfirmResponse>(result);
        }

        /// <summary>Passwort wiederherstellen [AllowAnonymous]</summary>
        /// <param name="recoverPasswordParams">Wiederherstellungsparameter</param>
        /// <returns>Die Operation war erfolgreich. Der Benutzer erhält eine E-Mail mit einem Passwortresetcode.</returns>
        [AllowAnonymous]
        [HttpPost, Route("recoverPassword")]
        [SwaggerResponse("200", typeof(RecoverPasswordResponse))]
        public async Task<IActionResult> RecoverPassword([FromBody] RecoverPasswordParams recoverPasswordParams)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.RecoverPasswordAsync(recoverPasswordParams).ConfigureAwait(false);
            return ProcessResponse<RecoverPasswordResponse>(result);
        }

        /// <summary>Abfrage des Usernamens [AllowAnonymous]</summary>
        /// <param name="recoverUsernameParams">Wiederherstellungsparameter</param>
        /// <returns>Die Operation war erfolgreich. Der Benutzer erhält eine E-Mail mit seinem Benutzernamen.</returns>
        [AllowAnonymous]
        [HttpPost, Route("recoverUsername")]
        [SwaggerResponse("200", typeof(RecoverUsernameResponse))]
        public async Task<IActionResult> RecoverUsername([FromBody] RecoverUsernameParams recoverUsernameParams)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.RecoverUsernameAsync(recoverUsernameParams).ConfigureAwait(false);
            return ProcessResponse<RecoverUsernameResponse>(result);
        }

        /// <summary>Ein Benutzer setzt ein neues Passwort [AllowAnonymous]</summary>
        /// <param name="setPasswordParams">Wiederherstellungsparameter</param>
        /// <returns>Die Operation war erfolgreich.</returns>
        [AllowAnonymous]
        [HttpPost, Route("setPassword")]
        [SwaggerResponse("200", typeof(SetPasswordResponse))]
        public async Task<IActionResult> SetPassword([FromBody] SetPasswordParams setPasswordParams)
        {
            if (!ModelState.IsValid) return HandleInvalidModelState(ModelState);
            var result = await _implementation.SetPasswordAsync(setPasswordParams).ConfigureAwait(false);
            return ProcessResponse<SetPasswordResponse>(result);
        }
    }
}