Fliplet.FormBuilder.field('url', {
  name: 'URL input',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    }
  },
  validations: function () {
    var rules = {
      value: {
        // URL regex taken form https://www.regextester.com/94502 and added % sign
        url: window.validators.helpers.regex('', /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@%!\$&'\*\+,;=.]+$/i)
      }
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
