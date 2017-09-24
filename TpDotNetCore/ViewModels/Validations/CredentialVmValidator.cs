using FluentValidation;
using FluentValidation.Attributes;
using TpDotNetCore.Controllers;

namespace TpDotNetCore.ViewModels.Validations
{
    public class CredentialVmValidator : AbstractValidator<CredentialDto>
    {
        public CredentialVmValidator()
        {
            RuleFor(vm => vm.Client_type).NotEmpty().WithMessage("Client_type cannot be empty");
            RuleFor(vm => vm.Username).NotEmpty().WithMessage("Username cannot be empty");
            RuleFor(vm => vm.Password).NotEmpty().WithMessage("Password cannot be empty");
            RuleFor(vm => vm.Password).Length(6, 12).WithMessage("Password must be between 6 and 12 characters");
        }
    }

    [Validator(typeof(CredentialVmValidator))]
    public partial class CredentialVm
    {

    }
}
