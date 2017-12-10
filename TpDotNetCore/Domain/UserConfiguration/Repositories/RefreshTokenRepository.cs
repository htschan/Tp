using System.Linq;
using TpDotNetCore.Data;
using TpDotNetCore.Repositories;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public class RefreshTokenRepository : Repository<RefreshToken, string>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(TpContext context) : base(context)
        {
        }

        public TpContext ApplicationDataContext => Context as TpContext;

        public void AddToken(RefreshToken token)
        {
            ApplicationDataContext.RefreshTokens.Add(token);
        }

        public void ExpireToken(RefreshToken token)
        {
            ApplicationDataContext.RefreshTokens.Update(token);
        }

        public RefreshToken GetToken(string refreshToken)
        {
            return ApplicationDataContext.RefreshTokens.FirstOrDefault(x => x.Token == refreshToken);
        }
    }
}