const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQm1ArLE54YU7jUSm-2TH5x8dsaYTgMqPmLH6jruV00s4WNAGrML1ozXSPsM_71BPZTMKJijsgsEeEk/pub?gid=1581897548&single=true&output=csv';

let table;
let originalData = [];

function loadData() {
  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      originalData = results.data.filter(r => r.Ticker);
      if (!table) {
        initializeTable(originalData);
      } else {
        table.clear().rows.add(originalData).draw();
      }
      applyConditionalColors();
    }
  });
}

function initializeTable(data) {
  table = $('#watchlist').DataTable({
    data: data,
    columns: [
      { data: 'Ticker' },
      { data: 'Name' },
      { data: 'LTP', title: 'Price' },
      { data: 'changepct', title: '% Change' },
      { data: '7 Day Return%', title: '7-day %' },
      { data: '30 Day Return%', title: '30-day %' },
      { data: '90 Day Return%', title: '90-day %' }
    ],
    order: [[3, 'desc']],
    pageLength: 10,
    dom: 'Bfrtip',
    buttons: ['copy', 'csv', 'excel']
  });
}

function applyConditionalColors() {
  $('#watchlist tbody tr').each(function() {
    const changeText = $(this).find('td').eq(3).text();
    const change = parseFloat(changeText);
    if (change > 0) {
      $(this).css('background-color', '#e0ffe0'); // Green for gainers
    } else if (change < 0) {
      $(this).css('background-color', '#ffe0e0'); // Red for losers
    } else {
      $(this).css('background-color', '');
    }
  });
}

// Button for Top Gainers Today
$('#top-gainers').on('click', () => {
  if (table) {
    table.order([3, 'desc']).draw();
  }
});
// Button for Top Losers Today
$('#top-losers').on('click', () => {
  if (table) {
    table.order([3, 'asc']).draw();
  }
});

// Filter for Performance Period
$('#period-filter').on('change', function() {
  const period = $(this).val();
  if (!period) {
    table.search('').draw();
    return;
  }
  const colIndex = { '7': 4, '30': 5, '90': 6 }[period];
  if (table) {
    table.order([colIndex, 'desc']).draw();
  }
});

// Reset filters
$('#reset-filters').on('click', () => {
  $('#period-filter').val('');
  table.order([3, 'desc']).draw(); // Reset to default sort
});

loadData();

setInterval(() => {
  loadData();
}, 300000); // Auto-refresh every 5 mins
