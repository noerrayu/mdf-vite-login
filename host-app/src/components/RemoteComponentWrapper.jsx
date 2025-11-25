import React, { Suspense } from "react";

const RemoteHeader = React.lazy(() => import("remote_app/Header"));
const RemoteButton = React.lazy(() => import("remote_app/Button"));

const LoadingSpinner = () => (
  <div className="flex justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export const RemoteComponentWrapper = ({ username }) => {
  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <Suspense fallback={<LoadingSpinner />}>
        <RemoteHeader app="Host App" username={username} />
      </Suspense>

      <div className="mt-4 flex flex-col gap-2 max-w-[1280px] items-center">
        <h1 className="text-2xl">Host Application</h1>
        <p>
          Welcome to the Host application, below are the components pulled from
          the remote application
        </p>
        <div className="flex gap-4 align-middle justify-center m-4 p-4 bg-gradient-to-r from-violet-200 to-pink-200 w-full rounded-2xl">
          <Suspense fallback={<LoadingSpinner />}>
            <RemoteButton
              text="Remote Button"
              onClick={() =>
                alert(
                  "Well done you've imported the MF remote component successfully"
                )
              }
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
