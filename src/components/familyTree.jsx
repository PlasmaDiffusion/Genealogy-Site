import React, { Component } from "react";

class FamilyTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleChildren: [],
      currentId: 0,
    };

    this.toggle = this.toggle.bind(this);
    this.incrementId = this.incrementId.bind(this);
    this.setVisibleFlags = this.setVisibleFlags.bind(this);

    this.setVisibleFlags();

    console.log(props.tree);
  }

  setVisibleFlags() {
    //Outer is visible

    this.state.visibleChildren.push(true);

    this.props.tree.children.map((child) => {
      this.state.visibleChildren.push(false);

      child.startedFamilies.map((family) => {
        this.state.visibleChildren.push(false);
      });
    });

    console.log("Vis", this.state.visibleChildren);
  }

  //Toggle visibility of children on the tree
  toggle(index) {
    console.log("ID:", index);

    let newChildren = [...this.state.visibleChildren];

    newChildren[index] = !newChildren[index];

    this.setState({
      visibleChildren: newChildren,
    });
  }

  incrementId() {
    this.setState({
      currentId: this.state.currentId++,
    });

    this.state.visibleChildren.push(true);
    console.log("Visible children", this.state.visibleChildren);
  }

  getTreeData(family, id) {
    const styles = {
      hiddenStyle: {
        display: "none",
      },
      visibleStyle: {
        display: "block",
      },
    };

    id++;

    return (
      <React.Fragment>
        <ul class="nested">
          <li>
            <span
              class="caret"
              onClick={() => {
                this.toggle(id);
              }}
            >
              {family.name}
            </span>
          </li>

          <ul
            class="nested"
            style={
              this.state.visibleChildren[id]
                ? styles.visibleStyle
                : styles.hiddenStyle
            }
          >
            <li>{family.parentA.name}</li>
            <li>{family.parentB.name}</li>
            <li>
              <span
                class="caret"
                onClick={() => {
                  this.toggle(++id);
                }}
              >
                {id}
                Children
              </span>
            </li>
            <ul
              class="nested"
              style={
                this.state.visibleChildren[id]
                  ? styles.visibleStyle
                  : styles.hiddenStyle
              }
            >
              {family.children.map((currentChild) => (
                <React.Fragment>
                  <li>
                    <span
                      class="caret"
                      onClick={() => {
                        this.toggle(++id);
                      }}
                    >
                      {id}
                      {currentChild.name}
                      {console.log("Child family", currentChild)}
                      {currentChild.startedFamilies.map((currentFamily) =>
                        this.getTreeData(currentFamily, id)
                      )}
                    </span>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </ul>
        </ul>
      </React.Fragment>
    );
  }

  render() {
    const styles = {
      hiddenStyle: {
        display: "none",
      },
      visibleStyle: {
        display: "block",
      },
    };

    return (
      <React.Fragment>{this.getTreeData(this.props.tree, -1)}</React.Fragment>
    );
  }
}

export default FamilyTree;
