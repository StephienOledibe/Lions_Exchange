var sidebarOpen = false;

function toggleSidebar() {
  var sidebar = document.getElementById("sidebar"); 
  if (!sidebarOpen) {
    sidebar.classList.add("active");
    sidebarOpen = true;
  } else {
    sidebar.classList.remove("active");
    sidebarOpen = false;
  }
}
