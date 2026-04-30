// BCIT Parking App - script.js
// ACIT 2911 - Group Project

// ---- Hamburger menu ----
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', function() {
  if (mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
  } else {
    mobileMenu.classList.add('open');
  }
});


// ---- Sidebar toggle ----
var sidebar = document.getElementById('sidebar');
var collapseBtn = document.getElementById('collapseBtn');
var collapseIcon = document.getElementById('collapseIcon');
var toggleBtn = document.getElementById('toggleBtn');
var toggleIcon = document.getElementById('toggleIcon');
var isCollapsed = false;

function toggleSidebar() {
  isCollapsed = !isCollapsed;

  if (isCollapsed) {
    sidebar.classList.add('collapsed');
    toggleBtn.classList.add('collapsed');
    collapseIcon.classList.remove('fa-chevron-left');
    collapseIcon.classList.add('fa-chevron-right');
    toggleIcon.classList.remove('fa-chevron-left');
    toggleIcon.classList.add('fa-chevron-right');
  } else {
    sidebar.classList.remove('collapsed');
    toggleBtn.classList.remove('collapsed');
    collapseIcon.classList.remove('fa-chevron-right');
    collapseIcon.classList.add('fa-chevron-left');
    toggleIcon.classList.remove('fa-chevron-right');
    toggleIcon.classList.add('fa-chevron-left');
  }

  // update the toggle button position
  updateTogglePosition();
}

collapseBtn.addEventListener('click', toggleSidebar);
toggleBtn.addEventListener('click', toggleSidebar);

// position the fixed toggle button vertically at the map midpoint
function updateTogglePosition() {
  var mapArea = document.getElementById('mapArea');
  if (!mapArea) return;
  var rect = mapArea.getBoundingClientRect();
  var midY = rect.top + rect.height / 2;
  toggleBtn.style.top = midY + 'px';
}

updateTogglePosition();
window.addEventListener('resize', updateTogglePosition);
window.addEventListener('scroll', updateTogglePosition);


// ---- Filter dropdown ----
var filterBtn = document.getElementById('filterBtn');
var filterDropdown = document.getElementById('filterDropdown');

filterBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  if (filterDropdown.style.display === 'none' || filterDropdown.style.display === '') {
    filterDropdown.style.display = 'block';
  } else {
    filterDropdown.style.display = 'none';
  }
});

// close filter if clicked outside
document.addEventListener('click', function(e) {
  if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
    filterDropdown.style.display = 'none';
  }
});


// ---- Lot data for modal ----
var lots = {
  lot1: {
    name: 'North Parkade',
    address: '555 Seymour Street<br>Vancouver, BC V6B 3H6',
    status: 'available',
    statusLabel: 'Available',
    spots: '12 spots currently open',
    rates: [
      { period: 'Daytime',  hours: '8:00 AM – 6:00 PM',   rate: '$3.00 / 30 min – Max $25.00' },
      { period: 'Evenings', hours: '6:00 PM – 12:00 AM',  rate: '$2.00 / 30 min – Max $10.00' },
      { period: 'Weekends', hours: 'All day',              rate: '$2.00 / 30 min – Max $10.00' }
    ],
    permits: ['Student', 'Faculty and Staff', 'Visitor'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1301!2d-123.1193!3d49.2827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548671a3e1f8a7e1%3A0x2e5a6f9f3e4c1234!2sBCIT%20Downtown%20Campus!5e0!3m2!1sen!2sca!4v1680000000000'
  },
  lot2: {
    name: 'Downtown Surface Lot A',
    address: '270 Dunsmuir Street<br>Vancouver, BC V6B 1X4',
    status: 'limited',
    statusLabel: 'Limited',
    spots: '3 spots currently open',
    rates: [
      { period: 'Daytime',  hours: '12:00 AM – 11:59 PM', rate: '$4.50 / hr – No Maximum' },
      { period: 'Evenings', hours: 'Same as day',          rate: '$4.50 / hr – No Maximum' },
      { period: 'Weekends', hours: 'Same as day',          rate: '$4.50 / hr – No Maximum' }
    ],
    permits: ['Student', 'Visitor'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1301!2d-123.1193!3d49.2827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548671a3e1f8a7e1%3A0x2e5a6f9f3e4c1234!2sBCIT%20Downtown%20Campus!5e0!3m2!1sen!2sca!4v1680000000000'
  },
  lot3: {
    name: 'East Parkade',
    address: '555 W Hastings Street<br>Vancouver, BC V6B 4N6',
    status: 'full',
    statusLabel: 'Full',
    spots: '0 spots currently open',
    rates: [
      { period: 'Daytime',  hours: '6:00 AM – 6:00 PM',  rate: '$2.25 / 30 min – Max $22.00' },
      { period: 'Evenings', hours: '6:00 PM – 6:00 AM',  rate: '$2.25 / 30 min – Max $11.00' },
      { period: 'Weekends', hours: 'All day',             rate: '$2.25 / 30 min – Max $11.00' }
    ],
    permits: ['Student', 'Faculty and Staff'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1301!2d-123.1193!3d49.2827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548671a3e1f8a7e1%3A0x2e5a6f9f3e4c1234!2sBCIT%20Downtown%20Campus!5e0!3m2!1sen!2sca!4v1680000000000'
  },
  lot4: {
    name: 'West Surface Lot B',
    address: '345 Robson Street<br>Vancouver, BC V6B 6B3',
    status: 'available',
    statusLabel: 'Available',
    spots: '8 spots currently open',
    rates: [
      { period: 'Daytime',  hours: '8:00 AM – 5:00 PM',   rate: '$3.00 / hr – Max $18.00' },
      { period: 'Evenings', hours: '5:00 PM – 12:00 AM',  rate: '$2.00 / hr – Max $8.00' },
      { period: 'Weekends', hours: 'All day',              rate: '$2.00 / hr – Max $8.00' }
    ],
    permits: ['Student', 'Faculty and Staff', 'Visitor'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1301!2d-123.1193!3d49.2827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548671a3e1f8a7e1%3A0x2e5a6f9f3e4c1234!2sBCIT%20Downtown%20Campus!5e0!3m2!1sen!2sca!4v1680000000000'
  }
};


// ---- Modal open/close ----
function openModal(lotId) {
  var lot = lots[lotId];
  if (!lot) return;

  // fill in the modal content
  document.getElementById('modalName').textContent = lot.name;
  document.getElementById('modalAddress').innerHTML = lot.address;
  document.getElementById('modalSpots').textContent = lot.spots;
  document.getElementById('modalMap').src = lot.mapSrc;

  var badge = document.getElementById('modalBadge');
  badge.textContent = lot.statusLabel;
  badge.className = 'modal-badge ' + lot.status;

  // rates table
  var ratesHtml = '';
  for (var i = 0; i < lot.rates.length; i++) {
    ratesHtml += '<tr><td>' + lot.rates[i].period + '</td><td>' + lot.rates[i].hours + '</td><td>' + lot.rates[i].rate + '</td></tr>';
  }
  document.getElementById('modalRates').innerHTML = ratesHtml;

  // permits list
  var permitsHtml = '';
  for (var j = 0; j < lot.permits.length; j++) {
    permitsHtml += '<li>' + lot.permits[j] + '</li>';
  }
  document.getElementById('modalPermits').innerHTML = permitsHtml;

  // disable reserve button if lot is full
  var reserveBtn = document.getElementById('reserveBtn');
  if (lot.status === 'full') {
    reserveBtn.disabled = true;
  } else {
    reserveBtn.disabled = false;
  }

  // directions button
  document.getElementById('directionsBtn').onclick = function() {
    window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(lot.name + ' Vancouver BC'), '_blank');
  };

  document.getElementById('modalOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('modalMap').src = '';
  document.body.style.overflow = '';
}

// close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});
