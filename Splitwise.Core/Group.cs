using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Splitwise.Core
{
    public class Group
    {
        [Key]
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public string GroupCategory { get; set; }
        public int CreatedBy { get; set;}
        public string GroupLink { get; set; }
        public bool SimplifyDebts { get; set; }
        public string CreatedAt { get; set; }
        public string Modified { get; set; }
        public bool IsActive { get; set; }
    }
}
