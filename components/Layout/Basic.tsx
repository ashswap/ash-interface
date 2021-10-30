import { useContext } from 'react';
import AppBar from 'components/AppBar'
import BackgroundEffect from 'components/BackgroundEffect'

const BasicLayout = ({ children }: { children: any }) => {
    return (
        <>
            {children}
            <AppBar />
            <BackgroundEffect />
        </>
    );
};

export default BasicLayout;