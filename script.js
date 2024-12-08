function showAddPopup() {
    document.getElementById('addPopup').style.display = 'flex';
  }
  
  function closePopup() {
    document.getElementById('addPopup').style.display = 'none';
  }
  
  function handleAction(action) {
    alert(`Anda memilih: ${action}`);
    closePopup();
  }
  