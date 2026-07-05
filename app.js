(function () {
  const isLoginPage = !!document.getElementById('login-form');
  const isDashboardPage = !!document.getElementById('peserta-table');

  if (isLoginPage) {
    initLogin();
  }

  if (isDashboardPage) {
    initDashboard();
  }

  function initLogin() {
    var form = document.getElementById('login-form');
    var errorEl = document.getElementById('login-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorEl.textContent = '';

      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;

      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            localStorage.setItem('panitia_token', data.token);
            localStorage.setItem('panitia_login', 'true');
            window.location.href = 'dashboard.html';
          } else {
            errorEl.textContent = data.message || 'Login gagal';
          }
        })
        .catch(function () {
          errorEl.textContent = 'Gagal terhubung ke server';
        });
    });
  }

  function initDashboard() {
    if (localStorage.getItem('panitia_login') !== 'true') {
      window.location.href = 'login.html';
      return;
    }

    var btnLogout = document.getElementById('btn-logout');
    btnLogout.addEventListener('click', function () {
      localStorage.removeItem('panitia_token');
      localStorage.removeItem('panitia_login');
      window.location.href = 'login.html';
    });

    fetch('/api/peserta')
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success && result.data) {
          renderTable(result.data);
          updateStats(result.data.length);
        } else {
          document.getElementById('dashboard-error').textContent =
            result.message || 'Gagal memuat data';
        }
      })
      .catch(function () {
        document.getElementById('dashboard-error').textContent =
          'Gagal terhubung ke server';
      });
  }

  function renderTable(peserta) {
    var tbody = document.getElementById('peserta-tbody');
    tbody.innerHTML = '';

    if (!peserta || peserta.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Belum ada data peserta</td></tr>';
      return;
    }

    peserta.forEach(function (item, index) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + (index + 1) + '</td>' +
        '<td>' + escapeHtml(item.nama || '-') + '</td>' +
        '<td>' + escapeHtml(item.lomba || '-') + '</td>' +
        '<td>' + escapeHtml(item.kategori || '-') + '</td>' +
        '<td>' + escapeHtml(item.status || '-') + '</td>';
      tbody.appendChild(tr);
    });
  }

  function updateStats(total) {
    document.getElementById('total-peserta').textContent = total;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
