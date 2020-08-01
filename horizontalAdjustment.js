$(document).ready(function () {
	$('#responsiveIcon').click(function () {
		$('#wrapper').toggleClass('active');
	})
})
{ }

function responsiveNavBar() {
	if (document.getElementById("wrapper").style.display == "none") {
		var navStatus = document.getElementById("wrapper");
		var trueStatus = window.getComputedStyle(navStatus, null).getPropertyValue("display");
		if (trueStatus == "none") {
			document.getElementById("wrapper").style.display = "block";
		}
		else {
			document.getElementById("wrapper").style.display = "none";
		}
	}
}