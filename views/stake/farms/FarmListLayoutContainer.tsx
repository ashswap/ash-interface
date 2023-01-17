const FarmListLayoutContainer = ({children, className}: {children: any, className?: string}) => {
    return <div className={`grid gap-x-2 items-center grid-cols-[minmax(0,auto),14%,16%,30%] sm:grid-cols-[minmax(0,auto),14%,16%,30%,0.875rem] md:grid-cols-[minmax(0,auto),15%,repeat(4,15%),0.875rem] lg:grid-cols-[minmax(0,auto),repeat(5,14%),2.25rem] ${className}`}>
        {children}
    </div>
}
export default FarmListLayoutContainer;