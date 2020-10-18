import React, { useMemo } from 'react';

import { StoreProvider } from "easy-peasy"
import store from "./state/store"

import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { useWeb3React } from '@web3-react/core';
import ActivatePrompt from './components/ActivatePrompt';
import GlobalModal from './components/GlobalModal';
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom"
import Header from './components/Header';
import NetworkPrompt from './components/NetworkPrompt';
import BlockNumberUpdater from './components/BlockNumberUpdater';
import PendingTransactionsUpdater from './components/PendingTransactionsUpdater';
import PendingTransactionsCount from './components/PendingTransactionsCount';
import { Slide, ToastContainer } from 'react-toastify';
import classnames from "classnames"
import { useStoreState } from './state/hooks';
import NewestProposals from './components/proposals/NewestProposals';
import OldestProposals from './components/proposals/OldestProposals';
import Container from './components/Container';
import Footer from './components/Footer';

const ActiveApp = () => {
    const pendingTransactions = useStoreState(state => state.pendingTransactions)
    const margin = useMemo(() => Object.keys(pendingTransactions).length > 0, [pendingTransactions])
    return <>
        <Router>
            <ToastContainer
                position="top-center"
                className={classnames(margin && "mt-12")}
                style={{ transition: "margin-top 0.5s" }}
                toastClassName="px-6 py-1 min-h-1 text-xs"
                transition={Slide}
                autoClose={10000}
                hideProgressBar={true}
                newestOnTop={false}
                closeButton={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />

            <BlockNumberUpdater />
            <PendingTransactionsUpdater />

            <PendingTransactionsCount />

            <Route path="/" exact component={() => <Redirect to="/newest" />} />
            <Route path="/newest" exact component={NewestProposals} />
            <Route path="/oldest" exact component={OldestProposals} />
        </Router>
        <GlobalModal />
    </>
}

function App() {

    const { active, chainId } = useWeb3React()
    const triedEager = useEagerConnect()
    useInactiveListener(!triedEager)

    return (
        <StoreProvider store={store}>
            <Header />
            <Container className="mb-16" style={{ minHeight: "calc(100vh - 22rem)" }}>
                { active ? (
                    chainId?.toString() === process.env.REACT_APP_CHAIN_ID ?
                        <ActiveApp />
                    :
                        <NetworkPrompt />
                ) : (
                    <ActivatePrompt />
                ) }
            </Container>
            <Footer />
        </StoreProvider>
    );
}

export default App;
