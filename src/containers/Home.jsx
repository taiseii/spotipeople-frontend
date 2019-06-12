import React from "react";
import { connect } from "react-redux";
import {
  getUserAccessToken,
  getSpotifyDisplayName,
  getSpotifyDisplayImgUrl
} from "../store/selectors/index";

import spotifyUtils from "../utils/spotifyUtils";

import User from "../components/User.jsx";
import Button from "../components/Button.jsx";

const mapStateToProps = state => {
  return {
    user: {
      accessToken: getUserAccessToken(state),
      spotify: {
        display_name: getSpotifyDisplayName(state),
        img_url: getSpotifyDisplayImgUrl(state)
      }
    }
  };
};

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        accessToken: "",
        spotify: {
          display_name: "",
          img_url: ""
        }
      }
    }
  }

  getTopTracks() {
    spotifyUtils.getSpotifyTopTracks(this.state.user.accessToken).then(result => {
      console.log(result);
    })
  }

  render() {
    return (
      <div>
        <User
          username={this.props.user.spotify.display_name}
          imgUrl={this.props.user.spotify.img_url}
        />
        <Button handleClick={this.getTopTracks.bind(this)}>Load top tracks</Button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomeContainer);
