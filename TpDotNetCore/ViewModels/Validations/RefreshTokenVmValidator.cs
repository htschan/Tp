using FluentValidation;
using FluentValidation.Attributes;

namespace TpDotNetCore.Controllers
{
    public class RefreshTokenVmValidator : AbstractValidator<RefreshTokenDto>
    {
        public RefreshTokenVmValidator()
        {
            RuleFor(vm => vm.Refresh_token).NotEmpty().WithMessage("Refresh_token cannot be empty");
        }
    }
}