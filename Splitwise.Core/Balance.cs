using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Splitwise.Core
{
    public class Balance
    {
        [Key]
        public int BalanceId { get; set; }
        public int UserId { get; set; }
        public int ExpenseId { get; set; }
        public double PaidShare { get; set; }
        public double OwedShare { get; set; }
        public double NetBalance { get; set; }
        public string Modified { get; set; }
        public string CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
