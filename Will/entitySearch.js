//getting the text from the text area
$("#submitBtn").on("click", textGrab2);

function textGrab(){

  var text = $("#textarea").val();

  console.log(text);

  var reg = new RegExp("Google", 'gi');

  var txt = $("#textarea").val().replace(reg, function(str) {
      return "<span class='highlight'>" + str + "</span>"
  });
};

function textGrab2(){

  var find = 'Google';
  var re = new RegExp(find, 'g');

  str = $("#textarea").val().replace(re, 'TEST');

  console.log(str);

};
