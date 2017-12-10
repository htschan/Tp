using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TpDotNetCore.Domain.UserConfiguration.Repositories;
using static TpDotNetCore.Helpers.Constants.Strings;

namespace TpDotNetCore.Domain.UserConfiguration
{
    public class AppUserManager
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public AppUserManager(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task CreateUser(AppUser appUser, string password, List<string> roles)
        {
            appUser.EmailConfirmed = true;
            await _userManager.CreateAsync(appUser, password);
            foreach (var role in roles)
            {
                await _userManager.AddToRoleAsync(appUser, role);
            }
            var profile = new AppProfile { PictureUrl = "", Identity = appUser };
            _unitOfWork.AppProfiles.Add(profile);
            _unitOfWork.Complete();
        }

        public async Task CreateRole(string roleName)
        {
            var role = new IdentityRole
            {
                Id = Guid.NewGuid().ToString(),
                Name = roleName
            };
            await _roleManager.CreateAsync(role);
        }

        public IList<AppUser> GetUsers()
        {
            foreach (var user in _userManager.Users)
            {
                var userRoles = _userManager.GetRolesAsync(user).Result;
                user.RoleNames = new List<string>();
                foreach (var role in userRoles)
                {
                    user.RoleNames.Add(role);
                }
            }
            return _userManager.Users.ToList();
        }

        public IList<AppUser> PuGetUsers()
        {
            var users = new List<AppUser>();
            foreach (var user in _userManager.Users)
            {
                var userRoles = _userManager.GetRolesAsync(user).Result;
                if (userRoles.Contains(JwtClaims.ApiAccess))
                {
                    users.Add(user);
                }
            }
            return users;
        }

        public IList<RefreshToken> GetSessions()
        {
            var tokens = _unitOfWork.RefreshTokens.GetAll().ToList();
            foreach (var token in tokens)
            {
                var user = _userManager.FindByIdAsync(token.ClientId).Result;
                if (user != null)
                {
                    token.ClientName = user.Email;
                }
            }
            return tokens;
        }
    }
}