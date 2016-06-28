var React = require('react');
var APIRequest = require('superagent');

var RequestUtils = require('../utils/request');
var Request = require('./request');
var Response = require('./response');

var LiveAPIEndpoints = React.createClass({

  getInitialState: function() {
    return {
      endpoint: this.props.endpoint,
      response: null
    };
  },

  getData: function () {
    var method = this.refs.request.state.selectedMethod;
    return RequestUtils.shouldIncludeData(method) ? (
      this.refs.request.state.data
    ) : null;
  },
  get_parent: function(objectName){
    var ind = objectName.indexOf('.');
    if(ind > -1)
        return objectName.substr(0, ind);
    return false
  },
  get_child: function(objectName){
    var ind = objectName.indexOf('.');
    if(ind > -1)
        return objectName.substr(ind+1);
    return false
  },
  nested_fields: function(data) {
    var nested_dict = {};
    for(var key in data){
        var parent = this.get_parent(key);
        if(parent){
            var child = this.get_child(key);
            if(!data[parent]){
                data[parent] = {};
            }
            data[parent][child] = data[key];
            delete data[key];

            this.nested_fields(data[parent])
        }
    }
  },
  createHashStructure: function(data) {

    var dict_data = {};

    var nested_dict = {};
    var that = this;
    data.forEach(function(obj, ind){
        if(obj.sub_fields != null){
            dict_data[obj.name] = that.createHashStructure(obj.sub_fields);
        }
        else {
            dict_data[obj.name] = '';
        }
    })

    return dict_data;
  },
  makeRequest: function (event) {
    event.preventDefault();
    var self = this;
    var request = this.refs.request.state;
    var headers = {};
    if (this.refs.request.state.headers.authorization) {
      headers['Authorization'] = this.refs.request.state.headers.authorization;
    };

    var data = this.getData();
    this.nested_fields(data);
    // Now Make the Request
    APIRequest(request.selectedMethod, request.endpoint.path)
      .set(headers)
      .send(data)
      .end(function (err, res) {
        self.setState({
          response: res
        });
      });
  },

  render: function () {
    return (
      <form className="form-horizontal" onSubmit={this.makeRequest}>
        <div className="modal-body">
          <div className="row">
            <div className="col-md-6 request">
              <Request endpoint={this.state.endpoint} ref='request' />
            </div>
            <div className="col-md-6 response">
              <Response payload={this.state.response} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
          <button type="submit" className="btn btn-primary">Send</button>
        </div>
      </form>
    );
  }
});
module.exports = LiveAPIEndpoints;
