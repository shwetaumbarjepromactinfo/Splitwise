using System;
using System.Collections.Generic;
using System.Text;

namespace Splitwise.Core
{
    public class GroupData
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public string GroupCategory { get; set; }
        public string CreatedBy { get; set; }
        public int CreatedById { get; set; }
        public string GroupLink { get; set; }
        public bool SimplifyDebts { get; set; }
        public string CreatedAt { get; set; }
        public string Modified { get; set; }
        public List<UserBalanceInfo> Users { get; set; }
    }
}
