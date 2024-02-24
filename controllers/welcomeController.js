exports.getWelcomepage = (request, response, next) => {
    response.sendFile("Welcome.html", { root: "views" });
  };
  exports.getErrorpage = (request, response, next) => {
    response.sendFile("notfound.html", { root: "views" });
  };
  exports.getExpensepage = (request, response, next) => {
    response.sendFile("expenseTracker.html", { root: "views" });
  };
  exports.getReportpage = (req, res) =>{
      res.sendFile("report.html", {root: "views"});
  }