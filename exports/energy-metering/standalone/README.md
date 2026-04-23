# Metering dashboard — standalone (offline)

This folder is an **interactive**, **offline** HTML version of the Energy Metering dashboard UI (tabs, range chips, KPIs, charts) for demo inspiration.

## Run it

- Open `index.html` in a browser.

If your browser blocks some features when opening local files, run a tiny local server:

```bash
cd metering-standalone
python3 -m http.server 5179
```

Then open `http://localhost:5179`.

## Swap in your real data

- Edit `data.example.js` (or replace it with your own file) and keep the same shape:
  - `window.METERING_DATA.combined`
  - `window.METERING_DATA.electricity`
  - `window.METERING_DATA.gas`

All currency is **KRW**; the UI displays **M₩**.

## Files

- `index.html`: UI + chart logic
- `echarts.min.js`: local ECharts runtime (offline)
- `data.example.js`: placeholder data contract

