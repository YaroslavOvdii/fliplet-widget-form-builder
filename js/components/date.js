var DATE_FORMAT = 'YYYY-MM-DD';

Fliplet.FormBuilder.field('date', {
  name: 'Date picker',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    description: {
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
  computed: {
    isWeb: function() {
      return Fliplet.Env.get('platform') === 'web'
    }
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
  mounted: function() {
    var $vm = this;

    if (this.source !== 'defaultSource') {
      this.setSourceValue({ source: this.source, key: this.key });
    }
    
    if (Fliplet.Env.get('platform') === 'web') {
      var $el = $(this.$el).find('input.date-picker').datepicker({
        format: "yyyy-mm-dd",
        todayHighlight: true,
        autoclose: true
      }).on('changeDate', function(e) {
        var value = moment(e.date).format(DATE_FORMAT);
        $vm.updateValue(value);
      });

      $el.datepicker('setDate', this.value || new Date());
    }

    if (!this.value) {
      // HTML5 date field wants YYYY-MM-DD format
      $vm.updateValue(moment().format('YYYY-MM-DD'));
    }
    $vm.$v.$reset();
  }
});
