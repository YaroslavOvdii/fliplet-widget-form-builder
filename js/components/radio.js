Fliplet.FormBuilder.field('radio', {
  name: 'Radios (single-select)',
  category: 'Multiple options',
  props: {
    description: {
      type: String
    },
    options: {
      type: Array,
      default: [
        {
          label: 'Option 1'
        },
        {
          label: 'Option 2'
        }
      ]
    }
  },
  validations: function() {
    var rules = {
      value: {}
    };

    if (this.required) {
      rules.value.required = window.validators.required;
    }
    return rules;
  },
  methods: {
    clickHandler: function (option) {
      this.value = option.id || option.label;
      this.updateValue();
    }
  },
  mounted: function () {
    if (this.source !== 'defaultSource') {
      this.setSourceValue({ source: this.source, key: this.key });
    }
  }
});
