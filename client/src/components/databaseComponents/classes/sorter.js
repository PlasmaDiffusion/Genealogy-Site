//For sorting objects by their date property
class Sorter {
  constructor() {}

  //Sort children by birthdate
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

  sortTest() {
    let strings = ["McNee 1981", "McNee 1990", "McNee 1812", "McNee 2006"];
    strings.sort();
    console.log(strings);
  }

  //Sort families by their names (Assume it's a name + a year)
  sortFamilies(families) {
    var familyNames = [];

    //Get all names (and store the index too)
    families.forEach((family, i) => {
      if (family.name) familyNames.push([family.name, i]);
    });

    familyNames.sort();

    var newFamilyArray = [];

    //Match the families with the sorted family names (Using the previously stored index to match them)
    familyNames.forEach((name, i) => {
      newFamilyArray[i] = families[name[1]];
    });

    //Now return a sorted child array
    return newFamilyArray;
  }
}

export default Sorter;
