namespace TpDotNetCore.Domain.Punches
{
    public interface IPunchService
    {
        void UpdatePunch(Punch punchEntity, string userId);
         void DeletePunch(Punch punchEntity, string userId);
    }
}