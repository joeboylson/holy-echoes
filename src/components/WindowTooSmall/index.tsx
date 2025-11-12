export default function WindowTooSmall() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <p className="p-6 max-w-[500px]">
        It looks like your window is a bit too small to display this page
        properly.
        <br />
        <br />
        For the best experience, please resize your window or view this page on
        a larger screen.
        <br />
        <br />
        Thanks!
      </p>
    </div>
  );
}
