import NavGov from "components/Nav/NavGov";

function GovLayout({ children }: any) {
    return (
        <>
            <div className="pt-6 sm:pt-16 pb-14 px-6 ash-container flex flex-col items-center">
                <h1 className="mb-6 text-3xl font-bold text-white">
                    Governance
                </h1>
                <div className="max-w-full">
                    <NavGov />
                </div>
            </div>
            {children}
        </>
    );
}

export default GovLayout;
