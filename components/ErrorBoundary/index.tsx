import React from "react";
import * as Sentry from "@sentry/nextjs";
function ErrorBoundary({ children }: any) {
    return (
        <Sentry.ErrorBoundary
            beforeCapture={(scope) => {
                scope.setLevel("fatal");
            }}
            fallback={() => {
                return (
                    <div className="w-screen h-screen flex flex-col items-center justify-center bg-ash-dark-600 text-white text-center">
                        <div className="text-xl mb-10">Oops, something wrong.</div>
                        <button
                            className="px-6 h-10 text-sm bg-pink-600 flex items-center justify-center"
                            onClick={() => window.location.reload()}
                        >
                            Click here to reset!
                        </button>
                    </div>
                );
            }}
        >
            {children}
        </Sentry.ErrorBoundary>
    );
}

export default ErrorBoundary;
