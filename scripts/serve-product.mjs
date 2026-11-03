// Development-only loopback server for the same allowlisted product files as Pages.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Set(['index.html','tools.html','styles.css','tools.css','favicon.svg','src/app.mjs','src/engine.mjs','src/tools.mjs','src/features.mjs','src/corpus-import.mjs']);
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',mjs:'text/javascript; charset=utf-8',svg:'image/svg+xml'};
const server=createServer(async (request,response)=>{
  const path=new URL(request.url,'http://127.0.0.1').pathname.slice(1)||'index.html';
  if (!['GET','HEAD'].includes(request.method)||!files.has(path)) {response.writeHead(404);response.end();return;}
  try{const body=await readFile(new URL('../'+path,import.meta.url));response.writeHead(200,{'Content-Type':types[path.split('.').at(-1)],'Cache-Control':'no-store'});response.end(request.method==='HEAD'?undefined:body);}
  catch{response.writeHead(500);response.end();}
});
server.listen(8765,'127.0.0.1',()=>console.log('Product preview: http://127.0.0.1:8765'));
