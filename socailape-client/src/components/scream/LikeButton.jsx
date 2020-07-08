import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
// material-ui
import MyButton from "../../util/myButton";
// redux stuff
import { connect } from "react-redux";
import { likeScream, unLikeScream } from "../../redux/actions/dataActions";
// Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

class LikeButton extends Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.screamId
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };

  unlikeScream = () => {
    this.props.unLikeScream(this.props.screamId);
  };

  render() {
    const {
      user: { authenticated },
    } = this.props;

    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedScream() ? (
      <MyButton tip="Unlike" onClick={this.unlikeScream}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeScream}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unLikeScream: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
};

const mapActionToProps = {
  likeScream,
  unLikeScream,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, mapActionToProps)(LikeButton);
