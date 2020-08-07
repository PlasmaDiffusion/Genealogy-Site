//For sorting objects by their date property
class Sorter {
  constructor() {}

  sortChildren(children) {
    //Array that will become 2d and store not only game
    var birthdates = [];

    //Get all birthdates (Store the dates and also the index of the child)
    children.forEach((child, i) => {
      if (child.birthdate) birthdates.push([child.birthdate.split("T")[0], i]);
      else birthdates.push(["", i]);
    });

    //Sort the birthdates
    birthdates.sort(function (a, b) {
      return a[0] - b[0];
    });

    birthdates.sort();

    var newChildArray = [];

    //Match the children with the sorted dates (Using the previously stored index to match them)
    birthdates.forEach((date, i) => {
      newChildArray[i] = children[date[1]];
    });

    //Now return a sorted child array
    return newChildArray;
  }

  //sortFamilies(families){}
}

export default Sorter;
