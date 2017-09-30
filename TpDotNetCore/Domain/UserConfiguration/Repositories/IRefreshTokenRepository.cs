using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public interface IRefreshTokenRepository : IRepository<RefreshToken>
    {
        bool AddToken(RefreshToken token);

        bool ExpireToken(RefreshToken token);

        RefreshToken GetToken(string refresh_token);

    }
}