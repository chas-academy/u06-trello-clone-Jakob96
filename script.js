$( function() {
    $( ".card-layout" ).tabs();

    $( ".list" ).sortable({
        connectWith: ".list",
      }).disableSelection();
  } );