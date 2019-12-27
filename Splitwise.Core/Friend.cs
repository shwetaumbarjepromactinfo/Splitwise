using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Splitwise.Core
{
    public class Friend
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FriendId { get; set; }
        public string CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
