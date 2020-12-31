import Link from "next/link";

function Layout({ children }) {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-500 mb-3 p-3 text-center to-blue-800">
        <h1 className="font-light text-white text-2xl">
          <Link href="/">
            <a>When I Work</a>
          </Link>
        </h1>
      </div>

      <main>{children}</main>
    </>
  );
}

export default Layout;
