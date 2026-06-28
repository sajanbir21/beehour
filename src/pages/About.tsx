export default function About() {
  return (
    <>
      <div className="about-photo-wrap">
        {/* replace src with actual photo — drop file at public/images/founder.jpg */}
        <img
          src="/images/founder.jpg"
          alt="founder"
          className="about-photo"
        />
      </div>

      <div className="about-text">
        <h1 className="about-name">sajanbir singh</h1>

        <p className="about-bio">
          BEE HOUR started as an hour I was trying to give myself, most days,
          without much of a plan. These are a few small things that came out of
          that — nothing polished, nothing finished. If one of them is useful to
          you for five minutes, that's the whole point.
        </p>

        <p className="about-bio">
          I built this because I kept making tools for other people's problems
          and wanted to make something for the quieter ones — the kind that don't
          have a product brief or a deadline, just a feeling you keep coming back
          to.
        </p>
      </div>
    </>
  );
}
