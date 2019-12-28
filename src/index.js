import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

class TimerInput extends React.Component {
  render() {
    return (
      <div style={{ marginLeft: 100 }}>
        <h3>Input your desired time in minutes</h3>
        <input
          type="number"
          value={this.props.value}
          onChange={this.props.handleChange}
          required
        />
      </div>
    );
  }
}

class Timer extends React.Component {
  render() {
    let minutes = "00";
    if (this.props.value !== "") {
      minutes = this.props.value;
    }
    return (
      <div>
        <h1 style={{ fontSize: 100, marginLeft: 100 }}>
          {minutes}:{this.props.seconds}
        </h1>
      </div>
    );
  }
}

class StartButton extends React.Component {
  render() {
    return (
      <div style={{ marginLeft: 130 }}>
        <button
          className="btn btn-lg btn-success"
          disabled={!this.props.value}
          onClick={this.props.startCountDown}
        >
          Start
        </button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: "00",
      value: "",
      isClicked: false
    };
    const halfTimeUrl =
      "https://maximgalushka.com/wp-content/uploads/2019/12/half-time.m4a";
    this.halfTime = new Audio(halfTimeUrl);

    const oneMinuteUrl =
      "https://maximgalushka.com/wp-content/uploads/2019/12/95245__tim-kahn__one-minute-left.wav";
    this.oneMinute = new Audio(oneMinuteUrl);

    const finishTimerUrl =
      "https://maximgalushka.com/wp-content/uploads/2019/12/384188__inspectorj__rooster-crowing-a.wav";
    this.finishTimer = new Audio(finishTimerUrl);

    this.initialTimer;
    this.secondsRemaining;
    this.intervalHandle;
    this.handleChange = this.handleChange.bind(this);
    this.startCountDown = this.startCountDown.bind(this);
    this.tick = this.tick.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  tick() {
    var min = Math.floor(this.secondsRemaining / 60);
    var sec = this.secondsRemaining - min * 60;

    this.setState({
      value: min,
      seconds: sec
    });

    if (sec < 10) {
      this.setState({
        seconds: "0" + this.state.seconds
      });
    }

    if (min < 10) {
      this.setState({
        value: "0" + min
      });
    }

    if (this.secondsRemaining < 0 || (min === 0 && sec === 0)) {
      this.finishTimer.play();
      clearInterval(this.intervalHandle);
      this.setState({
        isClicked: false,
        value: "",
        seconds: "00"
      });
    }

    if (this.secondsRemaining === this.initialTimer / 2) {
      this.halfTime.play();
    } else if (this.secondsRemaining === 60) {
      this.oneMinute.play();
    }

    this.secondsRemaining--;
  }

  startCountDown() {
    this.intervalHandle = setInterval(this.tick, 1000);
    let time = this.state.value;
    this.initialTimer = time * 60;
    this.secondsRemaining = time * 60;
    this.setState({
      isClicked: true,
      value: ""
    });
  }

  render() {
    const clicked = this.state.isClicked;
    if (clicked) {
      return (
        <div>
          <div className="row">
            <div className="col-md-4" />
            <div className="col-md-4">
              <Timer value={this.state.value} seconds={this.state.seconds} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="row">
            <div className="col-md-4" />
            <div className="col-md-4">
              <TimerInput
                value={this.state.value}
                handleChange={this.handleChange}
              />
              <Timer value={this.state.value} seconds={this.state.seconds} />
              <StartButton
                startCountDown={this.startCountDown}
                value={this.state.value}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
