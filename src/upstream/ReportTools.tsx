import ThinkingState from './ThinkingState';
import RecommendationCard from './RecommendationCard';
import DiffTable from './DiffTable';
import FilterTable from './FilterTable';
import SearchList from './SearchList';
import Flowchart from './Flowchart';
import FineTuneCard from './FineTuneCard';

/** Local, self-contained service measurement examples built from the upstream primitives. */
export function UpstreamReportTools() {
  return <div className="report-tools-grid">
    <section><h3>Measurement trace</h3><ThinkingState variant="Steps" active="Checking local service signals" done="Reviewed service signals" rows={[
      { primary: 'Read request counter fixture', secondary: 'local sample' },
      { primary: 'Compare latency windows', secondary: 'p50 and p95' },
      { primary: 'Check failed request ratio', secondary: '5xx / total' },
      { primary: 'Prepare measurement summary' },
    ]}/></section>
    <section><h3>Recommendation</h3><RecommendationCard labels={{title:'Suggested measurement window', alternatives:'Compare', otherOptions:'Other windows', accepted:'Selected'}} options={[
      {key:'peak',body:<>Compare peak traffic with the previous release.</>,short:'Peak traffic vs previous release',signal:3,tone:'var(--green)',label:'Best coverage',cta:'Use window',ctaVariant:'accent'},
      {key:'week',body:<>Compare the same hour from last week.</>,short:'Same time last week',signal:2,tone:'var(--orange)',label:'Useful baseline',cta:'Use baseline',ctaVariant:'primary'},
      {key:'hour',body:<>Inspect the last hour of local sample data.</>,short:'Last hour',signal:1,tone:'var(--ink-3)',label:'Recent only',cta:'Use recent',ctaVariant:'primary'},
    ]}/></section>
    <section><h3>Proposed query changes</h3><DiffTable rows={[
      {key:'rate',id:'5xx rate',dept:'Service',email:'Add failure ratio',removed:false},
      {key:'p95',id:'p95 latency',dept:'Service',email:'Add latency percentile',removed:false},
      {key:'debug',id:'Debug labels',dept:'Optional',email:'Remove high-cardinality labels',removed:true},
    ]}/></section>
    <section><h3>Measurement tasks</h3><FilterTable rows={[
      {task:'Capture request volume',date:'Today',status:'done',owner:'Local fixture'},
      {task:'Compare p95 latency',date:'Today',status:'progress',owner:'Service team'},
      {task:'Review 5xx ratio',date:'Next',status:'todo',owner:'On-call'},
    ]}/></section>
    <section><h3>Find a measurement</h3><SearchList items={['Inspect request volume','Compare p95 latency','Review 5xx ratio','Check release baseline','Export local sample']}
      labels={{placeholder:'Search service measurements…',ariaLabel:'Search service measurements',emptyTitle:'No matching measurements',emptyHint:'Try another service signal'}}/></section>
    <section><h3>Measurement workflow</h3><Flowchart steps={[
      {id:'request',row:0,x:.5,w:300,kind:{label:'Input',hue:'#9a5cff'},hue:'#9a5cff',title:'Request counters',caption:'Read local service sample'},
      {id:'check',row:1,x:.5,w:356,kind:{label:'Condition',hue:'#f09a2f'},condition:true},
    ]}/></section>
    <section><h3>Report layout controls</h3><FineTuneCard labels={{title:'Service report card',type:'Signal group',placeholder:'Select group',layout:'Layout',adjust:'Adjust',edited:'Edited'}} options={['Latency','Traffic','Errors']}/></section>
  </div>;
}
