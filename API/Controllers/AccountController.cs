using System.Security.Claims;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInMangaer;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInMangaer, ITokenService tokenService,
            IMapper mapper)
        {
            _tokenService = tokenService;
            _signInMangaer = signInMangaer;
            _userManager = userManager;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            // var email = HttpContext.User?.Claims?.FirstOrDefault(
            //     x => x.Type == ClaimTypes.Email
            // )?.Value;



            var user = await _userManager.FindByEmailFromClaimsPrincipal(User);

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }


        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            // var email = HttpContext.User?.Claims?.FirstOrDefault(
            //     x => x.Type == ClaimTypes.Email
            // )?.Value;

            var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(User);

            return _mapper.Map<Address, AddressDto>(user.Address);

        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(User);

            user.Address = _mapper.Map<AddressDto, Address>(address);

            var resualt = await _userManager.UpdateAsync(user);
            if (resualt.Succeeded)
            {
                return Ok(_mapper.Map<Address, AddressDto>(user.Address));
            }

            return BadRequest("Problem update the user");
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return Unauthorized(new ApiResponse(401));
            }

            var result = await _signInMangaer.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
            {
                return Unauthorized(new ApiResponse(401));
            }

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(
                    new ApiValidationErrorResponse
                    {
                        Errors = new[]{
                            "Email address is in use"
                        }
                    }
                );
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }


    }
}