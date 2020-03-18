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
    onReset: function() {
      if (this.editor) {
        try {
          this.editor.setContent('');
        } catch (e) {}
      }

      this.value = '';
    },
    placeholderLabel: function() {
      var placeholder_text = this.editor.getElement().getAttribute("placeholder") || this.editor.settings.placeholder;
      var placeholder_attrs = this.editor.settings.placeholder_attrs || {style: {position: 'absolute', top:'5px', left:0, color: '#888', padding: '1%', width:'98%', overflow: 'hidden', 'white-space': 'pre-wrap'} };
      var contentAreaContainer = this.editor.getContentAreaContainer();

      tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative');

      // Create label element in the TinyMCE editor
      this.labelElement = tinymce.DOM.add( contentAreaContainer, this.editor.settings.placeholder_tag || "label", placeholder_attrs, placeholder_text );
    },
    placeholderLabelHide: function() {
      tinymce.DOM.setStyle( this.labelElement, 'display', 'none' );
    },
    placeholderLabelShow: function() {
      tinymce.DOM.setStyle( this.labelElement, 'display', '' );
    },
    placeholderOnFocus: function() {
      if (!this.editor.settings.readonly) {
        this.placeholderLabelHide();
      }

      this.editor.execCommand('mceFocus', false);
    },
    placeholderOnBlur: function() {
      if (!this.editor.getContent()) {
        this.placeholderLabelShow();
      } else {
        this.placeholderLabelHide();
      }
    },
    addPlaceHolder: function() {
      // Init placeholder
      this.placeholderLabel();
      this.placeholderOnBlur();

      // Add placeholder listeners
      tinymce.DOM.bind(this.labelElement, 'click', this.placeholderOnFocus);
      this.editor.on('focus', this.placeholderOnFocus);
      this.editor.on('blur', this.placeholderOnBlur);
      this.editor.on('change', this.placeholderOnBlur);
      this.editor.on('setContent', this.placeholderOnBlur);
      this.editor.on('keydown', this.placeholderLabelHide);
    }
  },
  mounted: function() {
    var $vm = this;
    var lineHeight = 40;

    tinymce.init({
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
          $vm.addPlaceHolder();

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

        editor.on('change', function(e) {
          $vm.value = editor.getContent();

          $vm.updateValue();
        });

        editor.on('reset', function(e) {
          // Stops tinymce events that are returning the old value
          // Solution for this issue https://github.com/Fliplet/fliplet-studio/issues/5514
          e.preventDefault();
          e.stopPropagation();
          return false;
        });

        // When selectionchange or init happened check if placeholder should show or hide
        editor.on('selectionchange init', function() {
          var element = editor.settings.inline ? editor.getElement() : editor.contentAreaContainer;

          if (editor.getContent().trim() === '') {
            element.classList.add('empty');
          } else {
            element.classList.remove('empty');
          }
        });
      }
    });

    Fliplet.FormBuilder.on('reset', this.onReset);
  },
  destroyed: function() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    Fliplet.FormBuilder.off('reset', this.onReset);
  }
});