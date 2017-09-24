using System.Threading.Tasks;
using System.Security.Claims;
using System.Collections.Generic;

namespace TpDotNetCore.Auth
{
    public interface IJwtFactory
    {
        Task<string> GenerateEncodedToken(string userName, ClaimsIdentity identity);
        ClaimsIdentity GenerateClaimsIdentity(string userName, string id, IList<string> roles);
    }
}