function StakeLayout({ children }: any) {
    return (
        <>
            <div className="fixed w-[16.56rem] h-[16.56rem] sm:w-[32.63rem] sm:h-[32.63rem] rounded-full bg-[#6E7395] opacity-10 blur-[100px] top-[-3.31rem] sm:top-6 left-1/2 -translate-x-1/2 z-[-1]"></div>
            <div className="sm:pb-24">
            {children}
            </div>
        </>
    );
}


export default StakeLayout;
