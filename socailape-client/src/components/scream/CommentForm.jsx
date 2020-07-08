import React, { Component } from "react";
import { PropTypes } from "prop-types";
import withStyle from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
// material-ui
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// Icons
import CircularProgress from "@material-ui/core/CircularProgress";
// Redux stuff
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class CommentForm extends Component {
  state = {
    body: "",
    errors: {},
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.submitComment(this.props.screamId, { body: this.state.body });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "" });
    }
  }

  render() {
    const { classes, authenticated } = this.props;
    const { errors } = this.state;
    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            id="body"
            label="Comment on scream"
            className={classes.textField}
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={(e) => this.setState({ body: e.target.value })}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Comment
          </Button>
        </form>
        <hr className={classes.visibleSeperator} />
      </Grid>
    ) : null;

    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  screamId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment })(
  withStyle(styles)(CommentForm)
);
