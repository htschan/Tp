
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TpDotNetCore.Auth;
using TpDotNetCore.Controllers;
using TpDotNetCore.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations.Schema;

namespace TpDotNetCore.Domain.UserConfiguration
{
    public class AppUser : IdentityUser
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtFactory _jwtFactory;
        private readonly IUnitOfWork _unitOfWork;
        private readonly JwtIssuerOptions _jwtOptions;

        public AppUser() { }
        public AppUser(UserManager<AppUser> userManager,
                IJwtFactory jwtFactory,
                IOptions<JwtIssuerOptions> jwtOptions,
                IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _jwtFactory = jwtFactory;
            _unitOfWork = unitOfWork;
            _jwtOptions = jwtOptions.Value;
        }
        // Extended Properties
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [NotMapped]
        public List<string> RoleNames { get; set; }

        public (string id, string authToken, int expiresIn, string refreshToken) Authenticate(CredentialDto credentials)
        {
            if (credentials == null)
            {
                throw new RepositoryException(StatusCodes.Status406NotAcceptable, "credentials missing");
            }

            var refreshToken = Guid.NewGuid().ToString().Replace("-", "");
            var identity = GetClaimsIdentity(credentials.Username, credentials.Password).Result;
            var claimsIdentity = identity.claimsIdentiy;
            if (identity.claimsIdentiy == null)
            {
                throw new RepositoryException(StatusCodes.Status404NotFound, identity.message);
            }
            var refreshTokenEntity = new RefreshToken
            {
                ClientId = identity.userId,
                Token = refreshToken,
                IsStop = 0,
                Created = DateTime.Now
            };
            _unitOfWork.RefreshTokens.AddToken(refreshTokenEntity);
            _unitOfWork.Complete();

            // Serialize and return the response
            return (
                claimsIdentity.Claims.Single(c => c.Type == "id").Value,
                _jwtFactory.GenerateEncodedToken(credentials.Username, claimsIdentity).Result,
                (int)_jwtOptions.ValidFor.TotalSeconds,
                refreshToken
            );
        }

        public (string id, string authToken, int expiresIn, string refreshToken) RefreshToken(RefreshTokenDto refreshtokenparameter)
        {
            if (refreshtokenparameter == null)
            {
                throw new RepositoryException(StatusCodes.Status406NotAcceptable, "refreshtokenparameter missing");
            }

            var refreshToken = Guid.NewGuid().ToString().Replace("-", "");
            var token = _unitOfWork.RefreshTokens.GetToken(refreshtokenparameter.Refresh_token);
            if (token == null)
            {
                throw new RepositoryException(905, "failed to refresh token");
            }
            if (token.IsStop == 1)
            {
                throw new RepositoryException(906, "refresh token has expired");
            }
            token.IsStop = 1;
            // expire the old refresh token and add a new refresh token
            _unitOfWork.RefreshTokens.ExpireToken(token);

            var identity = GetClaimsIdentity(token.ClientId).Result;
            if (identity.claimsIdentiy == null)
            {
                throw new RepositoryException(StatusCodes.Status404NotFound, identity.message);
            }
            var claimsIdentity = identity.claimsIdentiy;

            var refreshTokenEntity = new RefreshToken
            {
                ClientId = token.ClientId,
                Token = refreshToken,
                IsStop = 0,
                Created = DateTime.Now
            };
            _unitOfWork.RefreshTokens.AddToken(refreshTokenEntity);
            _unitOfWork.Complete();

            // Serialize and return the response
            return (
                claimsIdentity.Claims.Single(c => c.Type == "id").Value,
                _jwtFactory.GenerateEncodedToken(token.ClientId, claimsIdentity).Result,
                (int)_jwtOptions.ValidFor.TotalSeconds,
                refreshToken
            );
        }

        private async Task<(ClaimsIdentity claimsIdentiy, string userId, string message)> GetClaimsIdentity(string userName, string password)
        {
            if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(password))
            {
                // get the user to verifty
                var userToVerify = await _userManager.FindByNameAsync(userName);

                if (userToVerify != null)
                {
                    if (!_userManager.IsEmailConfirmedAsync(userToVerify).Result)
                    {
                        return await Task.FromResult((identity: (ClaimsIdentity)null, userId: userToVerify.Id, message: "Email not yet confirmed"));
                    }
                    // check the credentials  
                    if (await _userManager.CheckPasswordAsync(userToVerify, password))
                    {
                        var rolesList = await _userManager.GetRolesAsync(userToVerify);
                        return await Task.FromResult((identity: _jwtFactory.GenerateClaimsIdentity(userName, userToVerify.Id, rolesList), userId: userToVerify.Id, message: ""));
                    }
                }
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult((identity: (ClaimsIdentity)null, userId: "", message: "Credentials are invalid or account doesn't exist"));
        }

        private async Task<(ClaimsIdentity claimsIdentiy, string userId, string message)> GetClaimsIdentity(string userId)
        {
            if (!string.IsNullOrEmpty(userId))
            {
                // get the user to verifty
                var userToVerify = await _userManager.FindByIdAsync(userId);

                if (userToVerify != null)
                {
                    var rolesList = await _userManager.GetRolesAsync(userToVerify);
                    return await Task.FromResult((identity: _jwtFactory.GenerateClaimsIdentity(userToVerify.UserName, userToVerify.Id, rolesList), userId: userToVerify.Id, message: ""));
                }
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult((identity: (ClaimsIdentity)null, userId: "", message: "Credentials are invalid or account doesn't exist"));
        }
    }
}