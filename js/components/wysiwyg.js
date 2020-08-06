Fliplet.FormBuilder.field('wysiwyg', {
  name: 'Rich text',
  category: 'Text inputs',
  props: {
    placeholder: {
      type: String
    },
    rows: {
      type: Number,
      default: 5
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
  computed: {
    isInterface: function () {
      return Fliplet.Env.get('interface');
    }
  },
  watch: {
    value: function (val) {
      // This happens when the value is updated programmatically via the FormBuilder field().val() method
      val = _.isNumber(val) ? _.toString(val) : val;
      if (this.editor && val !== this.editor.getContent()) {
        return this.editor.setContent(val || '', { format : 'raw' });
      }

      if (val !== this.value) {
        this.value = val;
      }
    }
  },
  methods: {
    onReset: function () {
      if (this.editor) {
        try {
          return this.editor.setContent(this.value);
        } catch (e) {}
      }
    },
    placeholderLabel: function () {
      var placeholderText = this.editor.getElement().getAttribute("placeholder") || this.editor.settings.placeholder;
      var contentAreaContainer = this.editor.getContentAreaContainer();
      var defaultStyles = {
        style: {
          position: 'absolute',
          top: '17px',
          left: '8px',
          color: '#888',
          lineHeight: '19px',
          padding: tinyMCE.DOM.getStyle(contentAreaContainer, 'padding', true),
          width:'98%',
          overflow: 'hidden',
          'white-space': 'pre-wrap',
          'font-weight': 'normal',
          'font-size': '16px'
        }
      };
      var placeholderAttrs = this.editor.settings.placeholderAttrs || defaultStyles;

      tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative');

      // Create label element in the TinyMCE editor
      this.labelElement = tinymce.DOM.add(contentAreaContainer, this.editor.settings.placeholderTag || "p", placeholderAttrs, placeholderText);
    },
    hidePlaceholderLabel: function () {
      tinymce.DOM.setStyle(this.labelElement, 'display', 'none');
    },
    showPlaceholderLabel: function () {
      tinymce.DOM.setStyle(this.labelElement, 'display', '');
    },
    onPlaceholderFocus: function () {
      if (!this.editor.settings.readonly) {
        this.hidePlaceholderLabel();
      }

      this.editor.execCommand('mceFocus', false);
    },
    onPlaceholderBlur: function () {
      if (!this.editor.getContent()) {
        this.showPlaceholderLabel();
      } else {
        this.hidePlaceholderLabel();
      }
    },
    addPlaceholder: function () {
      // Init placeholder
      this.placeholderLabel();
      this.onPlaceholderBlur();

      // Add placeholder listeners
      tinymce.DOM.bind(this.labelElement, 'click', this.onPlaceholderFocus);
      this.editor.on('focus', this.onPlaceholderFocus);
      this.editor.on('blur', this.onPlaceholderBlur);
      this.editor.on('change', this.onPlaceholderBlur);
      this.editor.on('setContent', this.onPlaceholderBlur);
      this.editor.on('keydown', this.hidePlaceholderLabel);
    },
    addBulletedListShortcuts: function () {
      var $vm = this;

      // For Windows
      this.editor.addShortcut('ctrl+shift+8', 'UnorderedList', function() {
        $vm.editor.execCommand('InsertUnorderedList');
      });

      // For MacOS
      this.editor.addShortcut('command+[', 'UnorderedList', function() {
        $vm.editor.execCommand('InsertUnorderedList');
      });
    }
  },
  mounted: function () {
    if (this.source !== 'defaultSource') {
      this.setSourceValue({source: this.source, key: this.key});
    }

    var $vm = this;
    var lineHeight = 40;

    var config = {
      target: this.$refs.textarea,
      theme: 'modern',
      mobile: {
        theme: 'mobile',
        plugins: [ 'autosave', 'lists', 'autolink' ],
        toolbar: [ 'bold', 'italic', 'underline', 'bullist', 'numlist', 'removeformat' ]
      },
      plugins: [
        'advlist autolink lists link directionality',
        'autoresize fullscreen code paste'
      ].join(' '),
      toolbar: [
        'bold italic underline',
        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        'ltr rtl | link | removeformat code fullscreen'
      ].join(' | '),
      image_advtab: true,
      menubar: false,
      statusbar: false,
      inline: false,
      resize: false,
      autoresize_bottom_margin: 0,
      autoresize_max_height: lineHeight * this.rows,
      autoresize_min_height: lineHeight * this.rows,
      autofocus: false,
      branding: false,
      setup: function (editor) {
        $vm.editor = editor;

        editor.on('init', function () {
          $vm.addPlaceholder();
          $vm.addBulletedListShortcuts();

          // initialise value if it was set prior to initialisation
          if ($vm.value) {
            editor.setContent($vm.value, { format : 'raw' });
          }

          if ($vm.isInterface) {
            // iFrames don't work with the form builder's Sortable feature
            // Instead, the iFrame is swapped with a <div></div> of the same dimensions
            var $el = $($vm.$refs.ghost);
            $el.width(editor.iframeElement.style.width).height(editor.iframeElement.style.height);
            $(editor.iframeElement).replaceWith($el);
          }
        });

        editor.on('change', function (e) {
          $vm.value = editor.getContent();

          $vm.updateValue();
        });
      }
    };

    // Allow custom code to register hooks before this runs
    Fliplet().then(function () {
      Fliplet.Hooks.run('beforeRichFieldInitialize', {
        field: this,
        config: config
      }).then(function () {
        tinymce.init(config);
      });
    });

    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function () {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});