using FluentValidation;
using TpDotNetCore.Controllers;

namespace TpDotNetCore.ViewModels.Validations
{
    public class RefreshTokenVmValidator : AbstractValidator<RefreshTokenDto>
    {
        public RefreshTokenVmValidator()
        {
            RuleFor(vm => vm.Refresh_token).NotEmpty().WithMessage("Refresh_token cannot be empty");
        }
    }
}