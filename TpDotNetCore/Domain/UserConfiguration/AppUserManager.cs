using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace TpDotNetCore.Domain.UserConfiguration
{
    public class AppUserManager
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;

        public AppUserManager(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task CreateUser(AppUser appUser, string password, List<string> roles)
        {
            appUser.EmailConfirmed = true;
            await _userManager.CreateAsync(appUser, password);
            foreach (var role in roles)
            {
                await _userManager.AddToRoleAsync(appUser, role);
            }
        }

        public async Task CreateRole(string roleName)
        {
            var role = new AppRole
            {
                Id = Guid.NewGuid().ToString(),
                Name = roleName
            };
            await _roleManager.CreateAsync(role);
        }
    }
}