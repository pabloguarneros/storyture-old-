$(document).ready(function () {
    $(".tippy_tooltup.tomato-theme").css("background-color","tomato");
    tippy('#game_tp', {
        content: 'Login to Access!',
        touch: ['hold', 500],
      });
      tippy('#home_tp', {
        content: 'Home',
        touch: ['hold', 500],
        theme:'tomato',
      });
      tippy('#notification_tp',{
        content: 'News Feed',
        touch: ['hold', 500],
      });
      tippy('#profile_tp', {
        content: 'My Profile',
        touch: ['hold', 500],
        theme:'tomato',
      });
      tippy('#market_tp', {
        content: 'Tribes',
        touch: ['hold', 500],
      });
      tippy('#search_tp', {
        content: 'Search',
        touch: ['hold', 500],
      });
      tippy('#xp_tp',{
        content: 'Earn XP',
        touch: ['hold', 500],
      });
      $(".tippy_tooltup.tomato-theme").css("background-color","tomato");
    })
      