/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

$('.export').click(function sendExport() {
  $('.container').hide();
  $('.output').show();
  $('.outputTag').show();
  $('.output').text($('.container').html());
});

$('.dropbtn').click(function dropToggle() {
    $(this).parent().children()[1].classList.toggle('show');
});

//watch fot the results to be clicked
$('.result').click(function setResult(){
  var url = $(this).children('.url').text();
  var word = $(this).closest('.dropdown').ignore('div').text();
  $(this).closest('.dropdown').replaceWith('<a class="alink" href=' + url + '>' + word + '</a>');

  $.ajax({
  type: "POST",
  url: '/newEntity',
  data: {word: word, url: url},
  }).done(function (data){
    console.log(data);
  });

});

//watching for custom entry
$('.custom').click(function enterCustomURL(){
  var url = $(this).children('.url').text();
  var word = $(this).closest('.dropdown').ignore('div').text();
  var pop = prompt("Enter a URL", "https://www.Google.com");
  $(this).closest('.dropdown').replaceWith('<a class="alink" href = ' + pop + '>' + word + '</a>');

  $.ajax({
  type: "POST",
  url: '/newEntity',
  data: {word: word, url: pop},
  }).done(function (data){
    console.log(data);
  });
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

$( document ).ready(function() {
  $.fn.ignore = function(sel){
    return this.clone().find(sel||">*").remove().end();
  };

  $('.output').hide();
  $('.outputTag').hide();
});
