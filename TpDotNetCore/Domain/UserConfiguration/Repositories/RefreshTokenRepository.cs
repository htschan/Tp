using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using TpDotNetCore.Data;
using TpDotNetCore.Helpers;

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

        public void Delete(RefreshToken entity)
        {
            throw new System.NotImplementedException();
        }

        public IList<RefreshToken> GetAll()
        {
            using (var db = new TpContext())
            {
                try
                {
                    var value = db.RefreshTokens;
                    if (value == null)
                        throw new RepositoryException(StatusCodes.Status404NotFound, $"Sessions not found");
                    return value.ToList();
                }
                catch (RepositoryException)
                {
                    throw;
                }
                catch (Exception exception)
                {
                    throw new RepositoryException(StatusCodes.Status400BadRequest, $"GetAll threw an exception: {exception.Message}", exception);
                }
            }
        }

        public void Insert(RefreshToken entity)
        {
            throw new System.NotImplementedException();
        }

        public void Update(RefreshToken entity)
        {
            throw new System.NotImplementedException();
        }
    }
}