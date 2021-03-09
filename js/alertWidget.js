$( function () {
    $.widget( "custom.alert" , {

        //Options to be used as defaults
        options: {
            message: null,
            background: "blue",
            color: "#fff",
            duration: 5000
        },

        _create: function () {
            this.element.css({ "display": "none", "background": this.options.background, "color": this.options.color, "padding": "10px", "border-radius": "5px", "width": "22%", "text-align": "center", "position": "absolute", "top": "10px", "right": "30px" });
            this.element.html(this.options.message);
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },

        open: function ( event ) {
          this.element.fadeIn().delay(this.options.duration).fadeOut();
        }
    });
});