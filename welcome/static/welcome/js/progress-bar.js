$(document).ready(function () {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    scrollProgressBar_mob();
    $(".notification_tp").on("click",function(){
      $("#tt_mob").removeClass("nav_top").addClass("nav_down");
      $("#notification").removeClass("n_nav_top").addClass("n_nav_down");
    });
  } else {
    scrollProgressBar();
  };
});

function scrollProgressBar() {
  var getMax = function () {
    return $(document).height() - $(window).height();
  };

  var getValue = function () {
    return $(window).scrollTop();
  };

  // declaring variables!
  var progressBar = $(".progress-bar"),
    max = getMax(),
    value,
    width;

  var getWidth = function () {
    // Calculate width in percentage
    value = getValue();
    width = (value / max) * 100;
    width = width + "%";
    return width;
  };

  // how you set in .css WOWOW
  var setWidth = function () {
    progressBar.css({ width: getWidth() });
  };

  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $("#header").outerHeight();
  // if you scroll down
  $(window).scroll(function(event){
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 350);
  
  function hasScrolled() {
    setWidth();
    var st = $(this).scrollTop();
    if (Math.abs(lastScrollTop - st) <= delta)
        return;
    // If current position > last position AND scrolled past navbar...
    if (st > lastScrollTop && st > navbarHeight){ 
      // Scroll Down
      $("#header").removeClass("nav_down").addClass("nav_top");
      $("#notification").removeClass("n_nav_down").addClass("n_nav_top");
      
      
    } else {
      // Scroll Up
      // If did not scroll past the document (possible on mac)...
      if(st + $(window).height() < $(document).height()) { 
        $("#header").removeClass("nav_top").addClass("nav_down");
        $("#notification").removeClass("n_nav_top").addClass("n_nav_down");
        
      }
    }  
    lastScrollTop = st;

  }

  // if you move the size of page, get a new max, then set new width
  $(window).on("resize", function () {
    // Need to reset max
    max = getMax();
    setWidth();
  });
}

function scrollProgressBar_mob() {

  var getMax = function () {
    return $(document).height() - $(window).height();
  };

  var getValue = function () {
    return $(window).scrollTop();
  };

  // declaring variables!
  var progressBar = $(".progress-bar"),
    max = getMax(),
    value,
    width;

  var getWidth = function () {
    // Calculate width in percentage
    value = getValue();
    width = (value / max) * 100;
    width = width + "%";
    return width;
  };

  // how you set in .css WOWOW
  var setWidth = function () {
    progressBar.css({ width: getWidth() });
  };

  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $("#tt_mob").outerHeight();
  // if you scroll down
  $(window).scroll(function(event){
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 350);
  
  function hasScrolled() {
    setWidth();
    var st = $(this).scrollTop();
    if (Math.abs(lastScrollTop - st) <= delta)
        return;
    // If current position > last position AND scrolled past navbar...
    if (st > lastScrollTop && st > navbarHeight){ 
      // Scroll Down
      $("#tt_mob").removeClass("nav_down").addClass("nav_top");
      $("#notification").removeClass("n_nav_down").addClass("n_nav_top");

      
      
    } else {
      // Scroll Up
      // If did not scroll past the document (possible on mac)...
      if(st + $(window).height() < $(document).height()) { 
        $("#tt_mob").removeClass("nav_top").addClass("nav_down");
        $("#notification").removeClass("n_nav_top").addClass("n_nav_down");
      }
    }  
    lastScrollTop = st;

  }

  // if you move the size of page, get a new max, then set new width
  $(window).on("resize", function () {
    // Need to reset max
    max = getMax();
    setWidth();
  });
}
