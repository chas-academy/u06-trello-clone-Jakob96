$( function() {
    $( ".card-layout, #tabs" ).tabs();

    $("#card-info").dialog({
      autoOpen: false,
      modal: true,
      resizable: false,
      draggable: false
    });

    $(".datepicker").datepicker();

    $("button.edit").on("click", function() {
      $('#card-info').dialog('open');
    });

    $( ".list" ).sortable({
      update: function(event, ui) {
        if ($("ul." + event.target.classList[1] + " li").length == 0) {
            addEmptyListText(this);
        }
        else {
            $("ul." + event.target.classList[1] + " li").remove(".empty-list");
        }
      },
        connectWith: ".list",
      }).disableSelection();

      function addEmptyListText(element) {
            const emptyListText = $("<li>").attr("class", "empty-list").html("Drag a card here");
            $(element).append(emptyListText);
      }
  } );