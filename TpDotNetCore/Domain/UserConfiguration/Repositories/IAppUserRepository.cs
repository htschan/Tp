using TpDotNetCore.Domain.UserConfiguration;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public interface IAppUserRepository : IRepository<AppUser>
    {
         AppUser FindByName(string name);
         AppUser FindById(string userId);
    }
}