Fliplet.FormBuilder.field('select', {
  name: 'Dropdown (single-select)',
  category: 'Multiple options',
  props: {
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
    },
    source: {
      type: String
    },
    placeholder: {
      type: String,
      default: '-- Select one'
    },
    description: {
      type: String
    }
  },
  mounted: function() {
    var $vm = this;

    if (this.source !== 'defaultSource') {
      this.setSourceValue({ source: this.source, key: this.key });
    }
    
    if ($vm.source === 'dataSources') {
      Fliplet.DataSources.get().then(function(dataSources) {
        $vm.options = dataSources;
      })
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
  }
});
