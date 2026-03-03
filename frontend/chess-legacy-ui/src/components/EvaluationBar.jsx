export default function EvaluationBar({ evaluation, inverted = false }) {
  const getBarHeight = () => {
    const clamped = Math.max(-1000, Math.min(1000, evaluation));
    const percentage = ((clamped + 1000) / 2000) * 100;
    return inverted ? 100 - percentage : percentage;
  };

  const getEvaluationText = () => {
    if (Math.abs(evaluation) > 1000) {
      return evaluation > 0 ? '+M' : '-M';
    }
    const pawns = (evaluation / 100).toFixed(1);
    return pawns >= 0 ? `+${pawns}` : pawns;
  };

  const whiteHeight = getBarHeight();
  const displayEval = inverted ? -evaluation : evaluation;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ 
        width: '30px', 
        height: '500px', 
        background: inverted ? '#fff' : '#000', 
        position: 'relative',
        border: '2px solid #333',
        borderRadius: '4px'
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: `${whiteHeight}%`,
          background: inverted ? '#000' : '#fff',
          transition: 'height 0.3s ease'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: whiteHeight > 50 ? (inverted ? '#fff' : '#000') : (inverted ? '#000' : '#fff'),
          fontWeight: 'bold',
          fontSize: '12px',
          zIndex: 10
        }}>
          {inverted ? (displayEval >= 0 ? `+${(displayEval/100).toFixed(1)}` : (displayEval/100).toFixed(1)) : getEvaluationText()}
        </div>
      </div>
    </div>
  );
}
