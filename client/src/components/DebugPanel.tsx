import React from "react";

let count = 0

const DebugPanel = ({
    account,
    clipboardStatus,
    handleRestoreBurners,
    spawn,
    add_item_rnd,
    combine_items,
    create_bid,
    onClose,
}) => {
    return (
        <div className="debug-panel">
            <button onClick={() => account?.create()}>
                {account?.isDeploying ? "deploying burner" : "create burner"}
            </button>
            {account && account?.list().length > 0 && (
                <button onClick={async () => await account?.copyToClipboard()}>
                    Save Burners to Clipboard
                </button>
            )}
            <button onClick={handleRestoreBurners}>
                Restore Burners from Clipboard
            </button>
            {clipboardStatus.message && (
                <div className={clipboardStatus.isError ? "error" : "success"}>
                    {clipboardStatus.message}
                </div>
            )}
            <button onClick={() => spawn(account.account)}>Spawn</button>
            <div>
                <button onClick={() => add_item_rnd(account.account, 1)}>
                    Add Item
                </button>
            </div>
            <div>
                <button onClick={() => combine_items(account.account, 0, 1)}>
                    Combo!
                </button>
            </div>
            <div>
                <button onClick={() => {count++; create_bid(account.account, count)}}>
                    Create bid!
                </button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default DebugPanel;
