jQuery(document).ready(function(){

  // alert('hi');

  jQuery('.search-view').click(function(){
    // alert('hi');
    jQuery('.Grid-view-card').slideToggle();
    jQuery('.list-view-card').slideToggle();
  });

  jQuery('select').selectric();
});