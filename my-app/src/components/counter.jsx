import React, { Component } from "react";

class Counter extends Component {
  state = {
    count: 0,
    imageUrl: "https://picsum.photos/200",
    tags: ["tag1", "tag2", "tag3"],
  };

  //Alternate is <span style={{ fontSize: 30 }}
  styles = {
    fontSize: 10,
    fontWeight: "bold",
  };

  HandleIncrement = (product) => {
    console.log(product);
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <React.Fragment>
        <span className={this.GetBadgeClasses()}>{this.FormatCount()}</span>
        <button
          onClick={() => this.HandleIncrement(2)}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
        {this.state.tags.length === 0 && "Please create a new tag !"}
        {this.RenderTags()};
      </React.Fragment>
    );
  }

  RenderTags() {
    if (this.state.tags.length === 0) return <p>No tags :(</p>;

    return (
      <ul>
        {this.state.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    );
  }

  //Button counter stuff
  GetBadgeClasses() {
    let classes = "badge m-2 badge-";
    classes += this.state.count === 0 ? "warning" : "primary";
    return classes;
  }

  FormatCount() {
    const { count } = this.state;
    return count === 0 ? "Zero" : count;
  }
}

export default Counter;
