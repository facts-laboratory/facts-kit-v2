import { useEffect, useState } from 'react';
import PathsDropdown from './components/Paths'; // Adjust the import path based on your project structure

const App = () => {
  const [manifest, setNewManifest] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    getPaths().then(setNewManifest).catch(setError);
  }, []);

  return (
    <div className="w-full flex flex-col items-start relative grow pt-4">
      {manifest && <PathsDropdown paths={manifest?.paths} />}
      {error && (
        <p>
          {error?.message ||
            error ||
            'An error occurred' ||
            'Error loading versions from /manifest.'}
        </p>
      )}
      {manifest && (
        <iframe
          allowFullScreen
          width={900}
          style={{
            width: '100%',
            height: '100vh', // 100% of viewport height
            border: 'none', // Remove border
          }}
          src={`https://arweave.net/0OiFO2EN2VkEF0PZMj5IhWVHtGKX2WZNC5YTv-G8bkc/?tx=${manifest?.paths['readme']?.id}`}
        />
      )}
    </div>
  );
};

export default App;

async function getPaths() {
  const host = getHost();
  console.log('HOST', host);
  const response = await fetch(import.meta.env.VITE_MANIFEST || 'OOPS');

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

/**
 * Gets the host to fetch using the gateway currently being used.
 *
 * @author @jshaw-ar
 * @return {*}
 */
function getHost() {
  const urlObj = new URL(window.location.href);
  console.log('URLOBJ', urlObj);
  const host = urlObj.host;
  if (host.includes('localhost')) {
    console.log('TESTING');
    return 'arweave.net';
  }
  return host;
}
