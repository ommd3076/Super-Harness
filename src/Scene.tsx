import { useState } from 'react';
import { IntelligentUI } from './runtime';
import { Study, studyScenes } from './study';
import { Workspace, Research, Live } from './environments';
import type { Area } from './session';
import { UpstreamAuditExtras } from './upstream-extras';
import { UpstreamReportTools } from './upstream/ReportTools';
import { UpstreamCode, UpstreamContext, UpstreamReview, UpstreamTasks, UpstreamTools } from './upstream/ReferenceKit';

const reviewQuestions = [
  {q:'Review the measurement brief',type:'radio',options:['Approve this local draft','Request changes']},
] as const;
const taskRows = [
  {key:'map',label:'Scope the service',amount:'2 signals',status:'done',details:[{label:'Identified traffic and error rates',meta:'Local sample'}]},
  {key:'review',label:'Review comparison window',amount:'1 decision',status:'done',details:[{label:'Prepared a local approval',meta:'Ready'}]},
] as const;


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
    <div className="reference-section">
      <UpstreamCode filename="queries/error-rate.promql" lines={['sum(rate(http_requests_total{status=~"5.."}[5m]))', '/ sum(rate(http_requests_total[5m]))']}/>
      <UpstreamContext labels={{header:'Measurement context',count:'1'}} chunks={[{title:'Request counters',chars:'Local fixture',body:'Compare the 5xx counter with all requests over the same window.',source:'Service telemetry fixture',badge:'Example',tone:'green'}]}/>
      <UpstreamTasks rows={taskRows.map(row=>({...row,details:[...row.details]}))}/>
      <UpstreamTools labels={{header:'Local activity',more:'More details'}} steps={[{icon:'read',label:'Read comparison inputs',chip:'Service measurement',mono:false,detailMono:false,detail:[{text:'Loaded the bundled request-counter fixture.'}]}]} diffs={[]} diffLines={{}}/>
      <section aria-label="Draft approval">
        {decision?<p role="status">{decision} <button type="button" className="reset-button" onClick={()=>choose('')}>Review again</button></p>:<UpstreamReview questions={reviewQuestions.map(question=>({...question,options:[...question.options]}))} labels={{sentMessage:'Local decision recorded',send:'Record decision'}} onSubmitted={answers=>choose(answers[0]?.includes(0)?'Approved in this demo':answers[0]?.includes(1)?'Changes requested':'No decision recorded')}/>}
      </section>
      <details className="report-details"><summary>Explore the report workbench</summary><UpstreamReportTools/><UpstreamAuditExtras/></details>
    </div>
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
