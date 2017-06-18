using FluentValidation;
using FluentValidation.Attributes;

namespace TpDotNetCore.Controllers
{
    public class RegisterVmValidator : AbstractValidator<RegisterVm>
    {
        public RegisterVmValidator()
        {
            RuleFor(vm => vm.Email).NotEmpty().WithMessage("Email cannot be empty");
            RuleFor(vm => vm.Password).NotEmpty().WithMessage("Password cannot be empty");
            RuleFor(vm => vm.Firstname).NotEmpty().WithMessage("FirstName cannot be empty");
            RuleFor(vm => vm.Name).NotEmpty().WithMessage("LastName cannot be empty");
        }
    }

    [Validator(typeof(RegisterVmValidator))]
    public partial class RegisterVm
    {
    }
}
