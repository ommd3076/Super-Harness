import PromptBar from './report-visuals/PromptBar';
import type { Session } from './session';

type ComposerProps = {
  session: Session;
  variant: string;
  tall?: boolean;
  update: (patch: Partial<Session>) => void;
  send: () => void;
  voice: () => void;
  busy: boolean;
};

export function Composer({ session, variant, tall, update, send, voice, busy }: ComposerProps) {
  return <div className="conversation-prompt">
    <PromptBar
      demo={false}
      variant={variant}
      tall={tall}
      placeholder="Ask, explore, or build anything…"
      local={{
        draft: session.draft,
        model: session.model,
        attachments: session.attachments,
        busy,
        onDraft: draft => update({ draft }),
        onModel: model => update({ model }),
        onAttachments: attachments => update({ attachments }),
        onSend: send,
        onVoice: voice,
      }}
    />
  </div>;
}
