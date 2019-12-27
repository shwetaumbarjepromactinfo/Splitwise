using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Splitwise.Core;
using Splitwise.Data;

namespace Splitwise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly SplitwiseDbContext _context;

        public UserController(SplitwiseDbContext _context)
        {
            this._context = _context;
        }
        [HttpPost("{userId}")]
        public async Task<ActionResult<User>> AddUser(int userId,User User)
        {
             DateTime localDate = DateTime.Now;
            _context.Users.Add(User);
            await _context.SaveChangesAsync();
            if (userId != 0)
            {
                Friend Friend = new Friend()
                {
                    UserId = userId,
                    FriendId = User.UserId,
                    CreatedAt = localDate.ToString(),
                    IsActive = true
                };
                _context.Friends.Add(Friend);
                await _context.SaveChangesAsync();
            }
            return CreatedAtAction(nameof(GetUser), new { UserId = User.UserId }, User);
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<User>> GetUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpDelete("{userId}")]
        public async Task<ActionResult<User>> DeleteUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return user;
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, User user)
        {
            if (userId != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!userExists(userId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        private bool userExists(int userId)
        {
            var user = _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            return true;
        }
    }
}