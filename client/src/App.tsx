import { useState } from "react";
import { usePlayer } from "./context/usePlayerContext";
import Farm from "./components/Farm";
import { Nav } from "./components/Nav";
import DebugPanel from "./components/DebugPanel";
import "./globals.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Build from "./components/Build";
import useWindowSize from "./hooks/useWindowSize";

const App: React.FC = React.memo(() => {
    const { width } = useWindowSize();
    
    const state = usePlayer();
    window.inventory = state.inventory;
    window.state = state;

    const [isDebugPanelVisible, setIsDebugPanelVisible] = useState(false);

    if (width >= 993) {
        return (
        <main className="flex flex-col h-full">
            <div className="big-window-msg">
                <div>
                    Game is not ready yet for this window size. Use phone instead.
                </div>
                <div>
                    We apologize for any inconvenience.
                </div>
            </div>
        </main>
        );
      }

    return (
        <main className="flex flex-col h-full">
            {isDebugPanelVisible ? (
                <DebugPanel onClose={() => setIsDebugPanelVisible(false)} />
            ) : (
                <button className="debug-button" onClick={() => setIsDebugPanelVisible(true)}>
                    Debug
                </button>
            )}
            <Nav />
            <div className="flex-grow">
                <BrowserRouter>
                    <Routes>
                        <Route path="/farm" element={<Farm onFarm={state.onFarm} account={state.account} />} />
                        <Route path="/build" element={<Build onFarm={state.onFarm} account={state.account} />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </main>
    );
})

export default App;
