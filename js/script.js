$( function() {
    addColumn("Todo");
    addColumn("Doing");
    addColumn("Done");

    addCard("Test", "Todo");
    addCard("Test", "Todo");
    addCard("Test", "Todo");

    $( ".card-layout, #tabs" ).tabs();

    $("#card-info").dialog({
      autoOpen: false,
      modal: true,
      resizable: false,
      draggable: false,
      show: { effect: "fade", duration: 250 },
      hide: { effect: "fade", duration: 250 }
    });

    $(".datepicker").datepicker();

    $("button.edit, .card").on("click", function() {
      $('#card-info').dialog('open').effect("bounce", {times: 2}, 250);
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
        cancel: ".empty-list"
      }).disableSelection();

      function addEmptyListText(element) {
            const emptyListText = $("<li>").attr("class", "empty-list").html("Drag a card here");
            $(element).append(emptyListText);
      }

      function addColumn(title) {
          const section = $("<section>").attr("class", "card-layout");
          const tab = $("<ul>").append("<li>").html(title);
          const emptyListText = $("<li>").attr("class", "empty-list").html("Drag a card here");
          const cardList = $("<ul>").attr("class", "list " + title.toLowerCase()).append(emptyListText);
      
          const col = section.append(tab).append(cardList);
          $("section.flex-grid").append(col);
      }

      function addCard(title, col) {
        const editBtn = $("<button>").attr("class", "edit").html("Edit");
        const card = $("<li>").attr("class", "ui-state-default card").html(title).append(editBtn);
        $(document).find("ul." + col.toLowerCase()).append(card);
      }
  } );