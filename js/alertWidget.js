//A custom widget for displaying an alert message. Options for customizing the message, background, color and duration.

$( function () {
    $.widget( "custom.alert" , {            //Register widget with namespace custom
        options: {                          //Options to be used as defaults
            message: null,
            background: "blue",
            color: "#fff",
            duration: 5000
        },

        _create: function () {      //Automatically called during init
            this.element.css({ "display": "none", "background": this.options.background, "color": this.options.color, "padding": "10px", "border-radius": "5px", "width": "22%", "text-align": "center", "position": "absolute", "top": "10px", "right": "30px" });
            this.element.html(this.options.message);
        },
        destroy: function () {      //Called when object is destroyed
            $.Widget.prototype.destroy.call(this);
        },

        open: function ( event ) {  //A method to show and hide the alert with two effects
            this.element.fadeIn().delay(this.options.duration).fadeOut();
        }
    });
});