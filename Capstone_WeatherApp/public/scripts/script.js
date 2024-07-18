const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-input');
const submitBtn = document.getElementById('submit-btn');
const searchBox = document.querySelector('.search-box');

searchIcon.addEventListener('click', () => {
    searchInput.classList.toggle('show-box');
    searchIcon.classList.contains('fa-magnifying-glass') ? searchIcon.classList.replace('fa-magnifying-glass', 'fa-times') : searchIcon.classList.replace('fa-times', 'fa-magnifying-glass');
});


/* document.querySelector('submit-btn').addEventListener('click', function () {
    console.log("clicked");
    
}); */