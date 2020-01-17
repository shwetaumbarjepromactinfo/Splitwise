using System;
using System.Collections.Generic;
using System.Text;

namespace Splitwise.Core
{
    public class FriendExpenseData
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public double? OwedAmount { get; set; }
        public double? PaidAmount { get; set; }
        public string Currency { get; set; }
        public string ExpenseName { get; set; }
        public string Date { get; set; }
    }
}
