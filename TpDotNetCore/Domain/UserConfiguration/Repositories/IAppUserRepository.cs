using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public interface IAppUserRepository : IRepository<AppUser, string>
    {
        AppUser FindByName(string name);
        AppUser FindById(string userId);
    }
}