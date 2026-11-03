import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const child=spawn(process.platform==='win32'?'codex.exe':'codex',['app-server','--stdio'],{stdio:['pipe','pipe','pipe']});
let buffer='';const pending=new Map();let id=0;
const timeout=setTimeout(()=>{console.error('Codex discovery timed out');child.kill();process.exitCode=1;},20000);
child.on('error',error=>{console.error(error.message);clearTimeout(timeout);process.exitCode=1;});
child.stdout.on('data',data=>{buffer+=data;let n;while((n=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,n);buffer=buffer.slice(n+1);try{const m=JSON.parse(line);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}}catch{}}});
const request=(method,params)=>new Promise(resolve=>{const key=++id;pending.set(key,resolve);child.stdin.write(JSON.stringify({id:key,method,params})+'\n');});
try{
const initialized=await request('initialize',{clientInfo:{name:'project-skills-verification',version:'1.0.0'}});
assert.ok(!initialized.error,JSON.stringify(initialized.error));
child.stdin.write(JSON.stringify({method:'initialized'})+'\n');
const response=await request('skills/list',{cwds:[process.cwd()],forceReload:true});
assert.ok(!response.error,JSON.stringify(response.error));
const item=response.result.data[0];assert.deepEqual(item.errors,[]);
const skills=item.skills.filter(s=>s.scope==='repo');
assert.deepEqual(skills.map(s=>s.name).sort(),['frontend-responsive-ui','planner']);
assert.ok(skills.every(s=>s.enabled));
console.log(JSON.stringify(skills.map(({name,scope,enabled})=>({name,scope,enabled})),null,2));
}finally{clearTimeout(timeout);child.kill();}
