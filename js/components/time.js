Fliplet.FormBuilder.field('time', {
  name: 'Time picker',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
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
    updateValue: function(value) {
      if (value) {
        this.value = value;
      }

      this.highlightError();
      this.$emit('_input', this.name, this.value);
    }
  },
  beforeUpdate: function() {
    /**
     * if the passed time is in the HH:mm A format,
     * that means that this must be an old record saved, 
     * so we need to re-format it to the correct format which is accepted by the native html5 time input,
     * which is HH:mm
     */
    if (moment(this.value, 'HH:mm A', true).isValid()){
      this.value = moment(this.value, 'HH:mm A').format('HH:mm');
    }
  },
  mounted: function() {
    var $vm = this;

    if (this.source !== 'defaultSource') {
      this.setSourceValue({source: this.source, key: this.key});
    }

    if (!this.value) {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();

      if(hours < 10) {
        hours = '0' + hours;
      }

      if(minutes < 10) {
        minutes = '0' + minutes;
      }

      this.updateValue(hours + ':' + minutes);
    }
    $vm.$v.$reset();
  }
});
