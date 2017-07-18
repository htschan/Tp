
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TpDotNetCore.Auth;
using TpDotNetCore.Controllers;
using TpDotNetCore.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace TpDotNetCore.Domain.UserConfiguration
{
    public class AppUser : IdentityUser
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtFactory _jwtFactory;
        private readonly JwtIssuerOptions _jwtOptions;

        public AppUser() { }
        public AppUser(UserManager<AppUser> userManager,
                    IJwtFactory jwtFactory,
                    IOptions<JwtIssuerOptions> jwtOptions)
        {
            _userManager = userManager;
            _jwtFactory = jwtFactory;
            _jwtOptions = jwtOptions.Value;
        }
        // Extended Properties
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public (string id, string authToken, int expiresIn) Authenticate(CredentialDto credentials)
        {
            var identity = GetClaimsIdentity(credentials.Email, credentials.Password).Result;
            var headers = new Dictionary<string, IEnumerable<string>>();
            if (identity.claimsIdentiy == null)
            {
                throw new RepositoryException(StatusCodes.Status404NotFound, identity.message);
            }

            // Serialize and return the response
            return (
                identity.claimsIdentiy.Claims.Single(c => c.Type == "id").Value,
                _jwtFactory.GenerateEncodedToken(credentials.Email, identity.claimsIdentiy).Result,
                (int)_jwtOptions.ValidFor.TotalSeconds
            );
        }

        private async Task<(ClaimsIdentity claimsIdentiy, string message)> GetClaimsIdentity(string userName, string password)
        {
            if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(password))
            {
                // get the user to verifty
                var userToVerify = await _userManager.FindByNameAsync(userName);

                if (userToVerify != null)
                {
                    if (!_userManager.IsEmailConfirmedAsync(userToVerify).Result)
                    {
                        return await Task.FromResult((identity: (ClaimsIdentity)null, message: "Email not yet confirmed"));
                    }
                    // check the credentials  
                    if (await _userManager.CheckPasswordAsync(userToVerify, password))
                    {
                        return await Task.FromResult((identity: _jwtFactory.GenerateClaimsIdentity(userName, userToVerify.Id), message: ""));
                    }
                }
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult((identity: (ClaimsIdentity)null, message: "Credentials are invalid or account doesn't exist"));
        }
    }
}