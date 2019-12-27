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
    public class GroupController : ControllerBase
    {
        private readonly SplitwiseDbContext _context;

        public GroupController(SplitwiseDbContext _context)
        {
            this._context = _context;
        }

        [HttpGet("user/{userId}")]
        public async Task<IEnumerable<GroupData>> GetGroups(int userId)
        {
            var groups = await (from g in _context.Groups
                                join gu in _context.GroupUsers on g.GroupId equals gu.GroupId
                                join u in _context.Users on gu.UserId equals u.UserId
                                join go in _context.Users on g.CreatedBy equals go.UserId
                                where gu.UserId == userId
                                select new GroupData
                                {
                                    GroupId = g.GroupId,
                                    GroupName = g.GroupName,
                                    GroupCategory = g.GroupCategory,
                                    CreatedBy = go.UserName,
                                    GroupLink = g.GroupLink,
                                    SimplifyDebts = g.SimplifyDebts,
                                    CreatedAt = g.CreatedAt,
                                    Modified = g.Modified,
                                    Users = (from u in _context.Users
                                             join gu in _context.GroupUsers on g.GroupId equals gu.GroupId
                                             where u.UserId == gu.UserId
                                             select u).ToList()
                                }).ToListAsync();
            return groups;
        }

        [HttpGet("{groupId}")]
        public async Task<IEnumerable<GroupData>> GetGroup(int groupId)
        {
            var groups = await (from g in _context.Groups
                                join gu in _context.GroupUsers on g.GroupId equals gu.GroupId
                                join u in _context.Users on gu.UserId equals u.UserId
                                join go in _context.Users on g.CreatedBy equals go.UserId
                                where g.GroupId == groupId
                                select new GroupData
                                {
                                    GroupId = g.GroupId,
                                    GroupName = g.GroupName,
                                    GroupCategory = g.GroupCategory,
                                    CreatedBy = go.UserName,
                                    GroupLink = g.GroupLink,
                                    SimplifyDebts = g.SimplifyDebts,
                                    CreatedAt = g.CreatedAt,
                                    Modified = g.Modified,
                                    Users = (from u in _context.Users
                                             join gu in _context.GroupUsers on u.UserId equals gu.UserId
                                             where gu.GroupId == groupId
                                             select u).ToList()
                                }).Take(1).ToListAsync();
            return groups;
        }

        [HttpGet("{groupId}/expense")]
        public async Task<IEnumerable<ExpenseData>> GetGroupExpenses(int groupId)
        {
            var groups = await (from e in _context.Expenses
                                join g in _context.Groups on e.GroupId equals g.GroupId
                                join u in _context.Users on e.PaidBy equals u.UserId
                                join cu in _context.Users on e.CreatedBy equals cu.UserId
                                where g.GroupId == groupId &&
                                e.IsSettlement == false
                                select new ExpenseData
                                {
                                    GroupId = e.GroupId,
                                    ExpenseId = e.ExpenseId,
                                    PaidBy = u.UserName,
                                    ExpenseName = e.ExpenseName,
                                    ExpenseAmount = e.ExpenseAmount,
                                    IsSettlement = e.IsSettlement,
                                    Currency = e.Currency,
                                    ExpenseDate = e.ExpenseDate,
                                    SplitType = e.SplitType,
                                    Notes = e.Notes,
                                    CreatedBy = cu.UserName,
                                    Modified = g.Modified,
                                    Total = (from e in _context.Expenses
                                             where e.GroupId == groupId
                                             select e.ExpenseAmount).Sum()


                                }).ToListAsync();
            return groups;
        }

        [HttpGet("/0/user/{userId}")]
        public async Task<IEnumerable<ExpenseData>> GetNonGroupExpenses(int userId)
        {
            var groups = await (from e in _context.Expenses
                                join g in _context.Groups on e.GroupId equals g.GroupId
                                join u in _context.Users on e.PaidBy equals u.UserId
                                join cu in _context.Users on e.CreatedBy equals cu.UserId
                                where g.GroupId == 0 &&
                                e.IsSettlement == false &&
                                (e.PaidBy == userId || e.CreatedBy == userId)
                                select new ExpenseData
                                {
                                    GroupId = e.GroupId,
                                    ExpenseId = e.ExpenseId,
                                    PaidBy = u.UserName,
                                    ExpenseName = e.ExpenseName,
                                    ExpenseAmount = e.ExpenseAmount,
                                    IsSettlement = e.IsSettlement,
                                    Currency = e.Currency,
                                    ExpenseDate = e.ExpenseDate,
                                    SplitType = e.SplitType,
                                    Notes = e.Notes,
                                    CreatedBy = cu.UserName,
                                    Modified = g.Modified,
                                    Total = (from e in _context.Expenses
                                             where e.GroupId == 0
                                             select e.ExpenseAmount).Sum()


                                }).ToListAsync();
            return groups;
        }

        [HttpPost]
        public async Task<ActionResult<GroupData>> AddGroup(Group group)
        {   
             _context.Groups.Add(group);
             await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGroup), new { GroupId = group.GroupId }, group);
        }

        [HttpPost("group-user")]
        public async Task<ActionResult<GroupUser>> AddGroupUser(GroupUser groupUser)
        {
            _context.GroupUsers.Add(groupUser);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGroupUser), new { Id = groupUser.Id }, groupUser);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GroupUser>> GetGroupUser(int id)
        {
            var groupUser = await _context.GroupUsers.FindAsync(id);
            if (groupUser == null)
            {
                return NotFound();
            }

            return groupUser;
        }

        [HttpDelete("{groupId}")]
        public async Task<ActionResult<Group>> DeleteGroup(int groupId)
        {
            var group = await _context.Groups.FindAsync(groupId);
            if (group == null)
            {
                return NotFound();
            }
            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();
            return group;
        }
    }
}