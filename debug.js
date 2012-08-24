/**
 * Debug tools,
 *
 * WORK IN PROGRESS.
 *
 * @TODO
 *  Move from an anonymous function to a named function.
 *  Implement grid functionality.
 */ 
$(function () {
  // Default options.
  var options = {
    // Show screen resolution.
    responsiveKey:  '1',
    // Show regions sizes.
    elementSizeKey: '2',
    cookiePrefix:   'debug',
    // Elements, that have children you need to measure.
    regionElements: [
      '#main', 
      'header[role="banner"] > .pane-pane-header', 
      '#node-wrapper'
    ]
  };

  var overlayOn = false,
      responsiveOn = false,
      regionElementsOn = false;

  // Keyboard controls
  $(document).bind('keydown', keydownHandler);
  $(document).bind('keyup', keyupHandler);
  
  /**
   * Actions.
   */
  var actions = {
    showResponsiveData: function () {
      // Store window width.
      var w = $(window).width();
      var h = $(window).height();

      // Assign minimal output UI.
      var div = $('<div id="responsive-size-info" />').appendTo('body');
      var icon = $('<span id="responsive-size-info-ico" />').appendTo(div);
      var h1 = $('<h1 />').text(w + ' x ' + h + ' px').appendTo(div);

      $(window).resize(function () {
        var w = $(window).width();
        var h = $(window).height();

        $(h1).text(w + ' x ' + h + 'px');
      });
    },
    hideResponsiveData: function () {
      $('#responsive-size-info').remove();
    },
    showElementSize: function () {
      var elements = options.regionElements.join(', ');
      
      $(elements).each(function () {
        var children = $(this).children();
        
        $.each(children, function () {
          // Current region width.
          var w = $(this).width();
          
          // Element to hold width value.
          var container = $('<div class="ui-tools element" />')
          
          // Update region width.
          $(container).html('<em>Width</em> ' + w + ' px');
          
          // Make positioning possible.
          $(this).css('position', 'relative');
          
          $(container).prependTo($(this));
          
          $(window).resize(function () {            
            $.each(children, function () {
              var w = $(this).width();
              
               $(this).find('.ui-tools.element').html('<em>Width</em> ' + w + ' px');
            });
          });
        });
      });
    },
    hideElementSize: function () {
      $('body').find('.ui-tools.element').detach();
    }
  }
  
  // Check cookie saved state.
  var cookie = readCookie(options.cookiePrefix);
  
  if (typeof cookie == 'string') {
    var state = cookie.split(',');
    
    // showElementSize.
    if (state[0] == 1) {
      actions.showElementSize();
      regionElementsOn = true;
    }
    // showResponsiveData.
    if (state[1] == 1) {
      actions.showResponsiveData();
      responsiveOn = true;
    }
  }
  
  function getModifier(e) {
    if (options.modifierKey == null) return true; // Bypass by default.
     var m = true;
     switch (options.modifierKey) {
       case 'ctrl':
         m = (e.ctrlKey ? e.ctrlKey : false);
         break;
       case 'alt':
         m = (e.altKey ? e.altKey : false);
         break;
       case 'shift':
         m = (e.shiftKey ? e.shiftKey : false);
         break;
     }
     return m;
  }

  function getKey(e) {
    var k = false, c = (e.keyCode ? e.keyCode : e.which);
    // Handle keywords
    if (c == 13) k = 'enter';
    // Handle letters
    else k = String.fromCharCode(c).toLowerCase();
    return k;
  }
  
  /**
   * Event handlers
   */
  function keydownHandler(e) {
    // Get origin of keydown. Body? Input field?
    var source = e.target.tagName.toLowerCase();

    // Escape if we're in a form.
    if ((source == 'input') || (source == 'textarea') || (source == 'select')) return true;

    var m = getModifier(e);
    if (!m) return true;

    // Get pressed key.
    var k = getKey(e);
    if (!k) return true;

    switch (k) {
      case options.responsiveKey:
        if (!responsiveOn) {
          actions.showResponsiveData();
          responsiveOn = true;
          // Save the state to a cookie.
          saveState();
        } 
        else {
          actions.hideResponsiveData();
          responsiveOn = false;
          saveState();
        }
        break;
      case options.elementSizeKey:
        if (!regionElementsOn) {
          actions.showElementSize();          
          regionElementsOn = true;
          saveState();
        }
        else {
          actions.hideElementSize();
          regionElementsOn = false;
          saveState();
        }
        
        break;
    }
  }

  function keyupHandler(e) {
    var m = getModifier(e);
    if (!m) return true;
    var k = getKey(e);
    if (!k) return true;
  }
  
  /**
   * Save a cookie with the current state.
   */
  function saveState() {
    createCookie(options.cookiePrefix, (regionElementsOn ? '1' : '0') + ',' + (responsiveOn ? '1' : '0'), 1);
  }
    
   /**
   * Cookie functions.
   *
   * By Peter-Paul Koch:
   * http://www.quirksmode.org/js/cookies.html
   */
  function createCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = '; expires='+date.toGMTString();
    }
    else var expires = '';
    
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    createCookie(name,"",-1);
  }
});
