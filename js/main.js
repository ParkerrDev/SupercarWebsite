window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.documentElement.scrollTop > 5) {
        document.getElementById("navbar").classList.add("opaque");
    } else {
        document.getElementById("navbar").classList.remove("opaque");
    }
}

const menuButton = document.getElementById('menu-button');
const sideMenu = document.getElementById('side-menu');

menuButton.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});