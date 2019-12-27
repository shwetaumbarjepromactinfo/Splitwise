using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Splitwise.Core
{
    public class SplitType
    {
        [Key]
        public int TypeId { get; set; }
        public string Type_name { get; set; }
        public bool IsActive { get; set; }
    }
}
