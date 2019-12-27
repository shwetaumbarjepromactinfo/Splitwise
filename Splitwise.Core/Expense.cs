using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Splitwise.Core
{
    public class Expense
    {
        [Key]
        public int ExpenseId { get; set; }
        public int GroupId { get; set; }
        public int PaidBy { get; set; }
        public string ExpenseName { get; set; }
        public double ExpenseAmount { get; set; }
        public string Currency { get; set; }
        public string ExpenseDate { get; set; }
        public string Notes { get; set; }
        public string SplitType { get; set; }
        public int CreatedBy { get; set; }
        public bool IsSettlement { get; set; }
        public string Modified { get; set; }
        public bool IsActive { get; set; }
    }
}
