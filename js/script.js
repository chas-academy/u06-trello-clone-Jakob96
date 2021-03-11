$( function() {
  //Arrays to store data during runtime
  const columns = [];
  const cards = [];

  //Get erlier stored columns from local storage or add default cols
    if (localStorage.getItem("columns")) {
      localStorage.getItem("columns").split(",").forEach((item) => {
        addColumn(item);
      })
    }
    else {
      const defaultCols = ["Todo", "Doing", "Done"];
      defaultCols.forEach((item) => addColumn(item));
    }

  //Get erlier stored cards from local storage and add them
    if (localStorage.getItem("cards")) {
      const savedCards = JSON.parse(localStorage.getItem("cards"));
      savedCards.forEach((card) => addCard(card.id, card.description, card.date, card.list, card.color, card.archived));
    }

  //Init Jquery elements
   $( ".tabs" ).tabs();

//My custom widget
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

    //Jquery event handlers

    //Elements in dialog
    $("#description, .datepicker").on("change", function() {
        updateCard($("input[name='cardid']").attr("value"), "description", $("#description").val());
        updateCard($("input[name='cardid']").attr("value"), "date", $(".datepicker").val());

        $("#alert").alert(('open'));
    });

    $("#color").on("change", function() {
        const cardId = $("#tabs-1 input[name='cardid']").attr("value");
        
        updateCard(cardId, "color", this.value);
        $("#" + cardId).css({ "background": this.value});
        $("#alert").alert(('open'));
    });

    $("button#formClose").on("click", function() {
      $("#card-info").dialog("close");
  });

    //Event handlers on dynamic generated elements had to be attached to document object to work
    $(document).on("click", "button.remove-col", function() {
      const colTitle = $(this).attr("data-list");
      const result = confirm("Are you sure you want to remove the list?");
      
      if (result) {
        removeColumn(colTitle);
      }
      else {
        return false;
      }
    });

    //Edit card
    $(document).on("click", "button.edit, .card", function(e) {
      let cardId = "";
      $('#card-info').dialog('open').fadeIn();
     
      //Check if user clicked on edit button or on card directly
      if ($(e.currentTarget).attr("class").toString().includes("edit")) {
        cardId = $(e.currentTarget).attr("value");
      }
      else
      {
        cardId = $(this).attr("id");
      }

      //Get selected card and display data in form
      let card = getCard(cardId);

      $("input[name='cardid']").attr("value", card.id);
      $("#card-info #description").html(card.description);
  
      $(".datepicker").datepicker("setDate", new Date(card.date));

      $("#color").attr("value", card.color);
    });

    //Create card
    $(document).on("click", "button.new-card", function() {
      //Add some default data (Current date, text content, list and color)
      const date = new Date();

      addCard("card" + Math.floor(Math.random() * Date.now()), "Write text here", date, $(this).attr("data-list"), "#f6f6f6", false);
      localStorage.setItem("cards", JSON.stringify(cards));
    });

    //Archive card
    $(document).on("click", "button.archive", function(e) {
      const result = confirm("Are you sure?");

      if (result) {
        updateCard(e.currentTarget.value, "archived", true);
        location.reload();
      }
      else {
        return false;
      }
    });

    //Add archived cards to DOM tab
    $("a[href='#archivedCards']").on("click", function() {
      $("ul.list-archived").children().remove();
      cards.forEach((card) => (card.archived) ? $("ul.list-archived").append("<li><p>" +  card.description + "</p><small>" + new Date(card.date).toISOString().substr(0, 10) + "</small></li>") : '');
    });

    //Delete card
    $(document).on("click", "button.delete", function() {
      const result = confirm("Are you sure?");

      if (result) {
        removeCard(this.value);
      }
      else {
        return false;
      }
    });

    //Add new list handler
    $("button.add-col").on("click", function() {
      const title = prompt("Enter title");
      
      if (title) {
        addColumn(title);
        localStorage.setItem("columns", columns.join(","));
      }
    });

    //Custom methods

    //Method to append an empty list item to inform the user that the list is empty
      function addEmptyListText(element) {
            const emptyListText = $("<li>").attr("class", "empty-list").html("Add a card here");
            $(element).append(emptyListText);
      }

      //Add a new column / list
      function addColumn(title) {
          columns.push(title);

          const section = $("<section>").attr("class", "card-layout");
          const newCardBtn = $("<button>").attr({"class": "new-card float-right ui-button ui-widget ui-corner-all", "aria-label": "Add new card", "data-list": title.toLowerCase().replace(" ", "")}).html("+");
          const removeColBtn = $("<button>").attr({"class": "remove-col ui-button ui-widget ui-corner-all", "aria-label": "Remove list", "data-list": title}).html("-");
          const tab = $("<ul>").append("<li>").html(title).append(removeColBtn, newCardBtn);
          const cardList = $("<ul>").attr("class", "list " + title.toLowerCase().replace(" ", ""));
          addEmptyListText(cardList);

          const col = section.append(tab, cardList);
          $("section.flex-grid").append(col);

          $( ".card-layout" ).tabs();   //The list wrapper has to be "tabbed" for each new list

          $( ".list" ).sortable({       //Make the list sortable
            update: function(event, ui) {   //Run on each update (a card is moved)
              updateCard($(ui.item).attr("id"), "list", event.target.classList[1]); //Update the card list property to the targeted list

              if ($("ul." + event.target.classList[1] + " li").length == 0) { //If the list is empty add a "empty" list item
                  addEmptyListText(this);         
              }
              else {
                  $("ul." + event.target.classList[1] + " li").remove(".empty-list");
              }
            },
              connectWith: ".list",     //Connect each list, makes it possible to drag cards to every list
              cancel: ".empty-list"     //The empty card list item should not be draggable
            }).disableSelection();
      }

      //Method to remove a list column
      function removeColumn(title) {
        columns.splice(columns.indexOf(title), 1);      //Splice method removes a string at a given index and the second parameter specifies the number of characters to remove.
                                                        //indexOf returns the position of title string

        localStorage.setItem("columns", columns.join(","));   //Save array to local storage
        location.reload();
      }

      //Add a new card
      function addCard(id, title, date, col, color, archived) {
        const cardData = {
          id: id,
          description: title,
          date: date,
          list: col,
          color: color,
          archived: archived
        }

        cards.push(cardData);     //Add card object to array

        //Create the DOM elements and append card
        if (!archived) {
          const editBtn = $("<button>").attr({"class": "edit float-right ui-button ui-widget ui-corner-all", "value": id}).html("Edit");
          const archiveBtn = $("<button>").attr({"class": "archive float-right ui-button ui-widget ui-corner-all", "value": id}).html("Archive");
          const deleteBtn = $("<button>").attr({"class": "delete float-right ui-button ui-widget ui-corner-all", "value": id}).html("Delete");
          const card = $("<li>").attr({"id": id, "class": "ui-state-default card"}).html("<p>" + title.substr(0, 250) + "</p><small>" + new Date(date).toISOString().substr(0, 10) + "</small>").append(deleteBtn, archiveBtn, editBtn).css({"background": color});
        
          $(document).find("ul." + col.toLowerCase().replace(" ", "")).append(card);

          $(document).find("ul." + col.toLowerCase().replace(" ", "") + " li.empty-list").remove();
        }
      }

      //Remove a card
      function removeCard(id) {
        $("#" + id).remove();     //Remove from DOM

        for (let i in cards) {          
          if (cards[i].id == id) {    //Find the matching object in array and remove the element
            cards.splice(i, 1);
            break;
          }
        }

        localStorage.setItem("cards", JSON.stringify(cards));
         window.location.reload();       //Update DOM
      }

      //Update a card
      function updateCard(id, property, value) {
        for (let i in cards) {
          if (cards[i].id == id) {
            cards[i][property] = value;
            break;
          }
        }
       
        localStorage.setItem("cards", JSON.stringify(cards));
      };
      
      //Get a card object from its id
      function getCard(id) {
        for (let i in cards) {
          if (cards[i].id == id) {
            return cards[i];
          }
        }
      }
});
