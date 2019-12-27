using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Splitwise.Core
{
    public class Activity
    {
        [Key]
        public int ActivityId { get; set; }
        public string ActivityDetails { get; set; }
        public int GroupId { get; set; }
        public int UserId { get; set; }
        public string CreatedAt { get; set; }
    }
}
