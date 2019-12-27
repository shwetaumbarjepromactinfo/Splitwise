using System;
using System.Collections.Generic;
using System.Text;

namespace Splitwise.Core
{
    public class RepaymentDetail
    {
        public string From { get; set; }
        public string To { get; set; }
        public double Amount { get; set; }
        public int ExpenseId { get; set; }
    }
}
