Fliplet.FormBuilder.field('input', {
  name: 'Text input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    }
  },
  validations: function () {
    var rules = {
      value: {}
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }
    return rules;
  },
  mounted: function () {
    if (this.source !== 'defaultSource') {
      this.setSourceValue({source: this.source, key: this.key});
    }
  }
});
