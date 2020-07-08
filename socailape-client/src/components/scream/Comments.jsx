import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import withStyle from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
// material-ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  ...theme.spreadThis,
  commentImage: {
    maxWidth: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: "50%",
  },
  commentData: {
    marginLeft: 20,
  },
});

class Comments extends Component {
  render() {
    const { comments, classes } = this.props;

    return (
      <React.Fragment>
        <Grid container>
          {comments.map((comment, index) => {
            const { body, createdAt, userHandle, userImage } = comment;
            return (
              <React.Fragment key={index}>
                <Grid item sm={12}>
                  <Grid container>
                    <Grid item sm={2}>
                      <img
                        src={userImage}
                        alt="comments"
                        className={classes.commentImage}
                      />
                    </Grid>
                    <Grid item sm={9}>
                      <div className={classes.commentData}>
                        <Typography
                          variant="h5"
                          color="primary"
                          component={Link}
                          to={`/user/${userHandle}`}
                        >
                          @{userHandle}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                        </Typography>
                        <hr className={classes.invisableSeperator} />
                        <Typography variant="body1">{body}</Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {index !== comments.length - 1 && (
                  <hr className={classes.visibleSeperator} />
                )}
              </React.Fragment>
            );
          })}
        </Grid>
      </React.Fragment>
    );
  }
}

Comments.propTypes = {
  classes: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
};

export default withStyle(styles)(Comments);
