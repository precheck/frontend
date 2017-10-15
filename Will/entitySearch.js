//getting the text from the text area
$("#submitBtn").on("click", textGrab);

function textGrab(){

  var text = {inputText: $("#textarea").val()};

  console.log(text);

  var url = "localhost:15000";
  $.ajax({
    type: 'POST',
    url: url,
    async: false,
    data: text,
    success: function(resp){
        console.log(resp);
    }
  });
};
