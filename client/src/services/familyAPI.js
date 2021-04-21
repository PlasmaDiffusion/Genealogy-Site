import axios from "axios";
import NullChecker from "../services/nullChecker.js";
import Sorter from "../services/sorter.js";
import { getServerUrl } from "./getUrl.js";

export function readFamilyFromUrl() {
  //Read in the family being edited
  var url = new URLSearchParams(window.location.search);
  var id = url.get("id");
  var baseId = url.get("baseId");
  this.setState({ familyId: id });

  var familyData = { id: id };

  if (baseId) familyData.basedId = baseId;

  return axios
    .get(getServerUrl() + "/read/family/" + id)
    .then((response) => {
      //console.log("Family Response: ", response.data);

      //This component will break if it doesn't handle null data
      const nullChecker = new NullChecker();
      nullChecker.familyNullCheck([response.data]);
      //Set family data to fill in on the form
      familyData.name = response.data.name;
      familyData.description = response.data.description;
      familyData.children = response.data.children;
      familyData.parentA = response.data.parentA;
      familyData.parentB = response.data.parentB;
      familyData.marriageDate = response.data.marriageDate;
      familyData.marriageDateYearOnly = response.data.marriageDateYearOnly;
      familyData.marriageLocation = [];

      //Make marriage Location 3 lines
      if (response.data.marriageLocation) {
        familyData.marriageLocation = response.data.marriageLocation.split(" ");
      }

      let sorter = new Sorter();

      familyData.children = sorter.sortChildrenByBirthdates(
        familyData.children
      );

      return familyData;
    })
    .catch(function (error) {
      console.log(error);
    });
}
