class TreeData {
  constructor() {
    var branches = [];
  }

  logBranches() {
    console.log("branches");

    this.branches.forEach((branch) => {
      console.log(branch);
    });
  }

  addBranch(branch) {
    this.branches.push(branch);
  }
}
export default TreeData;
