const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');
const title = document.querySelector('.title');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
    hamButton.classList.toggle('open');
    title.classList.toggle('open');
});