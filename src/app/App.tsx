import { FC } from 'react';
import { AppProviders } from './AppProviders';
import { AppRoutes } from './AppRoutes';

const App: FC = () => {
    return (
        <AppProviders>
            <AppRoutes />
        </AppProviders>
    );
};

export default App;
