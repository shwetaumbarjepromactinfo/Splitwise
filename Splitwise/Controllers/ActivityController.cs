using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Splitwise.Core;
using Splitwise.Data;

namespace Splitwise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityController : ControllerBase
    {
        private readonly SplitwiseDbContext _context;

        public ActivityController(SplitwiseDbContext _context)
        {
            this._context = _context;
        }

        [HttpPost]
        public async Task<ActionResult<Activity>> AddExpense(Activity activity)
        {
            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetActivity), new { ActivityId = activity.ActivityId }, activity);
        }

        [HttpGet("{activityId}")]
        public async Task<ActionResult<Activity>> GetActivity(int activityId)
        {
            var activity = await _context.Activities.FindAsync(activityId);
            if (activity == null)
            {
                return NotFound();
            }

            return activity;
        }

    }
}