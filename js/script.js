$( function() {
    addColumn("Todo");
    addColumn("Doing");
    addColumn("Done");

    addCard("Test", "Todo");
    addCard("Test", "Todo");
    addCard("Test", "Todo");

   $( "#tabs" ).tabs();

    $("#card-info").dialog({
      autoOpen: false,
      modal: true,
      resizable: false,
      draggable: false,
      show: { effect: "fade", duration: 250 },
      hide: { effect: "fade", duration: 250 }
    });

    $(".datepicker").datepicker();

    $(document).on("click", "button.edit, .card", function() {
      $('#card-info').dialog('open').effect("bounce", {times: 2}, 250);
    });

    $(document).on("click", "button.new-card", function() {
      addCard("Write some text...", $(this).attr("data-list"));
    });

    $("button.add-col").on("click", function() {
      const title = prompt("Enter title");
      
      if (title) {
        addColumn(title);
      }
    });

      function addEmptyListText(element) {
            const emptyListText = $("<li>").attr("class", "empty-list").html("Drag a card here");
            $(element).append(emptyListText);
      }

      function addColumn(title) {
          const section = $("<section>").attr("class", "card-layout");
          const newCardBtn = $("<button>").attr({"class": "new-card float-right", "aria-label": "Add new card", "data-list": title.toLowerCase().replace(" ", "")}).html("+");
          const tab = $("<ul>").append("<li>").html(title).append(newCardBtn);
          const emptyListText = $("<li>").attr("class", "empty-list").html("Drag a card here");
          const cardList = $("<ul>").attr("class", "list " + title.toLowerCase().replace(" ", "")).append(emptyListText);
      
          const col = section.append(tab).append(cardList);
          $("section.flex-grid").append(col);

          $( ".card-layout" ).tabs();

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
      }

      function addCard(title, col) {
        const editBtn = $("<button>").attr("class", "edit float-right").html("Edit");
        const card = $("<li>").attr("class", "ui-state-default card").html(title).append(editBtn);
        $(document).find("ul." + col.toLowerCase().replace(" ", "")).append(card);
       
        $(document).find("ul." + col.toLowerCase().replace(" ", "") + " li.empty-list").remove();
      }
  } );