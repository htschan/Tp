using System.Collections.Generic;
using System.Linq;
using TpDotNetCore.Data;

namespace TpDotNetCore.Domain.UserConfiguration.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        public bool AddToken(RefreshToken token)
        {
            using (var db = new TpContext())
            {
                db.RefreshTokens.Add(token);
                return db.SaveChanges() > 0;
            }
        }

        public bool ExpireToken(RefreshToken token)
        {
            using (var db = new TpContext())
            {
                db.RefreshTokens.Update(token);
                return db.SaveChanges() > 0;
            }
        }

        public RefreshToken GetToken(string refreshToken)
        {
            using (var db = new TpContext())
            {
                return db.RefreshTokens.FirstOrDefault(x => x.Token == refreshToken);
            }
        }

        public void Delete(IRefreshTokenRepository entity)
        {
            throw new System.NotImplementedException();
        }

        public IList<IRefreshTokenRepository> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public void Insert(IRefreshTokenRepository entity)
        {
            throw new System.NotImplementedException();
        }

        public void Update(IRefreshTokenRepository entity)
        {
            throw new System.NotImplementedException();
        }
    }
}