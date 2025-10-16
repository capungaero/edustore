const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'palugada-sample.json');
if (!fs.existsSync(file)) {
  console.error('Sample file not found:', file);
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const allowedKeys = ['orders','transactions','agendas','reminders','appLogo','jenisLista','satuanList','instansiList','priceConfig'];

console.log('Keys present in sample JSON:');
Object.keys(data).forEach(k => {
  if (allowedKeys.includes(k)) {
    const v = data[k];
    if (Array.isArray(v)) {
      console.log(`- ${k}: array length=${v.length}`);
    } else if (v && typeof v === 'object') {
      console.log(`- ${k}: object with keys=${Object.keys(v).length}`);
    } else {
      console.log(`- ${k}: ${String(v)}`);
    }
  } else {
    console.log(`- ${k}: (IGNORED) not in allowedKeys`);
  }
});

console.log('\nThis script simulates what the Konfigurasi import will write into localStorage.');
