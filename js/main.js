const menuButton = document.getElementById('menu-button');
const sideMenu = document.getElementById('side-menu');
const closeMenuButton = document.getElementById('close-menu-button');

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.documentElement.scrollTop > 5) {
        document.getElementById("navbar").classList.add("opaque");
    } else {
        document.getElementById("navbar").classList.remove("opaque");
    }
}

function getScrollbarThumbHeigth() {
    var viewportHeight = window.innerHeight;
    var contentHeight = document.body.offsetHeight;
    var scrollbarThumbHeight = viewportHeight * (viewportHeight / contentHeight);
    return scrollbarThumbHeight;
}

const injectCSS = css => {
    let el = document.createElement('style');
    el.type = 'text/css';
    el.innerText = css;
    document.head.appendChild(el);
    return el;
};

menuButton.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});

closeMenuButton.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});


window.onload = function () {
    // marginBottom = getScrollbarThumbHeigth();
    // offset = marginBottom;
    // marginBottom = ('-' + offset.toFixed(2) + 'px');
    // injectCSS('::-webkit-scrollbar-track-piece:end { margin-bottom: ' + marginBottom + '};');
}
