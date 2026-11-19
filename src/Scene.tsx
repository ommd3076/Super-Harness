import { useState } from 'react';
import { IntelligentUI } from './runtime';
import { Study, studyScenes } from './study';
import { Workspace, Research, Live } from './environments';
import type { Area } from './session';

type SceneProps = {area?:Area; scene?:string; sessionId:string; instanceId:string; voiceStyle?:'fluid'|'matrix';onInspect:(detail:{title:string;body:string})=>void};
const measurement = {
  type:'stack',children:[
    {type:'heading',text:'A service measurement plan'},
    {type:'paragraph',text:'Start with traffic, slow requests, and failures. p95 marks the latency at or below which roughly 95% of observed requests completed.'},
    {type:'caption',text:'Error rate = failed requests ÷ total requests × 100%'},
    {type:'card',label:'Draft query',children:[
      {type:'code',id:'query',value:'sum(rate(http_requests_total{status=~"5.."}[5m]))\n/ sum(rate(http_requests_total[5m]))',rows:3},
      {type:'choice',id:'period',prompt:'Choose a comparison window',options:['Last hour','Previous release','Peak traffic','Same time last week']},
      {type:'input',id:'owner',label:'Who will review the findings?'},
      {type:'checkbox',id:'check',label:'Include raw request counts'},
    ]},
  ],
};

function Mixed({sessionId,instanceId,onInspect}:SceneProps) {
  const key='harness-approval:'+sessionId+':'+instanceId;
  const [decision,setDecision]=useState(()=>localStorage.getItem(key)??'');
  const choose=(value:string)=>{setDecision(value);localStorage.setItem(key,value);};
  return <div className="mixed-scene">
    <IntelligentUI definition={measurement} sessionId={sessionId} instanceId={instanceId}/>
    <Workspace sessionId={sessionId+':'+instanceId} scene="architecture" onInspect={onInspect}/>
    <section className="iu-card" aria-label="Draft approval"><strong>Review the measurement brief</strong><p>Save a local decision for the proposed comparison window.</p><div className="iu-row"><button className="iu-button" type="button" onClick={()=>choose('Approved in this demo')}>Approve draft</button><button className="iu-button" type="button" onClick={()=>choose('Changes requested')}>Request changes</button></div>{decision&&<p role="status">{decision}</p>}</section>
  </div>;
}

export function Scene(props:SceneProps) {
  const {area,scene,sessionId,instanceId,voiceStyle,onInspect}=props;
  const sceneSessionId=sessionId+':'+instanceId;
  if(scene==='mixed')return <Mixed {...props}/>;
  if(area==='Study'||studyScenes.some(item=>item.id===scene))return <Study sessionId={sceneSessionId} scene={scene}/>;
  if(area==='Workspace'||scene==='architecture'||scene==='agents')return <Workspace sessionId={sceneSessionId} scene={scene} onInspect={onInspect}/>;
  if(area==='Research'||scene==='finance'||scene==='evidence')return <Research sessionId={sceneSessionId} scene={scene} onInspect={onInspect}/>;
  if(area==='Live')return <Live sessionId={sceneSessionId} voiceStyle={voiceStyle} onInspect={onInspect}/>;
  return null;
}
