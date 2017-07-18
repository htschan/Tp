
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TpDotNetCore.Domain.UserConfiguration
{
    public class AppProfile
    {
        public int Id { get; set; }
        public string PictureUrl { get; set; }
        public AppUser Identity { get; set; }  // navigation property
    }
}