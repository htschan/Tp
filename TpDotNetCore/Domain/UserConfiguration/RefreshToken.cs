namespace TpDotNetCore.Domain.UserConfiguration
{
    public class RefreshToken
    {
        public int Id { get; set; }

        public string ClientId { get; set; } // This is the userId

        public string Token { get; set; }
        
        public int IsStop { get; set; }

        public System.DateTime Created { get; set; }
    }
}