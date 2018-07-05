jQuery(document).ready(function(){

  // Suchen page tab layout js
  jQuery('.layout-tabs li').click(function() {
    var target = "#" + this.getAttribute('data-target');
    jQuery('.layout-tabs li').removeClass('active');
    jQuery('.layout-view').removeClass('active');
    jQuery(this).addClass('active');
    jQuery('body').find(target).addClass('active');
  });

});