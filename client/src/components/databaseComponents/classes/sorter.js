//For sorting objects by their date property
class Sorter {
  constructor() {}

  //Sort children by birthdate
  sortChildrenByBirthdates(children) {
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
  sortFamiliesByNameAndMarriage(families) {
    var familyNames = [];

    //Get all names (and store the index too)
    families.forEach((family, i) => {
      if (family.name) {
        //Check for numbers that a date would have
        if (!family.name.includes("1") && !family.name.includes("2")) {
          //If no numbers for a date are found, try to add on the year automatically
          if (family.marriageDate) {
            family.name += " " + family.marriageDate.split("-")[0];
          }
        }

        //Add the family to the new array to be sorted
        familyNames.push([family.name, i]);
      }
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

  sortPeopleByName(people) {
    var peopleNames = [];

    //Get all names (and store the index too)
    people.forEach((person, i) => {
      peopleNames.push([person.name, i]);
    });

    peopleNames.sort();

    var newPersonArray = [];

    //Match the people with the sorted person names (Using the previously stored index to match them)
    peopleNames.forEach((name, i) => {
      newPersonArray[i] = people[name[1]];
    });

    //Now return a sorted person array
    return newPersonArray;
  }
}

export default Sorter;
