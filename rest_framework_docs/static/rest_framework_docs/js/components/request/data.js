var React = require('react');

var FieldText = require('../fields/text');
var FieldBoolean = require('../fields/boolean');
var Header = require('../helpers/header');
var RequestUtils = require('../../utils/request');

var Data = React.createClass({
  removeCustomField: function (fieldName) {
    this.props.removeCustomField(fieldName);
  },

  handleBooleanChange: function (fieldName, value) {
    this.props.onChange(value, fieldName);
  },

  handleTextChange: function (fieldName, event) {
    this.props.onChange(event.target.value, fieldName);
  },

  _renderBooleanField: function (field, key) {
    var name = field.name;
    if (field.parent){
      name = field.parent + "." +  field.name;
    }
    var value = this.props.data[name];

    return (
      <FieldBoolean
        key={key}
        name={name}
        value={value}
        required={field.required ? 'required' : false}
        removeField={this.removeCustomField}
        isCustom={field.isCustom ? 'isCustom' : false}
        onChange={this.handleBooleanChange.bind(this, name)} />
    );
  },

  _renderTextInput: function (field, key) {
    var name = field.name;
    if (field.parent){
      name = field.parent + "." +  field.name;
    }
    var value = this.props.data[name];
    var type = name == 'password' ? 'password' : 'text';
    return (
      <FieldText
        key={key}
        type={type}
        name={name}
        value={value}
        placeholder={field.type}
        required={field.required ? 'required' : false}
        removeField={this.removeCustomField}
        isCustom={field.isCustom ? 'isCustom' : false}
        onChange={this.handleTextChange.bind(this, name)} />
    );
  },

  _renderFields: function (fields, parent) {
    if (!fields){
      fields = this.props.fields
    }
    return fields.map(function(field, key) {
        field.parent = parent
      
      if (field.sub_fields){
        return this._renderFields(field.sub_fields, field.name)
      }
      switch (field.type) {
      case ('BooleanField'):
        return this._renderBooleanField(field, key);

      case ('CharField'):
      default:
        return this._renderTextInput(field, key);

      }
    }, this);
  },

  render: function () {
    if (!RequestUtils.shouldIncludeData(this.props.method)) {
      return null;
    }

    return (
      <div>
        {this.props.fields.length ? <Header title='Data' /> : null}
        {this._renderFields()}
      </div>
    );
  }
});

module.exports = Data;
