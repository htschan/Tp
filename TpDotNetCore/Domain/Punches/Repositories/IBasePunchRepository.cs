using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IBasePunchRepository<T,R> : IRepository<T> where T : class
    {
        R GetCurrent(string userId);
    }
}