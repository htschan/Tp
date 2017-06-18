using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace TpDotNetCore.Entities
{
    public class User : IdentityUser
    {
        // [Key]
        // public int UserId { get; set; }

        //  [Column("BoId")]
        //public System.Guid BoId { get; set; }
        // public string FirstName { get; set; }
        // public string Name { get; set; }
        // public string Password { get; set; }
        // public bool Locked { get; set; }
        // public int LoginAttempts { get; set; }
        // public DateTime LastLoginAttempt { get; set; }
        // public bool ConfirmationPending { get; set; }
        // public string ConfirmationToken { get; set; }
        // public string Salt { get; set; }
        // public DateTime Created { get; set; }
        // public DateTime Updated { get; set; }
        // public int Version { get; set; }

        public List<Punch> Punches { get; set; }

        //     @ManyToOne(type => Role, role => role.users)
        //     role: Role;
        //     @OneToMany(type => Punch, punch => punch.user)
        //     punches: Punch[];
    }
}