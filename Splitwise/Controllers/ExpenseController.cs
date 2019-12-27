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
    public class ExpenseController : ControllerBase
    {
        private readonly SplitwiseDbContext _context;

        public ExpenseController(SplitwiseDbContext _context)
        {
            this._context = _context;
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseData>> AddExpense(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExpense), new { ExpenseId = expense.ExpenseId }, expense);
        }

        [HttpGet("{expenseId}")]
        public async Task<IEnumerable<ExpenseData>> GetExpense(int expenseId)
        {
            var expenseDetails = await (from e in _context.Expenses
                                        join r in _context.Repayments on e.ExpenseId equals r.ExpenseId
                                        join u in _context.Users on e.PaidBy equals u.UserId
                                        join cu in _context.Users on e.CreatedBy equals cu.UserId
                                        where e.ExpenseId == expenseId &&
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
                                            Modified = e.Modified,
                                            repaymentDetails = (from r in _context.Repayments
                                                                join fu in _context.Users on r.From equals fu.UserId
                                                                join su in _context.Users on r.To equals su.UserId
                                                                where r.ExpenseId == expenseId
                                                                select new RepaymentDetail
                                                                {
                                                                    From = fu.UserName,
                                                                    To = su.UserName,
                                                                    Amount = r.Amount,
                                                                    ExpenseId = r.ExpenseId
                                                                }).ToList()


                                        }).ToListAsync();
            return expenseDetails;
        }

        [HttpPut("{expenseId}")]
        public async Task<IActionResult> UpdateExpense(int expenseId, Expense expense)
        {
            if (expenseId != expense.ExpenseId)
            {
                return BadRequest();
            }

            _context.Entry(expense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExepnseExists(expenseId))
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

        private bool ExepnseExists(int expenseId)
        {
            var expense = _context.Users.FindAsync(expenseId);
            if (expense == null)
            {
                return false;
            }
            return true;
        }

        [HttpGet("{userId}/settlement")]
        public async Task<IEnumerable<ExpenseData>> GetSettlement(int userId)
        {
            var groups = await (from e in _context.Expenses
                                join r in _context.Repayments on e.ExpenseId equals r.ExpenseId
                                join u in _context.Users on e.PaidBy equals u.UserId
                                join cu in _context.Users on e.CreatedBy equals cu.UserId
                                where e.PaidBy == userId &&
                                e.IsSettlement == true
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
                                    Modified = e.Modified,
                                    repaymentDetails = (from r in _context.Repayments
                                                        join fu in _context.Users on r.From equals fu.UserId
                                                        join su in _context.Users on r.To equals su.UserId
                                                        where r.From == userId &&
                                                        r.ExpenseId == e.ExpenseId
                                                        select new RepaymentDetail
                                                        {
                                                            From = fu.UserName,
                                                            To = su.UserName,
                                                            Amount = r.Amount,
                                                            ExpenseId = r.ExpenseId
                                                        }).ToList()


                                }).ToListAsync();
            return groups;
        }

        [HttpPost("{expenseId}/repayment")]
        public async Task<ActionResult<Repayment>> AddRepayment(Repayment repayment)
        {
            _context.Repayments.Add(repayment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRepayment), new { RepaymentId = repayment.RepaymentId }, repayment);
        }

        [HttpGet("{repaymentId}")]
        public async Task<ActionResult<Repayment>> GetRepayment(int repaymentId)
        {
            var repayment = await _context.Repayments.FindAsync(repaymentId);
            if (repayment == null)
            {
                return NotFound();
            }
            return repayment;
        }
    }
}