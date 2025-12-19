import { InlineWidget } from 'react-calendly';

const MeetingScheduler = ({ url, prefill }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <InlineWidget
      url={url}
      styles={{ height: '630px' }}
      prefill={prefill}
      pageSettings={{
        primaryColor: '2563eb',
        hideGdprBanner: true,
      }}
    />
  </div>
);

export default MeetingScheduler;
