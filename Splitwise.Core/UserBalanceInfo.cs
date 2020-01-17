using System;
using System.Collections.Generic;
using System.Text;

namespace Splitwise.Core
{
    public class UserBalanceInfo
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public string CreatedAt { get; set; }
        public string Modified { get; set; }
        public bool IsActive { get; set; }
        public double NetBal { get; set; }
    }
}
