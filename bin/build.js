require('dotenv').config();
const appleId = process.env.APPLEID
const appleIdPassword = process.env.APPLEIDPASS

// import builder from 'electron-builder'
const builder = require("electron-builder")

builder.build(
  {
    publish: 'onTag',
    targets: builder.Platform.MAC.createTarget(),
    config: {
      appId: "io.github.chend0316.videoinfo",
      mac: {
        target: ['pkg', 'dmg', 'zip'],
        hardenedRuntime: true,
        category: "public.app-category.developer-tools",
        entitlements: "build/entitlements.mac.plist",
        entitlementsInherit: "build/entitlements.mac.plist",
        publish: ['github'],
      },
      afterSign: async (ctx) => {
        await notarizeMac(ctx)
      },
      afterAllArtifactBuild: (result) => {
        console.log(result.outDir)
      }
    }
  }
)
  .then((result) => {
    console.log(JSON.stringify(result))
  })
  .catch((error) => {
    console.error(error)
  })

const { notarize } = require('electron-notarize');
async function notarizeMac(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'io.github.chend0316.videoinfo',
    appPath: `${appOutDir}/${appName}.app`,
    appleId,
    appleIdPassword,
  });
};
