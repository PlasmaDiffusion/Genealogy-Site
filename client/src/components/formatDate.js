export function formatDate(date) {
  //Remove time
  var dateOnly = date.split("T")[0];

  //Split slashes to get year, month and day
  var yymmdd = dateOnly.split("-");

  //Turn the month number into an actual month prefix
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var monthNumber = parseInt(yymmdd[1]);

  console.log("Year", yymmdd[0]);
  console.log("Month", yymmdd[1], "Prefix", months[monthNumber]);
  console.log("Day", yymmdd[2]);

  return months[monthNumber - 1] + " " + yymmdd[2] + ", " + yymmdd[0];
}
