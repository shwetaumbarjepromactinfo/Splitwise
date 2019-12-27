using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Splitwise.Core
{
    public class Repayment
    {
        [Key]
        public int RepaymentId { get; set; }
        public int ExpenseId { get; set; }
        public int From { get; set; }
        public int To { get; set; }
        public double Amount { get; set; }
        public string CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
