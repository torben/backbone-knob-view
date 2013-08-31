var template = '<div class="switch right">'+
'  <div class="shadow on"></div>'+
'  <div class="border">'+
'    <!-- assign class (toggle-on / toggle-off class) to knob to toggle -->'+
'    <div class="knob <%= cssClass %>">'+
'      <div class="trigger">'+
'        <div class="inner trigger"></div>'+
'      </div>'+
'    </div>'+
'    <div class="labels">'+
'      <label class="<%= onClass %>"><%= onLabel %></label><label class="<%= offClass %>"><%= offLabel %></label>'+
'    </div>'+
'  </div>'+
'</div>';

var KnobView = Backbone.View.extend({
  template: _.template(template),
  delegate: null,
  events: {
    "click": "toggleState"
  },

  initialize: function(options) {
    if (options == null) {
      options = {};
    }

    _.bindAll(this, 'toggleState', 'setState', 'setDisable');
    this.model = new Backbone.Model({
      active:   options.active != null ? options.active : false,
      disable:  options.disable != null ? options.disable : false,
      onLabel:  options.onLabel || "On",
      offLabel: options.offLabel || "Off",
      onClass:  options.onClass || "on",
      offClass: options.offClass || "off"
    });

    this.model.on("change:active", this.setState);
    this.model.on("change:disable", this.setDisable);
    if (options.delegate != null) {
      this.delegate = options.delegate;
    }
  },


  // Delegates to Model
  set: function(attributes, options) {
    if (options == null) {
      options = {};
    }
    return this.model.set(attributes, options)
  },


  get: function(attribute) {
    return this.model.get(attribute)
  },


  setState: function() {
    if (this.model.get("active") === true) {
      this.$(".knob").removeClass("toggle-off").addClass("toggle-on");
    } else {
      this.$(".knob").removeClass("toggle-on").addClass("toggle-off");
    }

    this.trigger("change", this.model);
  },


  toggleState: function(e) {
    if (this.model.get("disable") === true) {
      return false;
    }

    this.model.set("active", !this.model.get("active"));
    if (this.delegate) {
      this.delegate.trigger("clickKnob", this, e);
    }

    return false;
  },


  setDisable: function() {
    if (this.model.get("disable") === true) {
      this.$(".switch").addClass("disabled");
    } else {
      this.$(".switch").removeClass("disabled");
    }
  },


  render: function() {
    json = this.model.toJSON();
    json['cssClass'] = this.model.get("active") === true ? "toggle-on" : "toggle-off";

    this.$el.html(this.template(json));

    return this;
  }
});
