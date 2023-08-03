export const DEFUULT_MANIFEST = {
  "manifest": "arweave/paths",
  "version": "0.1.0",
  "index": {
    "path": "readme"
  },
  "paths": {
    "readme": {
      "id": "kSGwKjy0hwpanOFEFweWw5MLZ1zCgLx4q1JaEUKk7DY"
    },
    "*": {
      "id": "kSGwKjy0hwpanOFEFweWw5MLZ1zCgLx4q1JaEUKk7DY"
    }
  }
}

export const DEFUULT_CONFIG = {
  "manifest": true,
  "ant": {
    "tx": "",
    "name": "",
    "undername": ""
  },
  "pack": false,
  "readme": "t",
  "manual": {
    "manifest": "The path manifest for the deployment. (see: https://specs.arweave.dev/#/view/lXLd0OPwo-dJLB_Amz5jgIeDhiOkjXuM3-r0H_aiNj0)",
    "ant": "The tx ID of the ARNS ANT. (see: https://ar.io/arns-pilot/)",
    "pack": "Tells the cli whether or not to run npm pack in the ./dist folder.  You can also pass --pack to the cli to specify a directory to pack.",
    "readme": "The txid of the readme file (could be anything, a video, docs, etc.).  This will be the root path of the manifest and will show at (https://<your-ant>.arweave.dev."
  }
}

