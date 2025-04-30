document.addEventListener('DOMContentLoaded', () => {
  const selectWrapper = document.querySelector('.select-wrapper');
  const openArrow = document.querySelector('.selector-open');
  const closedArrow = document.querySelector('.selector-closed');

  // Add event listeners
  selectWrapper.addEventListener('click', () => {
    console.log('hello');
    selectWrapper.classList.toggle('active');
    openArrow.classList.toggle('active');
    closedArrow.classList.toggle('active');
  });
});
