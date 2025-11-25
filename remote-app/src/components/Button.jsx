import viteLogo from "/vite.svg";

export default function Button() {
  return (
    <a
      href="http://remote.mylocal.com:5001"
      target="_blank"
      className="flex flex-col items-center gap-1"
    >
      <img src={viteLogo} className="logo" alt="Vite logo" />
      <span>Remote App</span>
    </a>
  );
}
