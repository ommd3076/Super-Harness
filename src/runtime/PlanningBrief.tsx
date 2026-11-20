import { IntelligentUI, type UINode } from './index';

const coreQuestions = [
  ['audience', 'Who is this plan for?'],
  ['outcome', 'What outcome should it achieve?'],
  ['measure', 'How will you measure success?'],
  ['constraint', 'What constraint matters most?'],
  ['owner', 'Who owns the first step?'],
];
const additionalQuestions = [
  ['budget', 'What is the budget?'],
  ['deadline', 'When is the decision due?'],
  ['baseline', 'What baseline should be used?'],
  ['risk', 'What risk is worth testing?'],
  ['dependency', 'What needs to be in place first?'],
  ['evidence', 'What evidence would change the decision?'],
  ['review', 'Who should review the result?'],
];
const questions = (list: string[][]): UINode[] =>
  list.map(([id, label])=>({ type:'input', id, label, required:true }));
const starterDraft = 'Run a measured pilot before expanding the rollout.';

const plan: UINode = {
  type:'stack',
  children:[
    { type:'heading', text:'Build a decision brief' },
    { type:'paragraph', text:'Clarify the work, compare a scenario, and test how the decision would read. Everything stays in this conversation.' },
    {
      type:'form', id:'brief', label:'Clarify the scope',
      children:[
        { type:'choice', id:'depth', prompt:'Interview length', required:true, options:[
          { label:'One question', value:'one' },
          { label:'Five questions', value:'five' },
          { label:'Twelve questions', value:'twelve' },
        ] },
        ...questions(coreQuestions.slice(0,1)),
        { type:'conditional', when:{id:'depth',truthy:true}, children:[
          { type:'conditional', when:{id:'depth',notEquals:'one'}, children:questions(coreQuestions.slice(1)) },
        ] },
        { type:'conditional', when:{id:'depth',equals:'twelve'}, children:questions(additionalQuestions) },
      ],
    },
    {
      type:'reveal', id:'model', label:'Explore the decision',
      children:[{ type:'stack', children:[
        { type:'range', id:'demand', label:'Demand scenario (%)', min:50, max:150, step:5, value:100 },
        { type:'chart', id:'volume', label:'Requests per week', binding:'demand', points:[
          {label:'Week 1',value:45}, {label:'Week 2',value:57}, {label:'Week 3',value:62}, {label:'Week 4',value:73},
        ]},
        { type:'table', id:'criteria', label:'Decision criteria', editable:true, columns:['Criterion','Evidence','Threshold'],
          data:[['Cost','Rollout estimate','Below baseline'],['Reliability','Request counters','99.9% success']] },
        { type:'diagram', label:'Decision path', blocks:[
          {label:'Collect a baseline',description:'Measure traffic and failures together.'},
          {label:'Compare demand',description:'Check the estimate against the rollout threshold.'},
          {label:'Record the decision',description:'Keep the chosen option and the reason.'},
        ] },
      ] }],
    },
    {
      type:'reveal', id:'preview', label:'Draft and preview the artifact',
      children:[{ type:'stack', children:[
        { type:'textarea', id:'draft', label:'Decision note', value:starterDraft },
        { type:'mini-app', label:'Isolated draft preview', binding:'draft', value:starterDraft },
        { type:'approval', id:'approval', label:'Approve this local decision brief?' },
      ] }],
    },
  ],
};

export function PlanningBrief({ sessionId, instanceId }: { sessionId:string; instanceId:string }) {
  return <IntelligentUI definition={plan} sessionId={sessionId} instanceId={instanceId}/>;
}
