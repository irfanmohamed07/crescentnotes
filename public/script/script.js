function toggleDropdown() {
    var dropdown = document.getElementById('dropdown-menu');
    var isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
  
    if (!isVisible) {
        var rect = dropdown.getBoundingClientRect();
        var viewportWidth = window.innerWidth;
  
        if (rect.left) {
            dropdown.style.left = 'auto';
            dropdown.style.right = 0;
        }  
    }
  }
  window.onload = () => {
    // Check if the page URL contains the '#notes' hash
    if (window.location.hash === '#notes') {
      // Smooth scroll to the notes section
      document.getElementById('notes').scrollIntoView({
        behavior: 'smooth', // smooth scrolling effect
        block: 'start' // aligns the target at the top of the container
      });
    }
  };