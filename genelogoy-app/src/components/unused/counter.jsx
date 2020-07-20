import React, { Component } from "react";

class Counter extends Component {
  /*componentDidUpdate(prevProps, prevState) {
    console.log("prevProps", prevProps);
    console.log("prevState", prevState);
    if (prevProps.counter.value !== this.props.counter.value) {
      //Ajax call and get new data from the server
    }
  }

  //Clean up timers, listeners, etc.
  componentWillUnmount() {
    console.log("Counter - Unmount");
  }*/

  render() {
    return (
      <div>
        <span className={this.GetBadgeClasses()}>{this.FormatCount()}</span>
        <button
          onClick={() => this.props.onIncrement(this.props.counter)}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
        <button
          onClick={() => this.props.onDelete(this.props.counter.id)}
          className="btn btn-danger btn-sm m-2"
        >
          X
        </button>
      </div>
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
    classes += this.props.counter.value === 0 ? "warning" : "primary";
    return classes;
  }

  //Zero as letters or numbers?
  FormatCount() {
    const { value: count } = this.props.counter;
    return count === 0 ? "Zero" : count;
  }

  //Counter has children <elements> in Counters
  RenderChildren() {
    return <p>{this.props.children}</p>;
  }
}

export default Counter;
