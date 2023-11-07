const ARNS_REGISTRY = "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U";

const getArnsRegistryState = async () => {
  const response = await fetch(
    `https://dre-3.warp.cc/contract/?id=${ARNS_REGISTRY}`
  );
  if (!response.ok) {
    throw new Error("Error fetching ARNS Registry state.");
  }

  return response.json();
};

getArnsRegistryState().then(console.log).catch(console.log);
