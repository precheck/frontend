/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

$('.dropbtn').click(function dropToggle() {
    $(this).parent().children()[1].classList.toggle('show');
});

//watch fot the results to be clicked
$('.result').click(function setResult(){
  var url = $(this).children('.url').text();
  var word = $(this).closest('.dropdown').ignore('div').text();
  $(this).closest('.dropdown').replaceWith('<a class="alink" href=' + url + '>' + word + '</a>');
});

//watching for custom entry
$('.custom').click(function enterCustomURL(){
  var url = $(this).children('.url').text();
  var word = $(this).closest('.dropdown').ignore('div').text();
  var pop = prompt("Enter a URL", "https://www.Google.com");
  $(this).closest('.dropdown').replaceWith('<a class="alink" href = ' + pop + '>' + word + '</a>');
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
});
