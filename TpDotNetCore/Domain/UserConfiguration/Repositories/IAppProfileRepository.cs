using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public interface IAppProfileRepository : IRepository<AppProfile, string>
    {
        AppProfile FindById(string id);
    }
}