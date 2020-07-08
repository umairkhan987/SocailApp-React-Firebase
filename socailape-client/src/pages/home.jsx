import React, { Component } from "react";
import { PropTypes } from "prop-types";
// material-ui
import Grid from "@material-ui/core/Grid";
// component
import Scream from "../components/scream/scream";
import Profile from "../components/profile/Profile";
// redux stuff
import { connect } from "react-redux";
import { getScreams } from "./../redux/actions/dataActions";

class Home extends Component {
  componentDidMount() {
    this.props.getScreams();
  }

  render() {
    const { screams, loading } = this.props.data;
    let recentScreamMarkup = !loading ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <p>Loading....</p>
    );

    return (
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {recentScreamMarkup}
        </Grid>

        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getScreams })(Home);
