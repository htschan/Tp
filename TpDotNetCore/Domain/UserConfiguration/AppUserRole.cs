using Microsoft.AspNetCore.Identity;

namespace TpDotNetCore.Domain.UserConfiguration
{
    public class AppUserRole : IdentityUserRole<string>
    {
        public AppUserRole() : base() { }
        
        // public AppRole AppRole { get; set; }
        // public AppUser AppUser { get; set; }
    }
}