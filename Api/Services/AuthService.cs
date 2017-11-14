
using Api.Entities;

namespace Api.Services
{
    public interface IAuthService{
        User Authenticate(string user, string password);
    }

    public class AuthService : IAuthService
    {
        public User Authenticate(string user, string password)
        {
            return new User{
                Username = user,
                
            };
        }
    }
}