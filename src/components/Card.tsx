interface CardProps {
  question: string;
  watermark?: string;
}

export default function Card({ question, watermark = 'beehour.app' }: CardProps) {
  return (
    <div className="card card--dusk">
      <p className="card-question">{question}</p>
      <span className="card-watermark">{watermark}</span>
    </div>
  );
}
