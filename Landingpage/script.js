document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('.slide-in-section');

    function checkSlide() {
        sections.forEach(function(section) {
            var slideInAt = (window.scrollY + window.innerHeight) - section.offsetHeight / 2;
            var sectionBottom = section.offsetTop + section.offsetHeight;
            var isHalfShown = slideInAt > section.offsetTop;
            var isNotScrolledPast = window.scrollY < sectionBottom;

            if (isHalfShown && isNotScrolledPast) {
                section.classList.add('is-visible');
            }
        });
    }

    window.addEventListener('scroll', checkSlide);
    checkSlide(); // Check on load
});

function openNewContactModal() {
    document.getElementById('newContactModal').style.display = 'block';
}

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});