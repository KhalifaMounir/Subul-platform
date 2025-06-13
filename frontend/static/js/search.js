// Search and Filter functionality
let filteredCourses = [...coursesData];

function initializeSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const levelFilter = document.getElementById('level-filter');
  const durationFilter = document.getElementById('duration-filter');

  // Add event listeners
  searchInput.addEventListener('input', handleSearch);
  categoryFilter.addEventListener('change', handleFilter);
  levelFilter.addEventListener('change', handleFilter);
  durationFilter.addEventListener('change', handleFilter);
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    filteredCourses = [...coursesData];
  } else {
    filteredCourses = coursesData.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm)
    );
  }
  
  applyFilters();
  displayFilteredCourses();
}

function handleFilter() {
  applyFilters();
  displayFilteredCourses();
}

function applyFilters() {
  const categoryFilter = document.getElementById('category-filter').value;
  const levelFilter = document.getElementById('level-filter').value;
  const durationFilter = document.getElementById('duration-filter').value;
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();

  filteredCourses = coursesData.filter(course => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm);

    // Category filter
    const matchesCategory = categoryFilter === '' || course.category === categoryFilter;

    // Level filter
    const matchesLevel = levelFilter === '' || course.level === levelFilter;

    // Duration filter
    const matchesDuration = durationFilter === '' || checkDurationMatch(course.duration, durationFilter);

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
  });
}

function checkDurationMatch(courseDuration, filterValue) {
  const hours = parseInt(courseDuration);
  
  switch (filterValue) {
    case 'short':
      return hours < 3;
    case 'medium':
      return hours >= 3 && hours <= 6;
    case 'long':
      return hours > 6;
    default:
      return true;
  }
}

function displayFilteredCourses() {
  const coursesGrid = document.getElementById('courses-grid');
  coursesGrid.innerHTML = '';
  
  if (filteredCourses.length === 0) {
    coursesGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>لم يتم العثور على دورات</h3>
        <p>جرب تغيير معايير البحث أو الفلترة</p>
      </div>
    `;
    return;
  }
  
  filteredCourses.forEach(course => {
    const courseCard = createCourseCard(course);
    coursesGrid.appendChild(courseCard);
  });
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('category-filter').value = '';
  document.getElementById('level-filter').value = '';
  document.getElementById('duration-filter').value = '';
  
  filteredCourses = [...coursesData];
  displayFilteredCourses();
}