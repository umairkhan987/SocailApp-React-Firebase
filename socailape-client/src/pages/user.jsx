import React, { Component } from "react";
import { PropTypes } from "prop-types";
import axios from "axios";
import Scream from "./../components/scream/scream";
import StaticProfile from "./../components/profile/StaticProfile";
import ScreamSkeleton from "../util/ScreamSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";
// material-ui
import Grid from "@material-ui/core/Grid";
// redux stuff
import { connect } from "react-redux";
import { getOtherUserData } from "../redux/actions/dataActions";

// const styles = (theme) => ({
//   ...theme.spreadThis,
// });

class User extends Component {
  state = {
    profile: null,
    screamIdParams: null,
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const screamId = this.props.match.params.screamId;

    if (screamId) this.setState({ screamIdParams: screamId });

    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user,
        });
      })
      .catch((err) => console.log(err));
    this.props.getOtherUserData(handle);
  }

  render() {
    const { screams, loading } = this.props.data;
    const { screamIdParams } = this.state;

    const screamsMarkup = loading ? (
      <ScreamSkeleton />
    ) : screams === null ? (
      <p>No screams from this user.</p>
    ) : !screamIdParams ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      screams.map((scream) => {
        if (scream.screamId !== screamIdParams)
          return <Scream key={scream.screamId} scream={scream} />;
        else return <Scream key={scream.screamId} scream={scream} openDialog />;
      })
    );
    return (
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {screamsMarkup}
        </Grid>

        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

User.propTypes = {
  getOtherUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getOtherUserData })(User);
