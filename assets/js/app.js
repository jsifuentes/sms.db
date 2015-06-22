/* app.js - from Project-Tyson. Modified */

var slideOpts = {
    sl:     ['slin',   'slout' ],    
    sr:     ['srin',   'srout' ],    
    popin:  ['popin',  'noanim'],    
    popout: ['noanim', 'popout'],    
};

var clearNode = function (node) {
    while(node.firstChild){
        node.removeChild(node.firstChild);
    }
};

var ScrollTop = function () {
    var el = this.parentNode.parentNode.childNodes[5].childNodes[1],
        offset = el.scrollTop,
        interval = setInterval(function() {
            el.scrollTop = offset;
            offset -= 24; 
            if (offset <= -24) {
                clearInterval(interval);
            }
        }, 8);
};

var TextboxResize = function (el) {
    el.unbind('click', ScrollTop, false);
    el.bind('click', ScrollTop, false);
    var leftbtn = el.parentNode.querySelectorAll('button.left')[0];
    var rightbtn = el.parentNode.querySelectorAll('button.right')[0];
    if (typeof leftbtn === 'undefined') {
        leftbtn = {
            offsetWidth: 0,
            className: ''
        };
    }
    if (typeof rightbtn === 'undefined') {
        rightbtn = {
            offsetWidth: 0,
            className: ''
        };
    }
    var margin = Math.max(leftbtn.offsetWidth, rightbtn.offsetWidth);
    el.style.marginLeft = margin + 'px';
    el.style.marginRight = margin + 'px';
    var tooLong = (el.offsetWidth < el.scrollWidth) ? true : false;
    if (tooLong) {
        if (leftbtn.offsetWidth < rightbtn.offsetWidth) {
            el.style.marginLeft = leftbtn.offsetWidth + 'px';
            el.style.textAlign = 'right';
        } else {
            el.style.marginRight = rightbtn.offsetWidth + 'px';
            el.style.textAlign = 'left';
        }
        tooLong = (el.offsetWidth<el.scrollWidth) ? true : false;
        if (tooLong) {
            if (new RegExp('arrow').test(leftbtn.className)) {
                clearNode(leftbtn.childNodes[1]);
                el.style.marginLeft = '26px';
            }
            if (new RegExp('arrow').test(rightbtn.className)) {
                clearNode(rightbtn.childNodes[1]);
                el.style.marginRight = '26px';
            }
        }
    }
};



var App = {
    init: function() {
        $('body').on('click', '.tab-switcher', function() {
            App.switchTab($(this).data('vin'), $(this).data('sd'), function() {
                console.log("switched to " + $(this).data('vin'))
            });
        });
    },

    switchTab: function(to, sd, callback) {
        var vIn = $('#'+to),
            vOut = $('section.active'),
            slideType = sd,
            onAnimationEnd = function () {
                vOut.addClass('hidden');
                vIn.addClass('active');
                vIn.removeClass(slideOpts[slideType][0]);
                vOut.removeClass(slideOpts[slideType][1]);
                vOut.unbind('webkitAnimationEnd', onAnimationEnd, false);
                vOut.unbind('animationend', onAnimationEnd);
            };
        vOut.bind('webkitAnimationEnd', onAnimationEnd, false);
        vOut.bind('animationend', onAnimationEnd);
        vOut.removeClass('active');
        vIn.removeClass('hidden');
        vIn.addClass(slideOpts[slideType][0]);
        vOut.addClass(slideOpts[slideType][1]);
        
        if (callback && typeof(callback) === 'function') {
            callback();
        }
    }
}

App.init();