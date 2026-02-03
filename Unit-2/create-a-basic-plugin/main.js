$(document).ready(function() {
    
    (function ( $ ) {
 
        $.fn.greenify = function( options ) {
    
            // This is the easiest way to have default options.
            var settings = $.extend({
                // These are the defaults.
                color: "#556b2f",
                backgroundColor: "white"
            }, options );
    
            // Greenify the collection based on the settings variable.
            return this.css({
                color: settings.color,
                backgroundColor: settings.backgroundColor
            });
    
        };
    
    }( jQuery ));


    (function( $ ) {
    
        $.fn.showLinkLocation = function() {
    
            this.filter( "a" ).append(function() {
                return " (" + this.href + ")";
            });
    
            return this;
    
        };
    
    }( jQuery ));

    // (function( $ ) {
 
    //     $.fn.popup = function( action ) {
    
    //         if ( action === "open") {
    //             // Open popup code.
    //             $(document).alert("this is a popup");
    //         }
    
    //         if ( action === "close" ) {
    //             // Close popup code.
    //         }
    
    //     };
    
    // }( jQuery ));
    
    // $( "a" ).greenify().addClass( "greenified" );
    $( "div" ).greenify({
        color: "orange"
    });

    // Usage example:
    $( "a" ).showLinkLocation();
});