$( function() {
  let columns = [];
  let cards = [];

    if (localStorage.getItem("columns")) {
      localStorage.getItem("columns").split(",").forEach((item) => {
        addColumn(item);
      })
    }
    else {
      const defaultCols = ["Todo", "Doing", "Done"];
      defaultCols.forEach((item) => addColumn(item));
    }

    if (localStorage.getItem("cards")) {
      let savedCards = JSON.parse(localStorage.getItem("cards"));
      savedCards.forEach((card) => addCard(card.id, card.description, card.date, card.list));
    }

   $( "#tabs" ).tabs();

   $("#alert").alert({ message: "Your changes has been saved!" });

    $("#card-info").dialog({
      autoOpen: false,
      modal: true,
      resizable: false,
      draggable: false,
      show: { effect: "fade", duration: 250 },
      hide: { effect: "fade", duration: 250 },
      close: function() {
        location.reload();
      }
    });

    $(".datepicker").datepicker({
      dateFormat: "yy-mm-dd",
      defaultDate: Date.now()
    });

    $("#description, .datepicker").on("change", function() {
        updateCard($("input[name='cardid']").attr("value"), "description", $("#description").val());
        updateCard($("input[name='cardid']").attr("value"), "date", $(".datepicker").val());

        $("#alert").alert(('open'));
    });

    $("button#formClose").on("click", function() {
        $("#card-info").dialog("close");
    });

    $(document).on("click", "button.edit, .card", function(e) {
      let cardId = "";
      $('#card-info').dialog('open').fadeIn();
      //Check if user clicked on edit button or card
      if ($(e.target).attr("class").toString().includes("edit")) {
        cardId = $(e.target).attr("value");
      }
      else
      {
        cardId = $(this).attr("id");
      }

      let card = getCard(cardId);

      $("input[name='cardid']").attr("value", card.id);
      $("#card-info #description").html(card.description);
  
      $(".datepicker").datepicker("setDate", new Date(card.date));
    });

    $(document).on("click", "button.new-card", function() {
      const dateNow = new Date();
      const date = dateNow.getFullYear().toString() + "-" + (dateNow.getMonth() +1).toString() + "-" + dateNow.getDate().toString();

      addCard("card" + Math.floor(Math.random() * Date.now()), "Write some text...", date, $(this).attr("data-list"));
      localStorage.setItem("cards", JSON.stringify(cards));
    });

    $(document).on("click", "button.delete", function() {
      const result = confirm("Are you sure?");

      if (result) {
        removeCard(this.value);
      }
      else {
        return false;
      }
    });

    $("button.add-col").on("click", function() {
      const title = prompt("Enter title");
      
      if (title) {
        addColumn(title);
        localStorage.setItem("columns", columns.join(","));
      }
    });

      function addEmptyListText(element) {
            const emptyListText = $("<li>").attr("class", "empty-list").html("Drag a card here");
            $(element).append(emptyListText);
      }

      function addColumn(title) {
          columns.push(title);

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
              updateCard($(ui.item).attr("id"), "list", event.target.classList[1]);

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

      function addCard(id, title, date, col) {
        const cardData = {
          id: id,
          description: title,
          date: date,
          list: col
        }

        cards.push(cardData);

        const editBtn = $("<button>").attr({"class": "edit float-right", "value": id}).html("Edit");
        const deleteBtn = $("<button>").attr({"class": "delete float-right", "value": id}).html("Delete");
        const card = $("<li>").attr({"id": id, "class": "ui-state-default card"}).html(title).append(deleteBtn, editBtn);
        $(document).find("ul." + col.toLowerCase().replace(" ", "")).append(card);
       
        $(document).find("ul." + col.toLowerCase().replace(" ", "") + " li.empty-list").remove();
      }

      function removeCard(id) {
        $("#" + id).remove();

        for (let i in cards) {
          if (cards[i].id == id) {
            cards.splice(i, 1);
            break;
          }
        }

        localStorage.setItem("cards", JSON.stringify(cards));
         window.location.reload();
      }

      function updateCard(id, property, value) {
        for (let i in cards) {
          if (cards[i].id == id) {
            cards[i][property] = value;
            break;
          }
        }
       
        localStorage.setItem("cards", JSON.stringify(cards));
      };
      
      function getCard(id) {
        for (let i in cards) {
          if (cards[i].id == id) {
            return cards[i];
          }
        }
      }
});
