import React, { Component } from "react";
import Counter from "./counter";

//The PLURAL one
class Counters extends Component {
  render() {
    const { onReset, counters, onDelete, onIncrement } = this.props;

    return (
      <div>
        <button onClick={this.props.onReset} className="btn btn-primary btn-sm">
          Reset
        </button>

        {this.props.counters.map((counter) => (
          <Counter //Props are defined here
            key={counter.id}
            counter={counter}
            onDelete={onDelete}
            onIncrement={onIncrement}
          />
        ))}
      </div>
    );
  }
}

export default Counters;
