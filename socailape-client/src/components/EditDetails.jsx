import React, { Component } from "react";
import { PropTypes } from "prop-types";
import MyButton from "../util/myButton";
//Material-ui
import withStyle from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// Icons
import EditIcon from "@material-ui/icons/Edit";
// Redux stuff
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
  button: {
    float: "right",
  },
});

class EditDetails extends Component {
  state = {
    bio: "",
    location: "",
    website: "",
    open: false,
  };

  mapUserDetailToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      location: credentials.location ? credentials.location : "",
      website: credentials.website ? credentials.website : "",
    });
  };

  componentDidMount() {
    const { credentials } = this.props;
    this.mapUserDetailToState(credentials);
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailToState(this.props.credentials);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <MyButton
          tip="Edit details"
          placement="top"
          btnClassName={classes.button}
          onClick={this.handleOpen}
        >
          <EditIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              {/* Text field for bio */}
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="Short bio about your self"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              {/* Text field for website */}
              <TextField
                name="website"
                type="text"
                label="Website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
              {/* Text field for location */}
              <TextField
                name="location"
                type="text"
                label="Location"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="secondary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetails })(
  withStyle(styles)(EditDetails)
);
