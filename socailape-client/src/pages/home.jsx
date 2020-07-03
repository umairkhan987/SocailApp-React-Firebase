import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Scream from "../components/scream";

class Home extends Component {
  state = {
    screams: null,
  };

  async componentDidMount() {
    try {
      const { data } = await axios.get("/screams");
      this.setState({ screams: data });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    let recentScreamMarkup = this.state.screams ? (
      this.state.screams.map((scream) => (
        <Scream key={scream.screamId} scream={scream} />
      ))
    ) : (
      <p>Loading....</p>
    );

    return (
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {recentScreamMarkup}
        </Grid>

        <Grid item sm={4} xs={12}>
          <p>Profile.... </p>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
