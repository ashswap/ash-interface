import AppBar from "components/AppBar";
import BackgroundEffect from "components/BackgroundEffect";

const BasicLayout = ({ children }: { children: any }) => {
    return (
        <>
            <AppBar />
            <BackgroundEffect />
            {children}
        </>
    );
};

export default BasicLayout;
