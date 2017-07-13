(function () {

  // Localize jQuery variable
  var jQuery;

  function initSlider(widget) {
    var $ = jQuery;
    $(window).bind('resize', function () {
      setSizes();
    });

    var prismContainer = widget;
    var interval = prismContainer.data('options').positionInterval || 5;
    var prismTimer;

    function setTimer() {
      clearInterval(prismTimer);
      prismTimer = setInterval(moveRight, interval * 1000);
      return prismTimer;
    }

    setTimer();

    var slider = $('.prism-connect .slider-list');
    var sliderContainer = $('.prism-connect .slider-list > ul');
    var sliderItem = $('.prism-connect .slider-list > ul > li');

    var slideCount = 0;
    var slideItem = 1;
    var slideWidth;
    var slideHeight;
    var sliderUlWidth;

    var setSizes;
    setSizes = function () {

      slideCount = sliderItem.length;
      slideWidth = $('.prism-connect').width() - 26;
      slideHeight = sliderItem.height();
      sliderUlWidth = slideCount * slideWidth;

      sliderItem.css({width: slideWidth});
      slider.css({width: slideWidth});
      sliderContainer.css({width: sliderUlWidth, marginLeft: -slideWidth});
    };

    setSizes();

    $('.prism-connect .slider-list >  ul > li:last-child').prependTo(sliderContainer);

    function moveLeft() {
      sliderContainer.animate({left: +slideWidth}, 400,
        function () {
          $('.prism-connect .slider-list >  ul > li:last-child').prependTo(sliderContainer);
          sliderContainer.css('left', '');
        });
      slideItem = slideItem - 1;
      displayPositionNumber(slideItem);
    }

    function moveRight() {
      sliderContainer.animate({left: -slideWidth}, 400,
        function () {
          $('.prism-connect .slider-list >  ul > li:first-child').appendTo(sliderContainer);
          sliderContainer.css('left', '');
        });
      slideItem = slideItem + 1;
      displayPositionNumber(slideItem);
    }

    prismContainer.find('a.control_prev').click(function () {
      moveLeft();
      setTimer();
    });

    prismContainer.find('a.control_next').click(function () {
      moveRight();
      setTimer();
    });


    prismContainer.find('.position-total').html(slideCount);

    function displayPositionNumber(value) {
      if (value > slideCount) {
        value = 1;
        slideItem = 1;
      } else if (value === 0) {
        value = slideCount;
        slideItem = slideCount;
      }

      prismContainer.find('.position-number').html(value);
    }

    displayPositionNumber(slideItem);
  }

  function main() {
    jQuery(document).ready(function ($) {
      var tempA = document.createElement('a');
      tempA.href = $('#alumeni-prism-widgets').attr('src');
      var appUrl = tempA.protocol + '//' + tempA.hostname + (tempA.port ? ':' + tempA.port : '');

      // load CSS
      var css_link = $('<link>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: appUrl + '/assets/widgets.css'
      });
      css_link.appendTo('head');

      $.fn.prismInitializeWidget = function () {
        debugger;
        return this.each(function () {
          var element = $(this);
           // KUBA, The elemet here is the whole screen, I don;t really know what you wan tot achive here
          element.removeAttr('prism-widget');
          element.removeAttr('data-prism-widget');
          var resource = element.attr('data-resource').split('#');
          var options = encodeURIComponent(element.attr('data-options') || '{}');
          var jsonpUrl = appUrl + '/api/{scope}/{id}/badge?callback=?&options={options}'
              .replace('{scope}', resource[0] + 's').replace('{id}', resource[1]).replace('{options}', options);
          $.ajax({
            url: jsonpUrl,
            jsonp: 'callback',
            dataType: 'jsonp'
          })
            .then(function (data) {
              element.html(data);
              var prismListContainer = element.find('.opportunities');

              function containerSize() {
                if (prismListContainer.width() < 250) {
                  prismListContainer.addClass('small');
                } else if (prismListContainer.width() > 250 && prismListContainer.width() < 450) {
                  prismListContainer.addClass('medium');
                } else if (prismListContainer.width() > 450) {
                  prismListContainer.removeClass('medium');
                  prismListContainer.removeClass('small');
                }
              }

              if (prismListContainer.is(':visible')) {
                containerSize();
              }
              // Determine the size of the box to change the classes
              $(window).bind('resize', function () {
                containerSize();
              });
              if (element.find('.slider-list').length > 0) {
                initSlider(element);
              }
            });

        });
      };

      // load and display all snippets
      $('div[data-prism-widget="badge"]').prismInitializeWidget();

    });
  }

  // Called once jQuery has been loaded
  function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    window.alumeniPrismJQuery = jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main();
  }

  // Load jQuery if not present
  if (window.jQuery === undefined || window.jQuery.fn.jquery.indexOf('3.2.') !== 0) {
    var script_tag = document.createElement('script');
    script_tag.setAttribute('type', 'text/javascript');
    script_tag.setAttribute('src', 'https://code.jquery.com/jquery-3.2.1.min.js');
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
        if (this.readyState === 'complete' || this.readyState === 'loaded') {
          scriptLoadHandler();
        }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script_tag);
  } else {
    // The jQuery version on the window is the one we want to use
    window.alumeniPrismJQuery = jQuery = window.jQuery;
    main();
  }

})();
