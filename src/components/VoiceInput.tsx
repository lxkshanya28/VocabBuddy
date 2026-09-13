import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { createSpeechRecognition, speak, supportsSpeechRecognition, supportsSpeechSynthesis } from '../services/speechRecognition';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  coachingText?: string;
  minRows?: number;
};

export function VoiceInput({ label, placeholder, value, onChange, coachingText, minRows = 5 }: Props) {
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const controller = useRef<ReturnType<typeof createSpeechRecognition>>(null);
  const speechAvailable = supportsSpeechRecognition();
  const synthesisAvailable = supportsSpeechSynthesis();

  function startListening() {
    setSpeechError('');
    const nextController = createSpeechRecognition(
      onChange,
      () => setListening(false),
      (message) => {
        setSpeechError(`Speech recognition stopped: ${message}. Text entry is available.`);
        setListening(false);
      },
    );

    if (!nextController) {
      setSpeechError('Speech recognition is not supported in this browser. Text entry is fully supported.');
      return;
    }

    controller.current = nextController;
    setListening(true);
    nextController.start();
  }

  function stopListening() {
    controller.current?.stop();
    setListening(false);
  }

  return (
    <div className="voice-input">
      <div className="field-heading">
        <label>{label}</label>
        <div className="icon-actions">
          {coachingText && (
            <button
              className="icon-button"
              type="button"
              title="Play spoken coaching"
              disabled={!synthesisAvailable}
              onClick={() => speak(coachingText)}
            >
              <Volume2 size={18} />
            </button>
          )}
          <button
            className={listening ? 'icon-button active' : 'icon-button'}
            type="button"
            title={speechAvailable ? 'Toggle microphone' : 'Microphone unavailable'}
            onClick={listening ? stopListening : startListening}
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>
      </div>
      <textarea
        rows={minRows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="support-line">
        {speechAvailable ? 'Microphone ready where browser permission is granted.' : 'Text fallback active for this browser.'}
      </div>
      {speechError && <div className="warning">{speechError}</div>}
    </div>
  );
}
