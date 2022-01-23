using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace trial.Controllers
{   
    public class HomeController : Controller
    {
        // static array for storing the categories selected by the user.        
        public static int[] source = new int[5] { 0, 0, 0, 0, 0};
     
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        //Action for fetch data from database for show in multiselect dropdown angular
        public JsonResult getcategories()
    {
        using (BookDatabaseEntities2 dc = new BookDatabaseEntities2())
        {
            return new JsonResult { Data = dc.Categories.ToList(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }

    // saving the categories selected by the user from angular code
    [HttpPost]
    public JsonResult savedata(int[] categoryIds)
    {       
            int n = categoryIds.Length;
     // Copies the selected categories into the array already defined.Called from myScript.js(angular)
            for(int i=0;i<n;i++)
            {
                source[i] = categoryIds[i];
            }
           
        List<Book> list = new List<Book>();
        if (categoryIds != null)
        {
            using (BookDatabaseEntities2 dc = new BookDatabaseEntities2())
            {
                list = dc.Books.Where(a => categoryIds.Contains(a.CategoryID)).ToList();
            }
                
        }
        return new JsonResult { Data = list };
    }
        
   // Action code to get all the book information that the user wants from selected categories called from reactscript.js
    public JsonResult savedata1()
        {
            List<BookTable1> list = new List<BookTable1>();
            if (source[0] != 0) {
                using (BookDatabaseEntities2 dc = new BookDatabaseEntities2())
                {
                    list = dc.BookTable1.Where(a => source.Contains(a.level)).ToList();
                }
                return new JsonResult { Data = list,JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                
            }
            using (BookDatabaseEntities2 dc = new BookDatabaseEntities2())
            {
                return new JsonResult { Data = dc.BookTable1.ToList(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}