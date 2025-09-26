# Advanced Watchlist GitHub Repo

This repository is ready for direct upload to GitHub. It fetches live data from your Google Sheet CSV URL and provides interactive filters and conditional formatting using DataTables.

## File Structure
```
advanced-watchlist/
├─ index.html
├─ script.js
├─ style.css
└─ README.md
```

---

## index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Advanced Watchlist</title>
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
  <script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Real-Time Watchlist</h1>
  <div id="controls">
    <button id="top-gainers">Top Gainers Today</button>
    <button id="top-losers">Top Losers Today</button>
    <select id="period-filter">
      <option value="">Select Period</option>
      <option value="7">Top 7-day</option>
      <option value="30">Top 30-day</option>
      <option value="90">Top 90-day</option>
    </select>
  </div>
  <table id="watchlist" class="display" style="width:100%">
    <thead>
      <tr>
        <th>Ticker</th><th>Name</th><th>Price</th><th>% Change</th>
        <th>7-day %</th><th>30-day %</th><th>90-day %</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
  <script src="script.js"></script>
</body>
</html>
```

---

## script.js
```javascript
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQm1ArLE54YU7jUSm-2TH5x8dsaYTgMqPmLH6jruV00s4WNAGrML1ozXSPsM_71BPZTMKJijsgsEeEk/pub?gid=1581897548&single=true&output=csv';
let table;

function loadData() {
  Papa.parse(CSV_URL, {
    download: true, header: true, dynamicTyping: true,
    complete: ({ data }) => {
      const rows = data.filter(r => r.Ticker);
      if (!table) {
        table = $('#watchlist').DataTable({
          data: rows,
          columns: [
            { data:'Ticker' },{ data:'Name' },{ data:'LTP', title:'Price' },
            { data:'changepct', title:'% Change' },
            { data:'7 Day Return%', title:'7-day %' },
            { data:'30 Day Return%', title:'30-day %' },
            { data:'90 Day Return%', title:'90-day %' }
          ],
          order: [[3,'desc']],
          pageLength: 25,
          dom: 'Bfrtip',
          buttons: ['copy','csv','excel']
        });
      } else {
        table.clear().rows.add(rows).draw();
      }
    }
  });
}

$('#top-gainers').click(() => table.order([3,'desc']).draw());
$('#top-losers').click(() => table.order([3,'asc']).draw());
$('#period-filter').change(function(){
  const p = $(this).val(); if (!p) return loadData();
  const idx = {'7':4,'30':5,'90':6}[p];
  table.order([idx,'desc']).draw();
});

loadData();
setInterval(loadData, 30000);

$('#watchlist').on('draw.dt', () => {
  $('#watchlist tbody tr').each(function(){
    const change = parseFloat($(this).find('td').eq(3).text());
    $(this).css('background', change>0? '#e0ffe0': change<0? '#ffe0e0':'' );
  });
});
```

---

## style.css
```css
body { font-family: Arial, sans-serif; margin: 20px; }
h1 { text-align: center; }
#controls { text-align: center; margin-bottom: 10px; }
#controls button, #controls select { margin: 0 5px; padding: 5px 10px; }
#watchlist { width: 100%; }
```

---

## README.md
```markdown
# Advanced Watchlist

This is a real-time interactive watchlist webpage that fetches data from a Google Sheets CSV and displays it using DataTables. Features:
- Top Gainers/Losers Today
- Top 7/30/90-Day Performance Filters
- Conditional Row Formatting
- Export buttons (copy, CSV, Excel)

## Deployment
1. Upload all files to a GitHub repo.
2. Enable GitHub Pages (Settings → Pages → Branch: main, /root).
3. Visit: `https://<USERNAME>.github.io/<REPO-NAME>`.
```
