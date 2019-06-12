import React from "react";
import { connect } from "react-redux";

import Button from "../components/Button.jsx";
import Alert from "../components/Alert.jsx";

import store from "../store/store";
import {
  getSpotifyDisplayName,
  getUserAccessToken
} from "../store/selectors/index";
import {
  setUserAccessToken,
  setUserSpotifyDataStarted,
  setUserSpotifyDataFinished,
  setUserSpotifyDataError
} from "../store/actions/index";

import urlUtils from "../utils/urlUtils";
import spotifyUtils from "../utils/spotifyUtils";

const mapStateToProps = state => {
  return {
    user: {
      accessToken: getUserAccessToken(state),
      spotify: {
        display_name: getSpotifyDisplayName(state)
      }
    }
  };
};

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.abortController = new AbortController();
    this.state = {
      isLoading: false,
      user: {
        accessToken: "",
        isLoginAttempted: store.getState().user.isLoginAttempted,
        spotify: {
          display_name: ""
        }
      }
    };
  }

  componentDidMount() {
    const accessToken = this.getAccessToken();
    store.dispatch(setUserAccessToken(accessToken));

    if (accessToken && !this.state.user.spotify.displayName) {
      store.dispatch(setUserSpotifyDataStarted());
      spotifyUtils
        .getSpotifyUserData(accessToken, this.abortController)
        .then(result => {
          if (result.error) {
            store.dispatch(setUserSpotifyDataError(result));
            this.setState({ isLoading: false });
          } else {
            store.dispatch(setUserSpotifyDataFinished(result));
            this.props.history.push("/home");
            this.setState({ isLoading: false });
          }
        });
    }
  }
  
  componentWillUnmount() {
    this.abortController.abort();
  }

  getAccessToken() {
    this.setState({ isLoading: true });

    if (this.state.user.accessToken) {
      this.setState({ isLoading: false });
      return this.state.user.accessToken;
    }

    const accessTokenParam = urlUtils.getUrlParam("#", "access_token");
    if (
      !accessTokenParam ||
      urlUtils.getUrlParam("\\?", "error") === "access_denied"
    ) {
      //TODO: Check for accessToken in local storage and check to see if it is expired
      this.setState({ isLoading: false });
      return false;
    }

    this.setState({ isLoading: false });
    return accessTokenParam.split("&")[0];
  }

  fetchUserData() {
    store.dispatch(setUserSpotifyDataStarted());
    return;
  }

  render() {
    let alert;
    if (this.state.user.isLoginAttempted) {
      alert = <Alert>Failed login attempt.</Alert>;
    }
    return (
      <div>
        {alert}
        <Button handleClick={spotifyUtils.redirectToSpotifyLoginPage}>Authorize Spotify</Button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LoginContainer);