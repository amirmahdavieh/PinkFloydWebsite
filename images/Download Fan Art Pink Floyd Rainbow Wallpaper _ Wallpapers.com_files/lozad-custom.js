(function ($) {

    "use strict";
    jQuery(function($) {
        const observer = lozad(); // lazy loads elements with default selector as '.lozad'
        observer.observe();
    });

    window.addEventListener('load', function() {
        var observer = lozad();
        observer.observe();
    });
})(jQuery);