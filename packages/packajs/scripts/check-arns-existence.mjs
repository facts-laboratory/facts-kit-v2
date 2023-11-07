const ARNS_REGISTRY = "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U";
import fetch from "node-fetch";

const nameToBuy = "saif";

const checkArnsExistence = async () => {
  const response = await fetch(
    `https://dre-3.warp.cc/contract/?id=${ARNS_REGISTRY}`
  );
  if (!response.ok) {
    throw new Error("Error fetching ARNS Registry state.");
  }
  const results = await response.json();
  return results.state.records;
};

checkArnsExistence()
  .then((records) => {
    if (records[nameToBuy]) {
      console.log("ArNS name already exists");
    }
  })
  .catch(console.log);
