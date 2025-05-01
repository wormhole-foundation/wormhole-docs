document.addEventListener('DOMContentLoaded', () => {
  const selectWrapper = document.querySelector('.select-wrapper');
  const openArrow = document.querySelector('.selector-open');
  const closedArrow = document.querySelector('.selector-closed');;

  // Add event listeners
  selectWrapper.addEventListener('click', (event) => {
    selectWrapper.classList.toggle('active');
    openArrow.classList.toggle('active');
    closedArrow.classList.toggle('active');
    event.stopPropagation(); // prevent it from triggering document click
  });

  // Close on outside click
  document.addEventListener('click', (event) => {
    if (!selectWrapper.contains(event.target)) {
      selectWrapper.classList.remove('active');
      openArrow.classList.remove('active');
      closedArrow.classList.add('active');
    }
  });
});
