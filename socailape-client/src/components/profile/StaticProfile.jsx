import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
// material-ui
import withStyle from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
//icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const styles = (theme) => ({
  ...theme.profileStyling,
});

class StaticProfile extends Component {
  render() {
    const {
      classes,
      profile: { handle, createdAt, imageUrl, bio, website, location },
    } = this.props;

    return (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="Profile" className="profile-image" />
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/user/${handle}`}
              color="primary"
              variant="h5"
            >
              @{handle}
            </MuiLink>
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (
              <React.Fragment>
                <LocationOn color="primary" /> <span>{location}</span>
                <hr />
              </React.Fragment>
            )}
            {website && (
              <React.Fragment>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {" "}
                  {website}
                </a>
                <hr />
              </React.Fragment>
            )}
            <CalendarToday color="primary" />{" "}
            <span>Joined {dayjs(createdAt).format("MMM YYYY")} </span>
          </div>
        </div>
      </Paper>
    );
  }
}

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyle(styles)(StaticProfile);
