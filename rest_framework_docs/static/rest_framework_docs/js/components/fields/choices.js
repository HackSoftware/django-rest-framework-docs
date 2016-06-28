var React = require('react');

var FieldChoices = React.createClass({

  removeField: function (fieldName, event) {
    event.preventDefault();
    this.props.removeField(fieldName);
  },

  handleChange: function (obj) {
    this.props.onChange(obj);
  },

  render: function () {
    var labelName = this.props.name.replace('_', ' ');
    var choices = this.props.choices;
    var that = this;
    return (
      <div className="form-group">
        <label
          htmlFor={this.props.name}
          className="col-sm-4 control-label">
            {this.props.isCustom ? (
              <i
                className='fa fa-minus-circle'
                title='Remove Field'
                onClick={this.removeField.bind(this, this.props.name)} />
            ) : null}
            {labelName}
        </label>
          <select className="col-sm-8" required={this.props.required} dafaultValue={Object.create(choices)[0]} onChange={this.handleChange}>
          <option
            className="form-control input-sm"
            id={that.props.name}
            onChange={that.handleChange}
            value=""
            key="n/a">
                Choose option
            </option>
          {Object.keys(choices).map(function(key){
            return (
              <option
                className="form-control input-sm"
                id={that.props.name}
                onChange={that.handleChange}
                value={key}
                key={choices[key]}>
                    {choices[key]}
                </option>
            )
          })}
          </select>

      </div>

    );
  }
});

module.exports = FieldChoices;
