const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'app');

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith('.html')) files.push(p);
  }
  return files;
}

const skip = /components[\\/]dashboard-grid-modal|[\\/]login[\\/]|[\\/]Nav[\\/]|inicio[\\/]inicio\.component\.html/;

function migrate(html) {
  let s = html;
  s = s.replace(/class="submit margin-right btn-volver"/g, 'class="btn-iflow btn-iflow--secondary"');
  s = s.replace(/class="submit btn-volver"/g, 'class="btn-iflow btn-iflow--secondary"');
  s = s.replace(/class="btn btn-rounded\s+btn-sm"/g, 'class="btn-iflow btn-iflow--icon"');
  s = s.replace(/class="btn btn-rounded bi bi-trash3\s+btn-sm"/g, 'class="btn-iflow btn-iflow--icon"');
  s = s.replace(/class="submit margin-right"/g, 'class="btn-iflow btn-iflow--primary"');
  s = s.replace(/class="submit"/g, 'class="btn-iflow btn-iflow--primary"');
  s = s.replace(/type="submit" class="modal-footer__btn"/g, 'type="submit" class="btn-iflow btn-iflow--primary"');
  s = s.replace(/type="button" class="modal-footer__btn"/g, 'type="button" class="btn-iflow btn-iflow--secondary"');
  s = s.replace(/class="modal-footer__btn"/g, 'class="btn-iflow btn-iflow--secondary"');
  s = s.replace(/class="btn btn-secondary"/g, 'class="btn-iflow btn-iflow--secondary"');
  s = s.replace(/type="submit" class="btn btn-primary"/g, 'type="submit" class="btn-iflow btn-iflow--primary"');
  s = s.replace(/type="button" class="btn btn-primary"/g, 'type="button" class="btn-iflow btn-iflow--primary"');
  s = s.replace(/class="btn btn-primary"/g, 'class="btn-iflow btn-iflow--primary"');

  s = s.replace(
    /type="button" class="btn-iflow btn-iflow--secondary" \(click\)="guardarDocumento\(\)"/g,
    'type="button" class="btn-iflow btn-iflow--primary" (click)="guardarDocumento()"'
  );
  s = s.replace(
    /type="button" class="btn-iflow btn-iflow--secondary">Enviar<\/button>/g,
    'type="button" class="btn-iflow btn-iflow--primary">Enviar</button>'
  );
  s = s.replace(
    /class="btn-iflow btn-iflow--secondary" role="button">Guardar<\/button>/g,
    'class="btn-iflow btn-iflow--primary" role="button">Guardar</button>'
  );
  s = s.replace(
    /class="btn-iflow btn-iflow--secondary" \(click\)="cerrarModal[^"]*" role="button">Aceptar<\/button>/g,
    (m) => m.replace('btn-iflow--secondary', 'btn-iflow--primary')
  );
  s = s.replace(
    /class="btn-iflow btn-iflow--secondary" \(click\)="cerrarModal[^"]*" role="button">Guardar<\/button>/g,
    (m) => m.replace('btn-iflow--secondary', 'btn-iflow--primary')
  );
  s = s.replace(
    /type="button" class="btn-iflow btn-iflow--secondary" \(click\)="generaPdfSolicitudes\(\)"/g,
    'type="button" class="btn-iflow btn-iflow--primary" (click)="generaPdfSolicitudes()"'
  );
  return s;
}

let changed = 0;
for (const file of walk(root)) {
  if (skip.test(file)) continue;
  const rel = path.relative(root, file);
  if (!/(solicitudes|expedientes|mensajes|procedimientos|features|error404|inicio)/.test(rel)) continue;
  const orig = fs.readFileSync(file, 'utf8');
  if (!/submit|modal-footer__btn|btn-rounded|btn btn-primary|btn btn-secondary/.test(orig)) continue;
  const next = migrate(orig);
  if (next !== orig) {
    fs.writeFileSync(file, next, 'utf8');
    changed++;
    console.log('updated', rel);
  }
}
console.log('total', changed);
