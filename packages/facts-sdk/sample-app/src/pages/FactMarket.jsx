import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { mapStateToProps, router } from "../store/router";
import { WarpFactory } from "warp-contracts";
import {
  DeployPlugin,
  InjectedArweaveSigner,
} from "warp-contracts-plugin-deploy";
import { deploy, buy, sell, attach } from "@facts-kit/facts-sdk-v2";

export const readState = async (tx, warp) => {
  try {
    const read = await warp
      .contract(tx)
      .connect("use_wallet")
      .setEvaluationOptions({
        internalWrites: true,
        unsafeClient: "skip",
        remoteStateSyncSource: `https://dre-u.warp.cc/contract`,
        remoteStateSyncEnabled: true,
        allowBigInt: true,
      })
      .readState();

    return read.cachedValue.state;
  } catch (error) {
    throw new Error(`There was an error evaluating state.`);
  }
};

const FactMarket = ({ tx, goToHome, goToFactMarket }) => {
  const warp = WarpFactory.forMainnet();
  const [increment, setIncrement] = useState();
  const [txClone, setTx] = useState();
  const [deployError, setDeployError] = useState();
  const [inputTx, setInputTx] = useState("");
  const [isValidTx, setIsValidTx] = useState(false);
  const [state, setState] = useState();
  const [stateError, setStateError] = useState();
  const [showIframe, setShowIframe] = useState(false);
  const [buyInputSupport, setBuyInputSupport] = useState("");
  const [sellInputSupport, setSellInputSupport] = useState("");
  const [buyInputOppose, setBuyInputOppose] = useState("");
  const [sellInputOppose, setSellInputOppose] = useState("");

  useEffect(() => {
    if (tx && tx.length === 43) setTx(tx);
  }, [tx]);

  useEffect(() => {
    if (txClone) {
      readState(txClone, warp)
        .then(setState)
        .catch((e) => {
          console.log(e);
          setStateError("There was an error fetching state.");
        });
    }
  }, [txClone, increment]);

  useEffect(() => {
    setIsValidTx(inputTx.length === 43);
  }, [inputTx]);

  const handleInputChange = (e) => {
    setInputTx(e.target.value);
  };

  const handleBuyInputChangeSupport = (e) => {
    setBuyInputSupport(e.target.value);
  };

  const handleSellInputChangeSupport = (e) => {
    setSellInputSupport(e.target.value);
  };

  const handleBuyInputChangeOppose = (e) => {
    setBuyInputOppose(e.target.value);
  };

  const handleSellInputChangeOppose = (e) => {
    setSellInputOppose(e.target.value);
  };

  return (
    <div className="mx-auto max-w-4xl p-6 border rounded-lg shadow-lg">
      {!txClone && (
        <div>
          {deployError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {deployError}</span>
            </div>
          )}

          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full"
            onClick={async () => {
              await window.arweaveWallet.connect(
                [
                  "ACCESS_ADDRESS",
                  "ACCESS_ARWEAVE_CONFIG",
                  "DISPATCH",
                  "ACCESS_PUBLIC_KEY",
                  "SIGNATURE",
                  "SIGN_TRANSACTION",
                ],
                { name: "Fact Market Example" }
              );
              const signer = new InjectedArweaveSigner(window.arweaveWallet);
              signer.getAddress = window.arweaveWallet.getActiveAddress;

              attach({
                warp,
                signer,
                deployPlugin: new DeployPlugin(),
              })({
                tags: {
                  type: "test",
                  title: "Test Fact Market",
                  description: "Testing Fact Markets",
                  renderWith: "renderer",
                  topics: [],
                },
                extraTags: [{ name: "Some", value: "Tag" }],
                data: "test fact market data",
                position: "support",
                attachToTx: "00px2DCGkrfdXUwurg98ea3aHdvpyBGdbahV4v9xihU", // https://alex.arweave.dev/#/artifact/00px2DCGkrfdXUwurg98ea3aHdvpyBGdbahV4v9xihU
              })
                .then((tx) => goToFactMarket(tx))
                .catch((e) => {
                  console.log(e);
                  setDeployError(
                    "There was an error deploying your fact market.  Check the console."
                  );
                });
            }}
          >
            Deploy Fact Market
          </button>
          <div className="mt-4 text-gray-700">or</div>
          <div className="mt-4">
            <input
              type="text"
              onChange={handleInputChange}
              placeholder="Enter TXID"
              className="border border-gray-300 rounded p-2 w-full"
            />
            <button
              onClick={() => goToFactMarket(inputTx)}
              disabled={!isValidTx}
              className={`mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-full ${
                !isValidTx && "opacity-50 cursor-not-allowed"
              }`}
            >
              Enter
            </button>
          </div>
        </div>
      )}

      {txClone && (
        <div className="mt-8">
          <h1 className="text-2xl font-semibold mb-2">
            Fact Market: {txClone}
          </h1>

          <h3 className="text-lg font-semibold mb-2">State</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <code className="text-sm block whitespace-pre-wrap">
              {JSON.stringify(state) || stateError}
            </code>
          </div>

          <h3 className="text-lg font-semibold mb-2">Position Tokens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-base font-semibold mb-2">Support</h4>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={buyInputSupport}
                  onChange={handleBuyInputChangeSupport}
                  placeholder="Amount"
                  className="border border-gray-300 rounded p-2 mr-2"
                />
                <button
                  onClick={async () => {
                    await window.arweaveWallet.connect(
                      [
                        "ACCESS_ADDRESS",
                        "ACCESS_ARWEAVE_CONFIG",
                        "DISPATCH",
                        "ACCESS_PUBLIC_KEY",
                        "SIGNATURE",
                      ],
                      { name: "Fact Market Example" }
                    );
                    const signer = new InjectedArweaveSigner(
                      window.arweaveWallet
                    );
                    signer.getAddress = window.arweaveWallet.getActiveAddress;
                    await signer.setPublicKey();

                    buy({
                      warp,
                      signer: signer,
                    })({
                      qty: Math.floor(Number(buyInputSupport)),
                      tx: txClone,
                      position: "support",
                    })
                      .then((o) => {
                        console.log(o);
                        setTimeout(() => {
                          setIncrement(increment + 1);
                        }, 5000);
                      })
                      .catch((e) => {
                        console.log("Error", e);
                      });
                  }}
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full"
                >
                  Buy
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={sellInputSupport}
                  onChange={handleSellInputChangeSupport}
                  placeholder="Amount"
                  className="border border-gray-300 rounded p-2 mr-2"
                />
                <button
                  onClick={async () => {
                    await window.arweaveWallet.connect(
                      [
                        "ACCESS_ADDRESS",
                        "ACCESS_ARWEAVE_CONFIG",
                        "DISPATCH",
                        "ACCESS_PUBLIC_KEY",
                        "SIGNATURE",
                      ],
                      { name: "Fact Market Example" }
                    );
                    const signer = new InjectedArweaveSigner(
                      window.arweaveWallet
                    );
                    signer.getAddress = window.arweaveWallet.getActiveAddress;
                    await signer.setPublicKey();

                    sell({
                      warp,
                      signer: signer,
                      env: "browser",
                    })({
                      qty: Math.floor(Number(sellInputSupport)),
                      tx: txClone,
                      position: "support",
                    })
                      .then((o) => {
                        console.log(o);
                        setTimeout(() => {
                          setIncrement(increment + 1);
                        }, 5000);
                      })
                      .catch((e) => {
                        console.log("Error", e);
                      });
                  }}
                  className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full"
                >
                  Sell
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-2">Oppose</h4>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={buyInputOppose}
                  onChange={handleBuyInputChangeOppose}
                  placeholder="Amount"
                  className="border border-gray-300 rounded p-2 mr-2"
                />
                <button
                  onClick={async () => {
                    await window.arweaveWallet.connect(
                      [
                        "ACCESS_ADDRESS",
                        "ACCESS_ARWEAVE_CONFIG",
                        "DISPATCH",
                        "ACCESS_PUBLIC_KEY",
                        "SIGNATURE",
                      ],
                      { name: "Fact Market Example" }
                    );
                    const signer = new InjectedArweaveSigner(
                      window.arweaveWallet
                    );
                    signer.getAddress = window.arweaveWallet.getActiveAddress;
                    await signer.setPublicKey();

                    buy({
                      warp,
                      signer: signer,
                    })({
                      qty: Math.floor(Number(buyInputOppose)),
                      tx: txClone,
                      position: "oppose",
                    })
                      .then((o) => {
                        console.log(o);
                        setTimeout(() => {
                          setIncrement(increment + 1);
                        }, 5000);
                      })
                      .catch((e) => {
                        console.log("Error", e);
                      });
                  }}
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full"
                >
                  Buy
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={sellInputOppose}
                  onChange={handleSellInputChangeOppose}
                  placeholder="Amount"
                  className="border border-gray-300 rounded p-2 mr-2"
                />
                <button
                  onClick={async () => {
                    await window.arweaveWallet.connect(
                      [
                        "ACCESS_ADDRESS",
                        "ACCESS_ARWEAVE_CONFIG",
                        "DISPATCH",
                        "ACCESS_PUBLIC_KEY",
                        "SIGNATURE",
                      ],
                      { name: "Fact Market Example" }
                    );
                    const signer = new InjectedArweaveSigner(
                      window.arweaveWallet
                    );
                    signer.getAddress = window.arweaveWallet.getActiveAddress;
                    await signer.setPublicKey();

                    sell({
                      warp,
                      signer: signer,
                      env: "browser",
                    })({
                      qty: Math.floor(Number(sellInputOppose)),
                      tx: txClone,
                      position: "oppose",
                    })
                      .then((o) => {
                        console.log(o);
                        setTimeout(() => {
                          setIncrement(increment + 1);
                        }, 5000);
                      })
                      .catch((e) => {
                        console.log("Error", e);
                      });
                  }}
                  className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setTx(undefined);
              goToHome();
            }}
            className="mt-4 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-full"
          >
            Clear
          </button>

          <div>
            <button
              onClick={() => {
                setShowIframe(!showIframe);
              }}
              className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-full"
            >
              {showIframe ? "Hide" : "Get U"}
            </button>

            {showIframe && (
              <iframe
                src="https://getu.ar-io.dev"
                title="getu"
                className="w-full"
                height={700}
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, router)(FactMarket);
