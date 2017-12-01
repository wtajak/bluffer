import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { string, func, instanceOf } from 'prop-types';

import { MOCK_RESPONSE } from '../modules/proxy/constants';

class Log extends Component {
  static propTypes = {
    url: string.isRequired,
    responseBody: string.isRequired,
    client: string.isRequired,
    prettyResponseBody: string,
    timestamp: instanceOf(Date).isRequired,
    saveMockResponse: func.isRequired,
  };

  defaultProps = {
    prettyResponseBody: null,
  }

  state = {
    isEditMode: false,
  };

  toggleMockForm = (e) => {
    e.preventDefault();
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  mockResponse = (e) => {
    e.preventDefault();
    const { saveMockResponse, url } = this.props;
    saveMockResponse(url, this.textarea.value);
    this.setState({ isEditMode: false });
  }

  render() {
    const { url, timestamp, responseBody, prettyResponseBody, client } = this.props;
    const { isEditMode } = this.state;
    const dateTime = moment(timestamp).format('DD-MMM HH:mm:ss');

    return (
      <li className="list-group-item" key={url}>
        <div className="row w-100">
          <div className="col-7 url" title={url}>{url}</div>
          <div className="col-2">{client}</div>
          <div className="col-2">{dateTime}</div>
          <div className="col-1">
            <button className="float-right btn btn-primary" onClick={this.toggleMockForm}>
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
        {isEditMode && [
          <div className="form-group mt-1 row w-100">
            <textarea
              ref={(r) => {
                this.textarea = r;
              }}
              rows="10"
              className="col form-control"
              defaultValue={prettyResponseBody || responseBody}
            />
          </div>,
          <div className="row mt-1 w-100">
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={this.mockResponse}
              >
                Save
              </button>
            </div>
          </div>]}
      </li>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveMockResponse: (url, responseBody) => {
    dispatch({
      type: MOCK_RESPONSE,
      payload: { url, responseBody },
    });
  },
});

export default connect(null, mapDispatchToProps)(Log);
