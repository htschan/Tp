using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.Punches.Repositories
{
    public interface IBasePunchRepository<TEntity, R, Key> : IRepository<TEntity, Key> where TEntity : class
    {
    }
}