using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace trial.Models
{
    public class book
    {
        public int id { get; set; }
        public string name { get; set; }
        public string img { get; set; }
        public int level { get; set; }
        public string type { get; set; }
        public int SP { get; set; }
        public string info { get; set; }
    }
}